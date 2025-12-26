import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "@/api/upload";
import { toast } from "react-toastify";

export const useUploadImage = () => {
  return useMutation({
    mutationFn: (formData: FormData) => uploadApi.image(formData),
    onError: () => {
      toast.error("Failed to upload image");
    },
  });
};

export const useUploadFile = useUploadImage;

