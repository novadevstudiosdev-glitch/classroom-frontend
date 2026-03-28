export type AuthMode = "login" | "register";

export type AuthFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
