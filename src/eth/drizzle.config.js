import { Drizzle, generateStore } from 'drizzle';

import { store } from '../store';

import ProxyFactory from './contracts/ProxyFactory.json';
import BondingCurveContract from './contracts/BondingCurveContract.json';

export {
  ProxyFactory,
  BondingCurveContract,
};

export const PROXY_FACTORY = '0xf25186b5081ff5ce73482ad761db0eb0d25abfbf';
// export const BONDING_CURVE_CONTRACT = '0xe0a84ec927f7b10601c3cd7f32ff3648f0439512';

export const BONDING_CURVE_CONTRACT = '0x21da89748331866f985312b5da98359cc91a8df7';

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
  networkId: 4,
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
