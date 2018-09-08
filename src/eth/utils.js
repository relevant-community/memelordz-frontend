import Web3 from 'web3';

const { BN } = Web3.utils;
// const web3 = new Web3();

export function toNumber(num, dec) {
  if (num === undefined || dec === undefined) return null;
  let n = new BN(num);
  let d = new BN(dec);
  return Number(n.div(d));
}

export function toFixed(num, dec) {
  if (!num) return 0;
  return num.toFixed(dec);
}
