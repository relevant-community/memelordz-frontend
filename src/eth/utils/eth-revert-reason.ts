// This file is a modified version of the following library:
// https://github.com/authereum/eth-revert-reason
// implemented changes:
// - add _tx parameter so we can call a tx without a txHash
// - handle Ganache errors

import { utils, constants, getDefaultProvider, providers } from 'ethers';

const { toUtf8String } = utils;
const { AddressZero } = constants;

/**
 * Get the revert reason from just a transaction hash
 * @param {string} txHash - Hash of an Ethereum transaction
 * @param {object} tx - Ethereum transaction object
 * @param {string} network - Ethereum network name
 * @param {number || string} blockNumber - A block number or 'latest' to make the call from
 * @param {*} customProvider - Custom provider (Only ethers and web3 providers are supported at thsitime)
 */
export async function getRevertReason(
  txHash: string | null,
  _tx: any, // custom addition
  network = 'mainnet',
  blockNumber: number | undefined | string = undefined,
  customProvider: any = undefined
): Promise<any> {
  // Normalize the input params
  network = network.toLowerCase();
  blockNumber = blockNumber || 'latest';

  // Perform validation before defining a provider
  if (txHash) await validateInputPreProvider(txHash, network);

  // If a web3 provider is passed in, wrap it in an ethers provider
  // A standard web3 provider will have `.version`, while an ethers will not
  if (customProvider && customProvider.version) {
    customProvider = new providers.Web3Provider(customProvider.currentProvider);
  }
  const provider = customProvider || getDefaultProvider(network);

  // Perform validation after defining a provider
  await validateInputPostProvider(txHash, network, blockNumber, provider);

  try {
    const tx = _tx || (await provider.getTransaction(txHash));
    const code = await getCode(tx, network, blockNumber, provider);
    return decodeMessage(code, network);
  } catch (err) {
    throw new Error('Unable to decode revert reason');
  }
}

async function validateInputPreProvider(txHash, network) {
  // Only accept a valid txHash
  if (
    !/^0x([A-Fa-f0-9]{64})$/.test(txHash) ||
    txHash.substring(0, 2) !== '0x'
  ) {
    throw new Error('Invalid transaction hash');
  }

  // Only accept valid networks
  const networks = ['mainnet', 'kovan', 'goerli', 'ropsten', 'rinkeby'];
  if (!networks.includes(network)) {
    throw new Error('Not a valid network');
  }
}

async function validateInputPostProvider(
  txHash,
  network,
  blockNumber,
  provider
) {
  // NOTE: Unless the node exposes the Parity `trace` endpoints, it is not possible to get the revert
  // reason of a transaction on kovan. Because of this, the call will end up here and we will return a custom message.
  if (network === 'kovan') {
    try {
      // Mimic the call to validate if the provider exposes Parity `trace` methods
      const tx = await provider.getTransaction(txHash);
      getCode(tx, network, blockNumber, provider);
    } catch (err) {
      throw new Error(
        'Please use a provider that exposes the Parity trace methods to decode the revert reason'
      );
    }
  }

  // Validate the block number
  if (blockNumber !== 'latest') {
    const currentBlockNumber = await provider.getBlockNumber();
    blockNumber = Number(blockNumber);

    // The block cannot be in the future
    if (blockNumber >= currentBlockNumber) {
      throw new Error('You cannot use a blocknumber that has not yet happened');
    }

    // A block older than 128 blocks needs access to an archive node
    if (blockNumber < currentBlockNumber - 128) {
      try {
        // Check to see if a provider has access to an archive node
        await provider.getBalance(AddressZero, blockNumber);
      } catch (err) {
        const errCode = JSON.parse(err.responseText).error.code;
        // NOTE: This error code is specific to Infura. Alchemy offers an Archive node by default, so an Alchemy node will never throw here.
        const infuraErrCode = -32002;
        if (errCode === infuraErrCode) {
          throw new Error(
            'You cannot use a blocknumber that is older than 128 blocks. Please use a provider that uses a full archival node.'
          );
        }
      }
    }
  }
}

function decodeMessage(code, network) {
  // NOTE: `code` may end with 0's which will return a text string with empty whitespace characters
  // This will truncate all 0s and set up the hex string as expected
  // NOTE: Parity (Kovan) returns in a different format than other clients
  let codeString;
  const fnSelectorByteLength = 4;
  const dataOffsetByteLength = 32;
  const strLengthByteLength = 32;
  const strLengthStartPos =
    2 + (fnSelectorByteLength + dataOffsetByteLength) * 2;
  const strDataStartPos =
    2 + (fnSelectorByteLength + dataOffsetByteLength + strLengthByteLength) * 2;

  if (network === 'kovan') {
    const strLengthHex = code
      .slice(strLengthStartPos)
      .slice(0, strLengthByteLength * 2);
    const strLengthInt = parseInt(`0x${strLengthHex}`, 16);
    const strDataEndPos = strDataStartPos + strLengthInt * 2;
    if (codeString === '0x') return '';
    codeString = `0x${code.slice(strDataStartPos, strDataEndPos)}`;
  } else {
    codeString = `0x${code.substr(138)}`.replace(/0+$/, '');
  }

  // If the codeString is an odd number of characters, add a trailing 0
  if (codeString.length % 2 === 1) {
    codeString += '0';
  }

  return toUtf8String(codeString);
}

async function getCode(tx, network, blockNumber, provider) {
  console.log('network', network);
  // Ganache network - our addition
  if (network === 'unknown' || network === 'local') {
    try {
      // NOTE: The await is intentional in order for the catch to work
      return await provider.call(tx, blockNumber);
    } catch (err) {
      const data = err.data[Object.keys(err.data)[0]];
      return data.return;
    }
  }
  if (network === 'kovan') {
    try {
      // NOTE: The await is intentional in order for the catch to work
      return await provider.call(tx, blockNumber);
    } catch (err) {
      return JSON.parse(err.responseText).error.data.substr(9);
    }
  }
  if (network === 'polygon') {
    try {
      // NOTE: The await is intentional in order for the catch to work
      return await provider.call(tx, blockNumber);
    } catch (err) {
      // console.log('code err', err.error.message);
      console.log('err', err.message);
      return err.error
        ? err.error.message.replace('code err execution reverted: ', '')
        : err.message.replace('code err execution reverted: ', '');
    }
  } else {
    return provider.call(tx, blockNumber);
  }
}
