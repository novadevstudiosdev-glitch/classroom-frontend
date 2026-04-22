import { axiosClient } from "@/lib/axios/axios-client";

type ApiEnvelope<T> = {
  data?: T;
};

const extractData = <T>(payload: unknown): T => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    (payload as ApiEnvelope<T>).data !== undefined
  ) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
};

export type ParentLinkedStudent = {
  id: string;
  parent_id: string;
  student_id: string;
  status: "pending" | "confirmed" | "rejected";
  created_at: string;
  updated_at: string;
};

export type ParentProfile = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  children: ParentLinkedStudent[];
};

export async function getParentProfile() {
  const response = await axiosClient.get<ParentProfile>("/parents/me");
  return extractData<ParentProfile>(response.data);
}

export async function linkChildByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const response = await axiosClient.post("/parents/me/children", { email: normalizedEmail });
  return extractData<{ message?: string }>(response.data);
}
