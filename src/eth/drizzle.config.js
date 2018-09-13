import { Drizzle, generateStore } from 'drizzle';

import { store } from '../store';

import ProxyFactory from './contracts/ProxyFactory.json';
import BondingCurveContract from './contracts/BondingCurveContract.json';

export {
  ProxyFactory,
  BondingCurveContract,
};

const networkId = 4;

export const PROXY_FACTORY = '0x14bbea4b804cabe1742056915829eba8f13a4fd9';

// ganache
// export const BONDING_CURVE_CONTRACT = '0xffd755447c9a9df8e1785aa52a226d299e09113f';

// kovan
// export const BONDING_CURVE_CONTRACT = '0x378ff88de73d674012bea882f6864fedd787110d';

// rinkeyby
export const BONDING_CURVE_CONTRACT = BondingCurveContract.networks[networkId].address;

export const options = {
  contracts: [
    ProxyFactory
  ],
  syncAlways: false,
  events: {
    ProxyFactory: [{
      eventName: 'ProxyDeployed',
      eventOptions: {
        fromBlock: 0
      }
    }]
  },
  polls: {
    blocks: 300,
    accounts: 300,
  },
  // networkId: 42,
  // networkId: 5777,
  networkId,
  web3: {
    ignoreMetamask: true,
    useMetamask: true,
    fallback: window.web3 ? null : {
      // type: 'http',
      // url: 'http://rinkeby.infura.io/' + 'eAeL7I8caPNjDe66XRTq',
      // type: 'ws',
      // url: 'ws://rinkeby.infura.io/_ws',
      type: 'ws',
      url: 'wss://rinkeby.infura.io/ws',
      networkId: 4,
    }
  }
};

export const drizzle = new Drizzle(options, store);
