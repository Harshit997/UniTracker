import api from "./axios";

export const getApplications = async (category) => {
  const { data } = await api.get("/applications", { params: { category } });
  return data;
};

export const getApplication = async (id) => {
  const { data } = await api.get(`/applications/${id}`);
  return data;
};

export const createApplication = async (application) => {
  const { data } = await api.post("/applications", application);
  return data;
};

export const updateApplication = async (id, changes) => {
  const { data } = await api.put(`/applications/${id}`, changes);
  return data;
};

export const deleteApplication = async (id) => {
  const { data } = await api.delete(`/applications/${id}`);
  return data;
};

export const addHr = async (id, hr) => {
  const { data } = await api.post(`/applications/${id}/hrs`, hr);
  return data;
};

export const updateHr = async (id, hrId, changes) => {
  const { data } = await api.put(`/applications/${id}/hrs/${hrId}`, changes);
  return data;
};

export const deleteHr = async (id, hrId) => {
  const { data } = await api.delete(`/applications/${id}/hrs/${hrId}`);
  return data;
};

export const addComment = async (id, text) => {
  const { data } = await api.post(`/applications/${id}/comments`, { text });
  return data;
};

export const deleteComment = async (id, commentId) => {
  const { data } = await api.delete(`/applications/${id}/comments/${commentId}`);
  return data;
};

export const getStats = async () => {
  const { data } = await api.get("/applications/stats");
  return data;
};