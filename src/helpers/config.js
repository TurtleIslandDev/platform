export const headers = {
  Accept: "application/json",
  "Content-Type": "",
};
export const formDataheaders = {
  Accept: "application/json",
  "Content-Type": "",
};

export const getHeaders = async (token, formData) => {
  const headers = {
    Accept: "application/json",
  };
  if (token) Object.assign(headers, { Authorization: `Bearer ${token}` });
  if (formData) {
    Object.assign(headers, { "Content-Type": "multipart/form-data" });
  } else {
    Object.assign(headers, { "Content-Type": "application/json" });
  }

  return headers;
};
