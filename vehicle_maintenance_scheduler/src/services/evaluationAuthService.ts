import axios from "axios";
import { AppError } from "../utils/appError";

interface AuthTokenCache {
  token: string;
  expiresAtUnix: number;
}

let cache: AuthTokenCache | null = null;

const nowSec = (): number => Math.floor(Date.now() / 1000);

export const evaluationAuthService = {
  async getAccessToken(): Promise<string> {
    if (cache && cache.expiresAtUnix - 30 > nowSec()) {
      return cache.token;
    }

    const url = `${process.env.BASE_URL}/auth`;
    try {
      const response = await axios.post(url, {
        email: process.env.EMAIL,
        name: process.env.NAME,
        rollNo: process.env.ROLL_NO,
        accessCode: process.env.ACCESS_CODE,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
      }, { timeout: 5000 });

      const token = response.data?.access_token as string | undefined;
      const expiresIn = Number(response.data?.expires_in || 300);
      if (!token) {
        throw new AppError("Failed to fetch evaluation access token", 500);
      }
      cache = {
        token,
        expiresAtUnix: nowSec() + expiresIn
      };
      return token;
    } catch (error) {
      throw new AppError("Evaluation auth API failed", 502, error);
    }
  }
};
