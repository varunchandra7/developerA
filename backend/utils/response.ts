interface ApiResponse {
  success: boolean;
  timestamp: string;
  requestId?: string;
  data?: any;
  error?: string;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function buildApiResponse(
  options: {
    data?: any;
    error?: string;
    message?: string;
    pagination?: any;
  },
  requestId?: string
): ApiResponse {
  return {
    success: !options.error,
    timestamp: new Date().toISOString(),
    requestId,
    ...options
  };
}