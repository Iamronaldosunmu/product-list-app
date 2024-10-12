import { useMutation } from "@tanstack/react-query";
import { signupUser, loginUser, UserSignupData, UserLoginData, AuthResponse } from "../authApi";

export const useSignup = () => {
  return useMutation<AuthResponse, Error, UserSignupData>({
    mutationFn: (userData) => signupUser(userData),
  });
};

export const useLogin = () => {
  return useMutation<AuthResponse, Error, UserLoginData>({
    mutationFn: (userData) => loginUser(userData),
  });
};