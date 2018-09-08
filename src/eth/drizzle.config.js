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

export const PROXY_FACTORY = '0x28dfd076da75f43fdcb26c8ac7275d2e263bd366';
export const BONDING_CURVE_CONTRACT = '0xbc31117c5f727c20f935096047cb035e00695566';

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
