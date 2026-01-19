import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useCreateUser } from "@/hooks/useAdmin";
import { useUploadFile } from "@/hooks/useUpload";
import { ICreateUserBody, IUploadResponse } from "@/interface/auth";
import { toast } from "react-toastify";
import { IconLoader2, IconX, IconUpload } from "@tabler/icons-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mdiPlusBox } from "@mdi/js";
import Icon from "@mdi/react";
import { UserForm } from "@/components/UserPage/UserDetailsDialog/UserForm";

interface DriverCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DriverCreateDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: DriverCreateDialogProps) => {
  const [formData, setFormData] = useState<ICreateUserBody>({
    name: "",
    email: "",
    password: "",
    phone: "",
    avatar: "",
    role: "DRIVER",
    active: true,
    walletBalance: 0,
    rating: 5,
    vehicleType: "BIKE",
    plateNumber: "",
    licenseImage: "",
    identityNumber: "",
    identityFrontImage: "",
    identityBackImage: "",
    vehicleRegistrationImage: "",
    drivingLicenseNumber: "",
    bankInfo: {
      bankName: "",
      accountNumber: "",
      accountHolder: "",
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const { mutate: createUserMutation, isPending } = useCreateUser();
  const { mutate: uploadFileMutation } = useUploadFile();

  const handleFormDataChange = (newFormData: any) => {
    setFormData(newFormData);
  };

  const handleErrorsChange = (newErrors: Record<string, string>) => {
    setErrors(newErrors);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    const formDataToUpload = new FormData();
    formDataToUpload.append("file", file);

    uploadFileMutation(formDataToUpload, {
      onSuccess: (response: IUploadResponse) => {
        if (
          response?.statusCode === 200 ||
          response?.data?.statusCode === 200
        ) {
          const imageUrl = response?.data?.data?.url;
          setFormData((prev) => ({ ...prev, avatar: imageUrl }));
          toast.success("Tải ảnh đại diện thành công!");
        } else {
          toast.error("Tải ảnh đại diện thất bại!");
        }
        setIsUploadingAvatar(false);
      },
      onError: () => {
        toast.error("Tải ảnh đại diện thất bại!");
        setIsUploadingAvatar(false);
      },
    });
    e.target.value = "";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Họ tên là bắt buộc";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.password?.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.vehicleType) {
      newErrors.vehicleType = "Loại xe là bắt buộc";
    }
    if (!formData.plateNumber?.trim()) {
      newErrors.plateNumber = "Biển số xe là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const submitData: any = {
      name: formData.name,
      phone: formData.phone,
      password: formData.password,
      role: "DRIVER",
      email: formData.email || undefined,
      avatar: formData.avatar || undefined,
      walletBalance: formData.walletBalance,
      driverProfile: {
        vehicleType: formData.vehicleType,
        plateNumber: formData.plateNumber,
        rating: formData.rating,
        licenseImage: formData.licenseImage,
        identityNumber: formData.identityNumber,
        identityFrontImage: formData.identityFrontImage,
        identityBackImage: formData.identityBackImage,
        vehicleRegistrationImage: formData.vehicleRegistrationImage,
        drivingLicenseNumber: formData.drivingLicenseNumber,
        bankInfo: formData.bankInfo,
      },
    };

    createUserMutation(submitData, {
      onSuccess: () => {
        toast.success("Tạo tài xế thành công!");
        handleClose();
        onSuccess?.();
      },
      onError: (error: any) => {
        const errorMsg =
          error?.response?.data?.message ||
          error?.message ||
          "Có lỗi xảy ra khi tạo tài xế!";
        toast.error(errorMsg);
      },
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      avatar: "",
      role: "DRIVER",
      active: true,
      walletBalance: 0,
      rating: 5,
      vehicleType: "BIKE",
      plateNumber: "",
      licenseImage: "",
      identityNumber: "",
      identityFrontImage: "",
      identityBackImage: "",
      vehicleRegistrationImage: "",
      drivingLicenseNumber: "",
      bankInfo: {
        bankName: "",
        accountNumber: "",
        accountHolder: "",
      },
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium">
        <DialogHeader>
          <DialogTitle className="dark:text-neutral-200">
            <Icon path={mdiPlusBox} size={0.8} />
            Thêm tài xế mới
          </DialogTitle>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-2 border-dashed border-lightBorderV1 dark:border-darkBorderV1 overflow-hidden flex items-center justify-center bg-slate-50 dark:bg-darkBackgroundV1">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-neutral-400 text-center p-2">
                      {isUploadingAvatar ? (
                        <IconLoader2 className="h-8 w-8 animate-spin mx-auto" />
                      ) : (
                        <>
                          <IconUpload className="h-8 w-8 mx-auto mb-1" />
                          <span className="text-xs">Ảnh đại diện</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="avatar-upload-driver"
                  disabled={isUploadingAvatar}
                />
                <Label
                  htmlFor="avatar-upload-driver"
                  className="absolute inset-0 cursor-pointer rounded-full"
                />
                {formData.avatar && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, avatar: "" }))
                    }
                    className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full shadow-lg"
                  >
                    <IconX className="h-3 w-3" />
                  </button>
                )}
              </div>
              <p className="text-sm text-neutral-400">
                Tải lên ảnh PNG, JPG (Max 10MB)
              </p>
            </div>

            <UserForm
              mode="create"
              hideRoleSelect={true}
              formData={formData}
              errors={errors}
              isUpdating={isPending}
              onFormDataChange={handleFormDataChange}
              onErrorsChange={handleErrorsChange}
              onSubmit={handleSubmit}
              onCancel={handleClose}
            />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};
