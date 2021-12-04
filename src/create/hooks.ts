import { useState } from 'react';
import ipfsAPI from 'ipfs-api';
import dataUriToBuffer from 'data-uri-to-buffer';
import { useCallback } from 'react';
import {} from '../eth/utils';
import {
  getBytes32FromMultiash,
  useSend,
  useProxy,
  ITxStatus,
  BONDING_CURVE_CONTRACT
} from '../eth';

const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });
const { Buffer } = ipfs;

// this.setState({
//   modal: false,
//   processing: true,
//   createStatus: 'Starting upload to IPFS'
// });

export const useUpload = (
  txStatus: ITxStatus,
  account: string,
  preview: string
) => {
  const [uploadStatus, setUploadStatus] = useState<string | undefined>();
  const [hash, setHash] = useState();

  const upload = useCallback(async () => {
    try {
      if (txStatus === ITxStatus.PENDING) {
        return window.alert('still processing previous transaction');
      }

      if (!account)
        return window.alert('Missing account — please log into Metamask');

      const buff = dataUriToBuffer(preview);
      setUploadStatus('Starting upload to IPFS');

      const result = await ipfs.add(buff, {
        progress: (prog) => {
          setUploadStatus('Uploaded ' + prog + '% to IPFS');
        }
      });

      setHash(result[0].path);
      setUploadStatus(undefined);
    } catch (err) {
      console.log(err);
      setUploadStatus('Upload Error: ' + err.message);
    }
  }, [account, preview]);
  return { upload, hash, uploadStatus };
};

export const useCreate = (name: string, symbol: string) => {
  const { txStatus, sendTx, txMeta } = useSend();
  const proxy = useProxy();
  const create = useCallback(
    async (hash) => {
      try {
        if (!proxy) throw Error('Missing proxy contract');
        const data = encodeContractCall(hash, name, symbol);
        const res = await sendTx(proxy, 'createProxy', [
          BONDING_CURVE_CONTRACT,
          data
        ]);
        console.log(res);
        //   {
        //   from: '0x2116d9fb8f7F373df0190465559B9082FF4eAE73'
        // });
      } catch (err) {
        console.log(err);
      }
    },
    [name, symbol, proxy]
  );
  return { txStatus, txMeta };
};

export const encodeContractCall = (hash, name, symbol) => {
  const ipfsHash = getBytes32FromMultiash(hash);
  return web3.eth.abi.encodeFunctionCall(
    {
      name: 'initContract',
      type: 'function',
      inputs: [
        {
          type: 'string',
          name: '_name'
        },
        {
          type: 'uint8',
          name: '_decimals'
        },
        {
          type: 'string',
          name: '_symbol'
        },
        {
          type: 'uint8',
          name: '_exponent'
        },
        {
          type: 'uint32',
          name: '_slope'
        },
        {
          type: 'bytes32',
          name: '_hash'
        },
        {
          type: 'uint8',
          name: '_hashFunction'
        },
        {
          type: 'uint8',
          name: '_size'
        }
      ]
    },
    [
      name,
      '18',
      symbol,
      '2',
      '1000',
      ipfsHash.digest,
      ipfsHash.hashFunction,
      ipfsHash.size
    ]
  );
};

// TODO: execute initial trade when creating the contract
// this was copied from the trade component:
/*
      if (!!amount && amount > 0) {
        let numOfTokens = calculatePurchaseReturn(this.state);
        numOfTokens = Web3.utils.toWei(amount.toString());
        // numOfTokens = new BN(numOfTokens.toString());
        // amount += .1;
        amount = Web3.utils.toWei(amount.toString());
        amount = new BN(amount.toString());

        // let priceToMint = await this.props.contract.methods.priceToMint.call(amount);
        // console.log('price to mint ', priceToMint);
        // console.log('our price     ', amount);

        contract.methods.mint.cacheSend(numOfTokens, {
          value: amount, from: account
        });
      }
      */
