import { providers, Signer, Contract } from 'ethers';

import erc20Abi from '../abis/erc20.json';

export const getContract = (
  address: string,
  abi: any,
  signerOrProvider: providers.Provider | Signer
): Contract => {
  return new Contract(address, abi, signerOrProvider);
};

export const getErc20 = (
  address: string,
  signerOrProvider: providers.Provider | Signer
): Contract => getContract(address, erc20Abi, signerOrProvider);
