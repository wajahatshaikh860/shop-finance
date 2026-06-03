import api from "./api";

export const getRents = async () => {
  const { data } = await api.get("/rents");
  return data;
};

export const saveRent = async (payload) => {
  const { data } = await api.post("/rents", payload);
  return data;
};
