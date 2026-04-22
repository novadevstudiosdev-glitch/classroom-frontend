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

export type ParentRequest = {
  id: string;
  parent_id: string;
  parent_name: string | null;
  status: "pending" | "confirmed" | "rejected";
  created_at: string;
};

export async function getStudentParentRequests() {
  const response = await axiosClient.get("/students/me/parent-requests");
  return extractData<ParentRequest[]>(response.data);
}

export async function confirmStudentParentRequest(requestId: string) {
  const response = await axiosClient.patch(`/students/me/parent-requests/${requestId}/confirm`);
  return extractData<{ message?: string }>(response.data);
}

export async function rejectStudentParentRequest(requestId: string) {
  const response = await axiosClient.patch(`/students/me/parent-requests/${requestId}/reject`);
  return extractData<{ message?: string }>(response.data);
}

export async function getStudentLinkCode() {
  const response = await axiosClient.post("/students/me/link-code");
  return extractData<{ link_code: string }>(response.data);
}
