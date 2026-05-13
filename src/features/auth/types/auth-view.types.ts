export type AuthMode = "login" | "register";

export type AuthFormData = {
  name: string;
  schoolName: string;
  studentAlias: string;
  inviteCode: string;
  email: string;
  password: string;
  confirmPassword: string;
};

