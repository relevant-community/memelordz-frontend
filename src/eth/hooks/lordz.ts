import { useCallback } from 'react';
import { useAsync, AsyncRes } from './async';
import { PROXY_FACTORY, PROXY_FACTORY_ABI } from '../config';
import { useContract } from './common';
import { useWeb3React } from './web3';

export const useProxy = () => useContract(PROXY_FACTORY_ABI, PROXY_FACTORY);

export const useProxyEvent = (): AsyncRes => {
  const { library } = useWeb3React();
  const proxy = useProxy();
  const fn = useCallback(async () => {
    if (!proxy || !library) return;
    const block = await library?.getBlockNumber();
    const filter = await proxy.filters.ProxyDeployed();
    const events = await proxy.queryFilter(filter, block - 10000, block);
    return events;
  }, [proxy]);
  const res = useAsync(fn, [proxy]);
  console.log(res);
  return res;
};
