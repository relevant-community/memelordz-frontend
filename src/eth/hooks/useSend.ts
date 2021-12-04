import { useState, useEffect, useCallback } from 'react';
import { Contract } from 'ethers';
import { useWeb3React } from './web3';
import { calculateGasMargin, ITxStatus, logRevert, txToToast } from '../utils';
import { useToast } from './useToast';

const { PENDING, SUCCESS, FAILED } = ITxStatus;

export interface SendTX {
  (
    contract: Contract,
    action: string,
    args?: Array<any>,
    options?: any,
    successMessage?: string,
    dryRun?: boolean
  ): Promise<void>;
}
interface UseTXReturn {
  sendTx: SendTX;
  txStatus?: ITxStatus;
  txMeta: any;
  error?: string;
}

export function useSend(): UseTXReturn {
  const [error, setError] = useState(undefined);
  const [txStatus, setTxStatus] = useState<ITxStatus | undefined>(undefined);
  const [txMeta, setTxMeta] = useState({});
  const { active, account, library } = useWeb3React();

  const { status, message } = txToToast(txStatus, error);
  useToast(status, message);

  const _sendTx = async (
    contract: Contract,
    action: string,
    args: Array<any> = [],
    options: any = {},
    successMessage?: string,
    dryRun?: boolean
  ) => {
    try {
      if (!active) throw new Error('Web3 wallet is not connected');
      if (!account) throw new Error('Missing web3 account');

      // depending on povider type - we may have start with AWAITING_USER_ACTION
      // or go straight to PENDING
      setTxStatus(PENDING);
      setTxMeta({});
      setError(undefined);

      // NOTE this will fail if the call fails
      const gasLimit = options.gasLimit
        ? options.gasLimit
        : calculateGasMargin(await contract.estimateGas[action](...args));
      const gasPrice = options.gasPrice || undefined; //(await getGasPrice());

      if (dryRun) {
        setError(undefined);
        return setTxStatus(SUCCESS);
      }

      const tx = await contract[action](...args, {
        ...options,
        gasLimit,
        gasPrice,
      });

      setTxStatus(PENDING);
      setTxMeta({ transactionHash: tx.hash });

      const result = await tx.wait();

      // This tx failed while being mined
      if (result.status === 0) throw new Error('Transaction Failed');

      setTxMeta(result);
      setError(undefined);
      setTxStatus(result.status === 1 ? SUCCESS : FAILED);
    } catch (err) {
      console.error(err);

      // check if we can get a revert msg for a failing tx
      const revertMsg = await logRevert({
        contract,
        action,
        args,
        library,
        account,
      });

      setTxMeta({});
      const errorMsg =
        revertMsg || (err.data && err.data.message) || err.message;

      console.error(errorMsg);

      // Important to set error first before FAILED because we might
      // navigate away from the error/status listener before the error is set
      setError(errorMsg);
      setTxStatus(FAILED);
    }
  };

  const sendTx = useCallback(_sendTx, [active, account, setError]);
  return { sendTx, error, txStatus, txMeta };
}
