import api from "./api";

export const createTransactions = async (payload) => {
  const { data } = await api.post("/transactions", payload);
  return data;
};

export const getTransactions = async () => {
  const { data } = await api.get("/transactions");
  return data;
};

export const deleteTransaction = async (id) => {
  const { data } = await api.delete(`/transactions/${id}`);
  return data;
};

export const updateTransaction = async (id, payload) => {
  const { data } = await api.put(`/transactions/${id}`, payload);
  return data;
};
