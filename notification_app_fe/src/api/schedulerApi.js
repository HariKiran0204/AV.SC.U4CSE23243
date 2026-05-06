import axios from "axios";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4001"
});
export const schedulerApi = {
    login: async (email, password) => {
        const { data } = await api.post("/api/v1/auth/login", { email, password });
        return data;
    },
    getDepots: async (token) => {
        const { data, headers } = await api.get("/api/v1/depots", { headers: { Authorization: `Bearer ${token}` } });
        return { data, requestId: headers["x-request-id"] };
    },
    scheduleDepot: async (token, depotId) => {
        const { data, headers } = await api.post(`/api/v1/depots/${depotId}/schedule`, {}, { headers: { Authorization: `Bearer ${token}` } });
        return { data, requestId: headers["x-request-id"] };
    }
};
