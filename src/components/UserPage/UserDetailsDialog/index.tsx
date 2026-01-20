import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetUserById, useUpdateUser } from "@/hooks/useAdmin";
import { IUpdateUserBody } from "@/interface/auth";
import { toast } from "react-toastify";
import { IconX, IconEdit } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserTable } from "./UserTable";
import { UserForm } from "./UserForm";
import Icon from "@mdi/react";
import { mdiClipboardAccount } from "@mdi/js";

interface UserDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: () => void;
}

export const UserDetailsDialog = ({
  isOpen,
  onClose,
  userId,
  onSuccess,
}: UserDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUpdateUserBody>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER", // DefaultRole
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: userData, isLoading: isLoadingUser } = useGetUserById(userId);
  const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();

  useEffect(() => {
    if (userData?.data) {
      const user = userData.data;
      const profile = user.role === "DRIVER" ? user.driverProfile : {};

      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        password: "",
        active: user.active ?? true,
        walletBalance: user.walletBalance || 0,
        rating: profile?.rating || user.rating || 5,
        vehicleType: profile?.vehicleType || user.vehicleType || "BIKE",
        plateNumber: profile?.plateNumber || user.plateNumber || "",
        licenseImage: profile?.licenseImage || user.licenseImage || "",
        identityNumber: profile?.identityNumber || user.identityNumber || "",
        identityFrontImage:
          profile?.identityFrontImage || user.identityFrontImage || "",
        identityBackImage:
          profile?.identityBackImage || user.identityBackImage || "",
        vehicleRegistrationImage:
          profile?.vehicleRegistrationImage ||
          user.vehicleRegistrationImage ||
          "",
        drivingLicenseNumber:
          profile?.drivingLicenseNumber || user.drivingLicenseNumber || "",
        bankInfo: profile?.bankInfo ||
          user.bankInfo || {
            bankName: "",
            accountNumber: "",
            accountHolder: "",
          },
      });
    }
  }, [userData]);

  const handleFormDataChange = (newFormData: IUpdateUserBody) => {
    setFormData(newFormData);
  };

  const handleErrorsChange = (newErrors: Record<string, string>) => {
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Họ tên là bắt buộc";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.role === "DRIVER") {
      if (!formData.vehicleType) {
        newErrors.vehicleType = "Loại xe là bắt buộc";
      }
      if (!formData.plateNumber?.trim()) {
        newErrors.plateNumber = "Biển số xe là bắt buộc";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const updateData: any = {
      name: formData.name,
      email: formData.email || undefined,
      phone: formData.phone,
      role: formData.role,
      walletBalance: formData.walletBalance,
    };

    if (formData.password?.trim()) {
      updateData.password = formData.password;
    }

    if (formData.role === "DRIVER") {
      updateData.driverProfile = {
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
      };
    }

    updateUserMutation(
      { id: userId, data: updateData },
      {
        onSuccess: (_response: any) => {
          toast.success("Cập nhật người dùng thành công!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi cập nhật người dùng!";
          toast.error(errorMsg);
        },
      },
    );
  };

  const handleClose = () => {
    setIsEditing(false);
    setErrors({});
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    if (userData?.data) {
      const user = userData.data;
      const profile = user.role === "DRIVER" ? user.driverProfile : {};

      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        password: "",
        walletBalance: user.walletBalance || 0,
        rating: profile?.rating || user.rating || 5,
        vehicleType: profile?.vehicleType || user.vehicleType || "BIKE",
        plateNumber: profile?.plateNumber || user.plateNumber || "",
        licenseImage: profile?.licenseImage || user.licenseImage || "",
        identityNumber: profile?.identityNumber || user.identityNumber || "",
        identityFrontImage:
          profile?.identityFrontImage || user.identityFrontImage || "",
        identityBackImage:
          profile?.identityBackImage || user.identityBackImage || "",
        vehicleRegistrationImage:
          profile?.vehicleRegistrationImage ||
          user.vehicleRegistrationImage ||
          "",
        drivingLicenseNumber:
          profile?.drivingLicenseNumber || user.drivingLicenseNumber || "",
        bankInfo: profile?.bankInfo ||
          user.bankInfo || {
            bankName: "",
            accountNumber: "",
            accountHolder: "",
          },
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Icon path={mdiClipboardAccount} size={0.8} />
            <span>
              {isEditing
                ? "Cập nhật người dùng: " + userData?.data?.name
                : "Chi tiết người dùng"}
            </span>
          </DialogTitle>
        </DialogHeader>

        {isLoadingUser ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {isEditing ? (
              <UserForm
                formData={formData}
                errors={errors}
                isUpdating={isUpdating}
                onFormDataChange={handleFormDataChange}
                onErrorsChange={handleErrorsChange}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <>
                {userData?.data && <UserTable user={userData.data} />}
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={handleClose}>
                    <IconX className="h-4 w-4" />
                    Đóng
                  </Button>
                  <Button onClick={handleEdit}>
                    <IconEdit className="h-4 w-4" />
                    Chỉnh sửa
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
