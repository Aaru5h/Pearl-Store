// API Response envelope matching backend ApiResponse class
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}
