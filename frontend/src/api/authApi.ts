import { apiClient } from './apiClient';

export interface UserSignupData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }
  
  export interface UserLoginData {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    message: string;
    token: string;
  }
  
  export const signupUser = async (data: UserSignupData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/user/signup', data);
    return response.data;
  };
  
  export const loginUser = async (data: UserLoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/user/login', data);
    return response.data;
  };