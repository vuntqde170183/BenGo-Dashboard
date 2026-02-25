import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetUserById, useUpdateUser } from "@/hooks/useAdmin";
import { useProfile } from "@/hooks/useAuth";
import { IUpdateUserBody } from "@/interface/auth";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserTable } from "../../UserPage/UserDetailsDialog/UserTable";
import { UserForm } from "../../UserPage/UserDetailsDialog/UserForm";
import Icon from "@mdi/react";
import {
  mdiClipboardAccount,
  mdiClose,
  mdiPencil,
  mdiMapMarker,
  mdiOpenInNew,
  mdiContentSave,
} from "@mdi/js";

interface DriverDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  driverId: string;
  onSuccess?: () => void;
}

export const DriverDetailsDialog = ({
  isOpen,
  onClose,
  driverId,
  onSuccess,
}: DriverDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IUpdateUserBody>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "DRIVER",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { data: userData, isLoading: isLoadingUser } = useGetUserById(driverId);
  const { mutate: updateUserMutation, isPending: isUpdating } = useUpdateUser();
  const { data: profileData } = useProfile();
  const userRole = profileData?.data?.role;

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

    updateUserMutation(
      { id: driverId, data: updateData },
      {
        onSuccess: (_response: any) => {
          toast.success("Cập nhật tài xế thành công!");
          setIsEditing(false);
          onSuccess?.();
        },
        onError: (error: any) => {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Có lỗi xảy ra khi cập nhật tài xế!";
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
                ? "Cập nhật tài xế: " + userData?.data?.name
                : "Chi tiết tài xế"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 md:space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar p-3 md:p-4">
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
                  showButtons={false}
                />
              ) : (
                <>
                  {userData?.data && <UserTable user={userData.data} />}
                  {userRole === "DISPATCHER" && (
                    <Card>
                      <CardHeader className="py-3 border-b border-primary/10">
                        <div className="flex items-center gap-2 text-primary">
                          <Icon path={mdiMapMarker} size={0.8} />
                          <span className="font-semibold">Vị trí tài xế</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-neutral-300">
                            Theo dõi vị trí thời gian thực trên bản đồ điều phối.
                          </p>
                          <p className="text-sm text-neutral-400 italic">
                            Trạng thái:{" "}
                            {userData.data.isOnline ? "Trực tuyến" : "Ngoại tuyến"}
                          </p>
                        </div>
                        <Link to="/admin/dispatcher/drivers">
                          <Button>
                            <Icon path={mdiOpenInNew} size={0.8} />
                            Xem bản đồ
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                <Icon path={mdiClose} size={0.8} />
                Hủy bỏ
              </Button>
              <Button onClick={handleSubmit} disabled={isUpdating}>
                <Icon path={mdiContentSave} size={0.8} />
                {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose}>
                <Icon path={mdiClose} size={0.8} />
                Đóng
              </Button>
              {userRole !== "DISPATCHER" && (
                <Button onClick={handleEdit}>
                  <Icon path={mdiPencil} size={0.8} />
                  Chỉnh sửa
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

