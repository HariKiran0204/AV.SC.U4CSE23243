import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4001"
});

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
  };
  requestId?: string;
}

export const schedulerApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post("/api/v1/auth/login", { email, password });
    return data;
  },
  getDepots: async (token: string) => {
    const { data, headers } = await api.get("/api/v1/depots", { headers: { Authorization: `Bearer ${token}` } });
    return { data, requestId: headers["x-request-id"] as string | undefined };
  },
  scheduleDepot: async (token: string, depotId: string) => {
    const { data, headers } = await api.post(`/api/v1/depots/${depotId}/schedule`, {}, { headers: { Authorization: `Bearer ${token}` } });
    return { data, requestId: headers["x-request-id"] as string | undefined };
  }
};
