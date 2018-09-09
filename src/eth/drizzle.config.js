import { Drizzle, generateStore } from 'drizzle';

import { store } from '../store';

import ProxyFactory from './contracts/ProxyFactory.json';
import BondingCurveContract from './contracts/BondingCurveContract.json';

export {
  ProxyFactory,
  BondingCurveContract,
};

export const PROXY_FACTORY = '0xa9c0e6f7e05da0fba6f65892fd08f8b1cc8c71bb';

// ganache
// export const BONDING_CURVE_CONTRACT = '0xffd755447c9a9df8e1785aa52a226d299e09113f';

// kovan
export const BONDING_CURVE_CONTRACT = '0x378ff88de73d674012bea882f6864fedd787110d';

// rinkeyby
// export const BONDING_CURVE_CONTRACT = '0x21da89748331866f985312b5da98359cc91a8df7';


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
  networkId: 42,
  // networkId: 5777,
  // networkId: 4,
  web3: {
    ignoreMetamask: true,
    useMetamask: true,
    // fallback: {
    //   // type: 'https',
    //   // url: 'https://rinkeby.infura.io/' + 'eAeL7I8caPNjDe66XRTq',
    //   // type: 'ws',
    //   // url: 'wss://gethnode.com/ws',
    //   type: 'ws',
    //   url: 'wss://rinkeby.infura.io/ws',
    //   networkId: 4,
    // }
  }
};

export const drizzle = new Drizzle(options, store);
