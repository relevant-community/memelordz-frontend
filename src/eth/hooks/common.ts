import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWeb3React } from './web3';
import { getContract } from '../utils';
import { contracts } from '../abis';
import { providers, Signer, Contract } from 'ethers';
import { useAsync } from './async';
import erc20Abi from '../abis/erc20.json';

export function useBlockNumber(): number | undefined {
  const { chainId, library, active } = useWeb3React();
  const [blockNumber, setBlockNumber] = useState<number | undefined>();
  useEffect(() => {
    let stale = false;
    if (!library) return;
    const watchNumber = async () => {
      try {
        library.on('block', updateBlockNumber);
        const blockNumber = await library.getBlockNumber();

        setBlockNumber(blockNumber);
      } catch (err) {
        setBlockNumber(undefined);
      }
    };

    const updateBlockNumber = (blockNumber: number) => {
      setBlockNumber(blockNumber);
    };

    if (active && library && !stale) watchNumber();

    return () => {
      stale = true;
      library && library.removeListener('block', updateBlockNumber);
      setBlockNumber(undefined);
    };
  }, [chainId, active]);
  return useMemo(() => blockNumber, [blockNumber]);
}

export function useContract(
  nameOrAbi: any | undefined,
  address: string | undefined,
  provider?: providers.Provider
): Contract | undefined {
  const signer = useSigner();
  const providerOrSigner = provider || signer;
  const abi = (nameOrAbi && contracts[nameOrAbi]) || nameOrAbi;
  const contract = useMemo(() => {
    if (!providerOrSigner || !address || !nameOrAbi) return;
    return getContract(address, abi, providerOrSigner);
  }, [address, abi, providerOrSigner]);
  return contract;
}

export const useERC20 = (
  address: string,
  provider?: providers.Provider
): Contract | undefined => useContract(erc20Abi, address, provider);

export function useCall(
  contract: Contract | undefined,
  method: string,
  args: any[] = []
): any {
  const block = useBlockNumber();
  const fn = useCallback(contract?.[method], [contract, method]);
  return useAsync(fn, args, { condition: !!contract, deps: [block] });
}

export const useSigner = (): Signer | undefined => {
  const { library } = useWeb3React();
  return useMemo(() => library?.getSigner(), [library]);
};
