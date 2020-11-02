export declare const AUTH_SERVICE_ERR_UNKNOWN = "error.auth-service.unknown";
export declare const AUTH_SERVICE_ERR_OFFLINE = "error.auth-service.offline";
export interface AuthService {
  getValidAccessToken(): Promise<string>;
  getToken(): AuthToken;
}
export interface AuthToken {
  accessToken: string;
  expiryDate: Date;
  refreshToken: string;
  refreshExpiryDate: Date;
}
export declare class NoiAuthService implements AuthService {
  private token;
  constructor();
  private static encodeFormData;
  private static parseToken;
  getToken(): AuthToken;
  getValidAccessToken: () => Promise<string>;
  private static isAuthTokenExpired;
  private static isRefreshTokenExpired;
  static refresh(refreshToken: string): Promise<AuthToken>;
  static login(): Promise<AuthToken>;
}
export declare const NoiAuth: AuthService;
