import { Drizzle, generateStore } from 'drizzle';

import { store } from '../store';

import ProxyFactory from './contracts/ProxyFactory.json';
import BondingCurveContract from './contracts/BondingCurveContract.json';

export const PROXY_FACTORY = '0xf25186b5081ff5ce73482ad761db0eb0d25abfbf';

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
  web3: {
    ignoreMetamask: true,
    useMetamask: true,
    fallback: {
      type: 'ws',
      url: 'wss://rinkeby.infura.io/_ws',
      networkId: 4,
    }
  }
};

export const drizzle = new Drizzle(options, store);
