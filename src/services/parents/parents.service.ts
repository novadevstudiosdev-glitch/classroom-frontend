import { axiosClient } from "@/lib/axios/axios-client";

export type ParentLinkedStudent = {
  id: string;
  parent_id: string;
  student_id: string;
  is_confirmed: boolean;
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
  students: ParentLinkedStudent[];
};

export async function getParentProfile() {
  const response = await axiosClient.get<ParentProfile>("/parents/me");
  return response.data;
}
