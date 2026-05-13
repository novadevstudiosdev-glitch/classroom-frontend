import { axiosClient } from "@/lib/axios/axios-client";
import type {
  StudentFeed,
  StudentParentRequest,
  StudentProfile,
  UpdateStudentProfileInput,
} from "@/features/dashboard/student/types/student-dashboard.types";

type ApiEnvelope<T> = {
  data?: T;
};

const unwrap = <T>(payload: T | ApiEnvelope<T>): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
};

export const getStudentProfile = async (): Promise<StudentProfile> => {
  const { data } = await axiosClient.get<StudentProfile | ApiEnvelope<StudentProfile>>("/students/me");
  return unwrap<StudentProfile>(data);
};

export const updateStudentProfile = async (body: UpdateStudentProfileInput) => {
  const { data } = await axiosClient.patch("/students/me/profile", body);
  return unwrap(data);
};

export const getStudentFeed = async (): Promise<StudentFeed> => {
  const { data } = await axiosClient.get<StudentFeed | ApiEnvelope<StudentFeed>>("/students/me/feed");
  return unwrap<StudentFeed>(data);
};

export const getStudentParentRequests = async (): Promise<StudentParentRequest[]> => {
  const { data } = await axiosClient.get<
    StudentParentRequest[] | ApiEnvelope<StudentParentRequest[]>
  >("/students/me/parent-requests");

  return unwrap<StudentParentRequest[]>(data) ?? [];
};

export const confirmStudentParentRequest = async (requestId: string) => {
  const { data } = await axiosClient.patch(`/students/me/parent-requests/${requestId}/confirm`);
  return unwrap(data);
};

export const rejectStudentParentRequest = async (requestId: string) => {
  const { data } = await axiosClient.patch(`/students/me/parent-requests/${requestId}/reject`);
  return unwrap(data);
};

export const getOrCreateStudentLinkCode = async (): Promise<{ link_code: string }> => {
  const { data } = await axiosClient.post<
    { link_code: string } | ApiEnvelope<{ link_code: string }>
  >("/students/me/link-code");

  return unwrap<{ link_code: string }>(data);
};
