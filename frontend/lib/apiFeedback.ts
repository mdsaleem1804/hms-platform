import axios, { AxiosResponse } from 'axios';
import { notify } from '@/lib/toast';

type AnyRecord = Record<string, unknown>;

interface ApiEnvelope<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
}

interface HandleApiResponseOptions {
  successMessage?: string;
  errorMessage?: string;
  successToastId?: string;
  errorToastId?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  includeUhidOnSuccess?: boolean;
}

const asRecord = (value: unknown): AnyRecord => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as AnyRecord;
  }
  return {};
};

const readMessage = (value: unknown): string => {
  const obj = asRecord(value);
  const candidate = obj.message ?? obj.Message ?? obj.error ?? obj.Error;
  return typeof candidate === 'string' ? candidate.trim() : '';
};

const readUhid = (value: unknown): string => {
  const obj = asRecord(value);
  const candidate = obj.uhid ?? obj.UHID ?? obj.Uhid;
  return typeof candidate === 'string' ? candidate.trim() : '';
};

const withUhid = (message: string, uhid: string): string => {
  if (!uhid) return message;
  const containsUhid = /uhid/i.test(message);
  return containsUhid ? message : `${message} (UHID: ${uhid})`;
};

const getErrorFromAxios = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return error instanceof Error ? error.message : '';
  }

  const responseData = error.response?.data;
  const responseMessage = readMessage(responseData);
  return responseMessage || error.message;
};

export const handleApiResponse = <T = unknown>(
  response: AxiosResponse<ApiEnvelope<T>>,
  options: HandleApiResponseOptions = {}
) => {
  const envelope = response?.data ?? {};
  const isSuccess = envelope.success !== false;
  const backendMessage = readMessage(envelope);
  const payload = envelope.data;

  if (isSuccess) {
    const baseSuccess = options.successMessage || backendMessage || 'Operation completed successfully';
    const successMessage = options.includeUhidOnSuccess
      ? withUhid(baseSuccess, readUhid(payload))
      : baseSuccess;

    if (options.showSuccessToast !== false) {
      notify.success(successMessage, { id: options.successToastId });
    }

    return {
      ok: true as const,
      message: successMessage,
      data: payload,
    };
  }

  const failureMessage = options.errorMessage || backendMessage || 'Request failed';
  if (options.showErrorToast !== false) {
    notify.error(failureMessage, { id: options.errorToastId });
  }

  return {
    ok: false as const,
    message: failureMessage,
    data: payload,
  };
};

export const handleApiError = (
  error: unknown,
  options: {
    fallbackMessage?: string;
    toastId?: string;
    showToast?: boolean;
  } = {}
) => {
  const message = getErrorFromAxios(error) || options.fallbackMessage || 'Request failed';

  if (options.showToast !== false) {
    notify.error(message, { id: options.toastId });
  }

  return message;
};
