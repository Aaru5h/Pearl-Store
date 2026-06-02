export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data?: T;
  public readonly timestamp: string;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  public static success<T>(data?: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  public static error<T>(message: string, data?: T): ApiResponse<T> {
    return new ApiResponse<T>(false, message, data);
  }
}
