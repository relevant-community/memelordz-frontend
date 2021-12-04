import { useState, useEffect } from 'react';
import reactHotToast from 'react-hot-toast';
import { IToastStatus } from '../utils';

const { LOADING, SUCCESS, ERROR } = IToastStatus;

const settings: Record<string, any> = {
  position: 'top-right',
  style: {
    borderRadius: 0
  }
};

export const useToast = (
  status: IToastStatus | undefined,
  message: string | JSX.Element
): any => {
  const [id, setId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (status === LOADING) {
      const toastId = reactHotToast.loading(message, settings);
      setId(toastId);
    }
  }, [status]);

  useEffect(() => {
    if (status === SUCCESS) {
      reactHotToast.success(message, { ...settings, id });
    }
    if (status === ERROR && message) {
      reactHotToast.error(message, {
        ...settings,
        duration: 7000,
        id
      });
    }
  }, [status, message]);
};
