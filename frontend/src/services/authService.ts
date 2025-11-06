import api from "../lib/axios";
import type { AuthResponse, LoginDto, RegisterDto } from "../types/auth";

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post("/auth/login", data);
    console.log("Login response:", response.data); // Debug
    // El TransformInterceptor envuelve la respuesta en { data, statusCode, timestamp }
    return response.data.data || response.data;
  },

  async register(data: RegisterDto): Promise<AuthResponse> {
    const response = await api.post("/auth/register", data);
    console.log("Register response:", response.data); // Debug
    // El TransformInterceptor envuelve la respuesta en { data, statusCode, timestamp }
    return response.data.data || response.data;
  },
};
