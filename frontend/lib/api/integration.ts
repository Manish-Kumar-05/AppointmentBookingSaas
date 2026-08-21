import { api } from "../axios";

export const connectGoogle = (organizationId: string) => {
  return `${api.defaults.baseURL}/google/connect?organizationId=${organizationId}`;
};

export const checkGoogleStatus = async (organizationId: string) => {
  const res = await api.get(`/google/status?organizationId=${organizationId}`);
  return res.data.data;
};
