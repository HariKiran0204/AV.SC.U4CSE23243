export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  requestId?: string;
}

export const ok = <T>(message: string, data: T, requestId?: string): ApiResponse<T> => ({
  success: true,
  message,
  data,
  requestId
});

export const fail = (message: string, requestId?: string): ApiResponse<null> => ({
  success: false,
  message,
  data: null,
  requestId
});
