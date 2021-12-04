import { CHAIN_IDS, IChain, chainIdToNetwork } from '../utils/constants';
const NETWORK_SETTINGS = {
  1337: {
    chainId: `0x${parseInt('1337', 10).toString(16)}`,
    chainName: 'Localhost 8545',
    rpcUrls: ['https://127.0.0.1:8545'], // doesn't get used because user will already have localhost in metamask by default, just needs to be valid https
  },
  56: {
    chainId: `0x${parseInt('56', 10).toString(16)}`,
    chainName: 'BSC Mainnet',
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
  128: {
    chainId: `0x${parseInt('128', 10).toString(16)}`,
    chainName: 'HECO Mainnet',
    nativeCurrency: {
      name: 'Huobi Token',
      symbol: 'HT',
      decimals: 18,
    },
    rpcUrls: ['https://http-mainnet.hecochain.com'],
    blockExplorerUrls: ['https://hecoinfo.com/'],
  },
  43114: {
    chainId: `0x${parseInt('43114', 10).toString(16)}`,
    chainName: 'Avalanche C-Chain',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/'],
  },
  137: {
    chainId: `0x${parseInt('137', 10).toString(16)}`,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: ['https://polygon-rpc.com'],
    blockExplorerUrls: ['https://polygonscan.com/'],
  },
  250: {
    chainId: `0x${parseInt('250', 10).toString(16)}`,
    chainName: 'Fantom Opera',
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.ftm.tools'],
    blockExplorerUrls: ['https://ftmscan.com/'],
  },
  1666600000: {
    chainId: `0x${parseInt('1666600000', 10).toString(16)}`,
    chainName: 'Harmony One',
    nativeCurrency: {
      name: 'ONE',
      symbol: 'ONE',
      decimals: 18,
    },
    rpcUrls: ['https://api.s0.t.hmny.io/'],
    blockExplorerUrls: ['https://explorer.harmony.one/'],
  },
  42161: {
    chainId: `0x${parseInt('42161', 10).toString(16)}`,
    chainName: 'Arbitrum One',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io/'],
  },
  42220: {
    chainId: `0x${parseInt('42220', 10).toString(16)}`,
    chainName: 'Celo',
    nativeCurrency: {
      name: 'CELO',
      symbol: 'CELO',
      decimals: 18,
    },
    rpcUrls: ['https://forno.celo.org'],
    blockExplorerUrls: ['https://explorer.celo.org/'],
  },
  1285: {
    chainId: `0x${parseInt('1285', 10).toString(16)}`,
    chainName: 'Moonriver',
    nativeCurrency: {
      name: 'Moonriver',
      symbol: 'MOVR',
      decimals: 18,
    },
    rpcUrls: ['https://rpc.moonriver.moonbeam.network'],
    blockExplorerUrls: ['https://moonriver.moonscan.io/'],
  },
  25: {
    chainId: `0x${parseInt('25', 10).toString(16)}`,
    chainName: 'Cronos',
    nativeCurrency: {
      name: 'CRO',
      symbol: 'CRO',
      decimals: 18,
    },
    rpcUrls: ['https://evm-cronos.crypto.org'],
    blockExplorerUrls: ['https://cronos.crypto.org/explorer/'],
  },
};

export const networkSetup = async (
  chainName: IChain,
  library: any
): Promise<any> => {
  const chainId = CHAIN_IDS[chainName];
  const settings =
    chainId && NETWORK_SETTINGS?.[chainId] && NETWORK_SETTINGS[chainId];
  if (!settings)
    return `No network settings configured for chainId: '${chainName}'`;
  try {
    await library?.provider?.request({
      method: 'wallet_addEthereumChain',
      params: [NETWORK_SETTINGS[chainId]],
    });
    return {};
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    } else {
      return { error: 'An unknown error has occurred.' };
    }
  }
};

export const checkCorrectNetwork = (
  chain: IChain,
  chainId: number | undefined
): boolean => {
  if (!chainId || !chain) return false;
  const actualNetwork = chainIdToNetwork[chainId];
  return chain === 'all chains' || actualNetwork === chain;
};
