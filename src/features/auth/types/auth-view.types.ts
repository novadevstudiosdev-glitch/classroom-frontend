export type AuthMode = "login" | "register";

export type AuthFormData = {
  name: string;
  childName: string;
  schoolName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
