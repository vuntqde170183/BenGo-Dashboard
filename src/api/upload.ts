import { sendPost } from "./axios";

export const uploadApi = {
  image: (formData: FormData) => sendPost("/upload", formData),
};
