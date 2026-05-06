interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

export const tokenManager = {
  async getToken(): Promise<string> {
    if (tokenCache && tokenCache.expiresAt > Date.now()) {
      return tokenCache.token;
    }
    return this.refreshToken();
  },

  async refreshToken(): Promise<string> {
    const token = process.env.API_AUTH_TOKEN || "local-dev-token";
    tokenCache = {
      token,
      expiresAt: Date.now() + 5 * 60 * 1000
    };
    return token;
  },

  clear(): void {
    tokenCache = null;
  }
};
