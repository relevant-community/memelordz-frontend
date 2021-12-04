import { store } from '../store';

import ProxyFactory from './contracts/ProxyFactory.json';
import BondingCurveContract from './contracts/BondingCurveContract.json';

export { ProxyFactory, BondingCurveContract };

export const networkId = 9000;

// export const PROXY_FACTORY = '0x14bbea4b804cabe1742056915829eba8f13a4fd9';
export const PROXY_FACTORY = ProxyFactory.networks[networkId].address;
export const PROXY_FACTORY_ABI = ProxyFactory.abi;
// ganache
// export const BONDING_CURVE_CONTRACT = '0xffd755447c9a9df8e1785aa52a226d299e09113f';

// kovan
// export const BONDING_CURVE_CONTRACT = '0x378ff88de73d674012bea882f6864fedd787110d';

// rinkeyby
export const BONDING_CURVE_CONTRACT =
  BondingCurveContract.networks[networkId].address;
export const BONDING_CURVE_ABI = BondingCurveContract.abi;

export const PRC = 'https://ethereum.rpc.evmos.dev';
// event: ProxyDeployed
