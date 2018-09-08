import { Drizzle, generateStore } from 'drizzle';

import { store } from '../store';

import ProxyFactory from './contracts/ProxyFactory.json';
import BondingCurveContract from './contracts/ERC20Main.json';
import Controller from './contracts/Controller.json';

export {
  ProxyFactory,
  BondingCurveContract,
  Controller,
};

export const PROXY_FACTORY = '0x98b35d85d5bc3687a5fe12381978539d44b2f228';
export const BONDING_CURVE_CONTRACT = '0xf57016a7d2def52576a19d5e888588aa31d54c39';

export const options = {
  contracts: [
    ProxyFactory,
    Controller
  ],
  syncAlways: false,
  events: {
    Controller: [{
      // eventName: 'ProxyDeployed',
      // eventOptions: {
      //   fromBlock: 0
      // }
    }],
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
