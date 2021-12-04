import { useEffect } from 'react';
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import { injected } from '../utils/connectors';

import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { providers } from 'ethers';

export function useWeb3React(): Web3ReactContextInterface<
  providers.Web3Provider
> {
  return useWeb3ReactCore();
}

export function useWeb3(): void {
  const { activate } = useWeb3ReactCore();

  window.ethereum.autoRefreshOnNetworkChange = false;
  const haveMM = !!window.ethereum;

  useEffect(() => {
    haveMM && activate(injected);
  }, [haveMM, activate]);

  useInactiveListener();
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network they're on
 */
export function useInactiveListener(suppress = false): void {
  const { active, error, activate } = useWeb3ReactCore(); // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after chain changed', error);
        });
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0)
          activate(injected, undefined, true).catch((error) => {
            console.error('Failed to activate after accounts changed', error);
          });
      };

      const handleNetworkChanged = () => {
        activate(injected, undefined, true).catch((error) => {
          console.error('Failed to activate after networks changed', error);
        });
      };

      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('networkChanged', handleNetworkChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (ethereum && ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [active, error, suppress, activate]);
}
