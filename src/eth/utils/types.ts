export enum IToastStatus {
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'FAILED',
}

export interface IToastStatusObject {
  status: IToastStatus;
  message: string;
}
