import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetUserById, useUpdateUser } from "@/hooks/useAdmin";
import { IUpdateUserBody } from "@/interface/auth";
import { toast } from "react-toastify";
import { IconEdit } from "@tabler/icons-react";
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
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        password: "",
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
      newErrors.name = "Tên hiển thị là bắt buộc";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (
      formData.phone &&
      !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone)
    ) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const updateData: IUpdateUserBody = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
    };

    if (formData.password?.trim()) {
      updateData.password = formData.password;
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
          toast.error(
            error?.response?.data?.message ||
              "Có lỗi xảy ra khi cập nhật người dùng!"
          );
        },
      }
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
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        password: "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        size="medium"
        className="max-h-[90vh] h-[90vh] overflow-y-auto flex flex-col"
      >
        <DialogHeader>
          <DialogTitle>
            <Icon path={mdiClipboardAccount} size={0.8} />
            {isEditing
              ? "Cập nhật người dùng: " + userData?.data?.name
              : "Chi tiết người dùng"}
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
                <div className="flex gap-2 justify-end pt-4">
                  <Button variant="outline" onClick={handleClose}>
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
