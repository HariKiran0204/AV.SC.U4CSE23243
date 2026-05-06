import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4001),
  baseUrl: process.env.BASE_URL || "http://20.207.122.201/evaluation-service"
};
