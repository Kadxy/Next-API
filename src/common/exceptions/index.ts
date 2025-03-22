export * from './business.exception';
export * from './all-exceptions.filter';

export type GlobalResponse<T> = GlobalSuccessResponse<T> | GlobalErrorResponse;

export interface GlobalSuccessResponse<T> {
  success: true;
  data: T;
}

export interface GlobalErrorResponse {
  success: false;
  msg: string;
}

export const DEFAULT_ERROR_MSG = 'Internal server error';
