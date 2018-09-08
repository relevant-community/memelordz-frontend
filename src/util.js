import Web3 from 'web3';

const { BN } = Web3.utils;
// const web3 = new Web3();

export function toNumber(num, dec) {
  if (num === undefined || dec === undefined) return null;
  let n = new BN(num);
  dec = (10 ** dec).toString();
  let d = new BN(dec);
  return Number(n.div(d));
}

export function toFixed(num, dec) {
  if (!num) return 0;
  return num.toFixed(dec);
}

export const weekdays = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ');
export const pad = (n) => n < 10 ? '0' + n : n;

export function ChanDate(d = Date.now()) {
  // 09/08/18(Sat)12:06:03
  const date = new Date(d);
  return (
    pad(date.getDate()) + '/'
  + pad(date.getMonth()) + '/'
  + (date.getYear() - 100) + '('
  + weekdays[date.getDay()] + ')'
  + pad(date.getHours()) + ':'
  + pad(date.getMinutes()) + ':'
  + pad(date.getSeconds())
  );
}
