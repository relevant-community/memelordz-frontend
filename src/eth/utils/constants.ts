export { BigNumber } from 'ethers';
import { toBN } from './bn';

export const { NODE_ENV, REACT_APP_GAS_STATION_KEY } = process.env;

const { INFURA_API_KEY } = process.env;

export const chainIdToNetwork = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan',
  56: 'bsc',
  137: 'polygon',
  1337: 'localhost',
  43114: 'avalanche',
  9000: 'evmos'
};

export const CHAIN_IDS = {
  mainnet: 1,
  localhost: 1337,
  hardhat: 1337,
  rinkeby: 4,
  ropsten: 3,
  bsc: 56,
  polygon: 137,
  avalanche: 43114,
  evmos: 9000
};

export const GAS_MARGIN = toBN(1000); // 10% in basis
export const PERCENT = toBN(10000); // 100% in basis

export type ISwap = 'pangolin' | 'spirit' | 'quickswap' | 'pancake' | 'uniswap';

export function getRelevantChains(): IChain[] {
  if (NODE_ENV === 'development')
    return ['all chains', 'localhost', 'avalanche'];
  return ['all chains', 'avalanche'];
}

export type IChain =
  | 'all chains'
  | 'localhost'
  | 'mainnet'
  | 'avalanche'
  | 'fantom'
  | 'polygon'
  | 'bsc'
  | 'rinkeby'
  | 'ropsten';

export const UniContracts = ['UNISWAP_FACTORY', 'UNISWAP_ROUTER'] as const;
export type IUniContract = typeof UniContracts[number];

export const RPC_URLS = {
  mainnet: 'https://mainnet.infura.io/v3/' + INFURA_API_KEY,
  avalanche: 'https://api.avax.network/ext/bc/C/rpc',
  fantom: 'https://rpc.ftm.tools/',
  hardhat: 'http://localhost:8545',
  localhost: 'http://localhost:8545/'
};

export type DesiredNetwork = string;
