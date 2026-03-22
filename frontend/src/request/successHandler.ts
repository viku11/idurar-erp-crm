import { notification } from 'antd';

import codeMessage from './codeMessage';

interface SuccessHandlerResponse {
  status: number;
  data: {
    success: boolean;
    message?: string;
  };
}

interface SuccessHandlerOptions {
  notifyOnSuccess: boolean;
  notifyOnFailed: boolean;
}

const successHandler = (
  response: SuccessHandlerResponse,
  options: SuccessHandlerOptions = { notifyOnSuccess: false, notifyOnFailed: true }
): void => {
  const { data } = response;
  if (data && data.success === true) {
    const message: string | undefined = response.data && data.message;
    const successText: string = message || codeMessage[response.status];

    if (options.notifyOnSuccess) {
      notification.config({
        duration: 2,
        maxCount: 2,
      });
      notification.success({
        message: `Request success`,
        description: successText,
      });
    }
  } else {
    const message: string | undefined = response.data && data.message;
    const errorText: string = message || codeMessage[response.status];
    const { status } = response;
    if (options.notifyOnFailed) {
      notification.config({
        duration: 4,
        maxCount: 2,
      });
      notification.error({
        message: `Request error ${status}`,
        description: errorText,
      });
    }
  }
};

export default successHandler;
