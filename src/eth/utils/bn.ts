import { BigNumber, utils } from 'ethers';
export { BigNumber } from 'ethers';

export const { formatUnits, parseUnits } = utils;

export const fromBN = (n: BigNumber): number => n.toNumber();
export const fromBNDec = (n: BigNumber, d?: number): number =>
  Number(formatUnits(n, d));
export const toBNDec = (n: number | string, d?: number): BigNumber =>
  parseUnits(n.toString(), d);
export const toBN = BigNumber.from;
