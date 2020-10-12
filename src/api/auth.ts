import { NoiError } from "./error";

export const AUTH_SERVICE_ERR_UNKNOWN = 'error.auth-service.unknown';
export const AUTH_SERVICE_ERR_OFFLINE = 'error.auth-service.offline';

export interface AuthService {
  getValidAccessToken(): Promise<string>;
  getToken(): AuthToken;
}

export interface AuthToken {
  accessToken: string,
  expiryDate: Date,
  refreshToken: string,
  refreshExpiryDate: Date
}

export class NoiAuthService implements AuthService {
  private token: AuthToken = null;

  constructor() {
  }

  private static encodeFormData(data) {
    return Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
  }

  private static parseToken(json): AuthToken {
    const now = new Date();
    const expiryDate = new Date(now.getTime() + json.expires_in * 1000);
    const refreshExpiryDate = new Date(now.getTime() + json.refresh_expires_in * 1000);
    return {
      accessToken: json.access_token,
      expiryDate,
      refreshToken: json.refresh_token,
      refreshExpiryDate
    }
  }

  public getToken(): AuthToken {
    return this.token;
  }

  public async getValidAccessToken(): Promise<string> {
    if (!NoiAuthService.isAuthTokenExpired(this.token)) {
      return this.token.accessToken;
    }
    if (!NoiAuthService.isRefreshTokenExpired(this.token)) {
      const refreshedToken = await NoiAuthService.refresh(this.token.refreshToken);
      this.token = refreshedToken;
      return refreshedToken.accessToken;
    }

    const newToken = await NoiAuthService.login();
    this.token = newToken;
    return newToken.accessToken;
  }

  private static isAuthTokenExpired(token: AuthToken) {
    if (!token || !token.accessToken) {
      return true;
    }
    return token.expiryDate >= new Date();
  }

  private static isRefreshTokenExpired(token: AuthToken) {
    if (!token || !token.refreshToken) {
      return true;
    }
    return token.refreshExpiryDate >= new Date();
  }

  public static async refresh(refreshToken: string): Promise<AuthToken> {
    try {
      const loginData = {
        'grant_type': 'refresh_token',
        'client_id': process.env.CLIENT_ID,
        'refresh_token': refreshToken
      };
      const response = await fetch(process.env.TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: NoiAuthService.encodeFormData(loginData)
      });
      if (!response.ok) {
        throw new NoiError(AUTH_SERVICE_ERR_UNKNOWN);
      }
      const json = await response.json();
      return NoiAuthService.parseToken(json);
    } catch (err) {
      if (err instanceof NoiError) {
        throw err;
      }
      throw new NoiError(AUTH_SERVICE_ERR_OFFLINE);
    }
  }

  public static async login(): Promise<AuthToken> {
    try {
      const loginData = {
        'grant_type': 'client_credentials',
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET
      };
      const response = await fetch(process.env.TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: NoiAuthService.encodeFormData(loginData)
      });
      if (!response.ok) {
        throw new NoiError(AUTH_SERVICE_ERR_UNKNOWN);
      }
      const json = await response.json();
      return NoiAuthService.parseToken(json);
    } catch (err) {
      if (err instanceof NoiError) {
        throw err;
      }
      throw new NoiError(AUTH_SERVICE_ERR_OFFLINE);
    }
  }
}

export const NoiAuth: AuthService = new NoiAuthService();