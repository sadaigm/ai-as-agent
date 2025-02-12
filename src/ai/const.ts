export const HOST_URL = import.meta.env.VITE_API_HOST_URL || "http://127.0.0.1:11434";
export const API_VERSION_PATH = import.meta.env.VITE_API_VERSION_PATH || "/v1";
export const HOST_URL_VERSION_PATH = `${HOST_URL}${API_VERSION_PATH}`;