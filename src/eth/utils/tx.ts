import { getRevertReason } from './eth-revert-reason';
import {
  GAS_MARGIN,
  PERCENT,
  NODE_ENV,
  REACT_APP_GAS_STATION_KEY,
  chainIdToNetwork,
} from './constants';
import { toBN, BigNumber } from './bn';
import { IToastStatus, IToastStatusObject } from './types';

export const TX_TYPE = {
  // This means we are in the process of approving a token
  APPROVE_TOKEN: 'APPROVE_TOKEN',
  DEFAULT: 'DEFAULT',
};

export enum ITxStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export function txToToast(
  key?: ITxStatus,
  message?: string
): IToastStatusObject | Record<any, any> {
  switch (key) {
    case ITxStatus.PENDING:
      return {
        status: IToastStatus.LOADING,
        message: message || 'Transaction Pending...',
      };
    case ITxStatus.SUCCESS:
      return {
        status: IToastStatus.SUCCESS,
        message: message || 'Transaction Success',
      };
    case ITxStatus.FAILED:
      return {
        status: IToastStatus.ERROR,
        message: message || 'Transaction Error',
      };
    default:
      return {};
  }
}

export const ERROR_STATES = {
  CONFIRM_REJECTED: 'MetaMask Tx Signature: User denied transaction signature.',
  GAS_EXCEEDED:
    'gas required exceeds allowance (8000029) or always failing transaction',
};

export async function logRevert({
  contract,
  action,
  args,
  library,
  account,
}): Promise<string | null> {
  try {
    if (!contract || !contract.interface) return null;
    const data = contract?.interface.encodeFunctionData(action, args);

    const tx = {
      to: contract.address,
      data: data,
      from: account,
    };
    const { chainId } = library;
    const currentChain = chainId && chainIdToNetwork[chainId];
    return await getRevertReason(null, tx, currentChain, 'latest', library);
  } catch (err) {
    console.error('revert error', err);
    return null;
  }
}

export function calculateGasMargin(value): any {
  const offset = value.mul(GAS_MARGIN).div(PERCENT);
  return value.add(offset);
}

// Note this is only for ethereum and we probably don't need this at all anymore
export const getGasPrice = async (speed?: string) => {
  try {
    if (NODE_ENV === 'test') return null;
    if (!REACT_APP_GAS_STATION_KEY)
      console.warn(
        'REACT_APP_GAS_STATION_KEY is not set, not using api-key to fetch gas prices. This may be rate-limited.'
      );
    const res = await fetch(
      `https://ethgasstation.info/json/ethgasAPI.json?api-key=${REACT_APP_GAS_STATION_KEY}`
    );
    const data = await res.json();
    // data is 10 * GWEI
    const gasPrice: BigNumber = toBN(data[speed || 'fast'] * 1e8);
    return gasPrice;
  } catch (err) {
    console.error(err);
    return null;
  }
};
