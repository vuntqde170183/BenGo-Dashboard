import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useGetUserById, useUpdateUser } from "@/hooks/useAdmin";
import { useProfile } from "@/hooks/useAuth";
import { IUpdateUserBody } from "@/interface/auth";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
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
  mdiMapMarker, mdiContentSave,
  mdiRouter,
  mdiNavigation
} from "@mdi/js";
import { Badge } from "@/components/ui/badge";

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
  const [currentAddress, setCurrentAddress] = useState<string>("");

  useEffect(() => {
    const coords =
      userData?.data?.driverProfile?.location?.coordinates ||
      userData?.data?.location?.coordinates;
    const lat = coords?.[1];
    const lng = coords?.[0];

    if (typeof lat === "number" && typeof lng === "number") {
      const fetchAddress = async () => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY
            }&language=vi`
          );
          if (response.data.status === "OK" && response.data.results.length > 0) {
            setCurrentAddress(response.data.results[0].formatted_address);
          } else {
            setCurrentAddress(`Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          setCurrentAddress(`Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      };
      fetchAddress();
    } else {
      setCurrentAddress("Không có dữ liệu vị trí");
    }
  }, [userData]);

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

  const openInGoogleMaps = () => {
    const lat = userData?.data?.driverProfile?.location?.coordinates?.[1] || userData?.data?.location?.coordinates?.[1];
    const lng = userData?.data?.driverProfile?.location?.coordinates?.[0] || userData?.data?.location?.coordinates?.[0];

    if (lat && lng) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
        "_blank"
      );
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
                    <div className="space-y-4">
                      {/* Interactive Google Map Section */}
                      <Card className="overflow-hidden border-darkBorderV1 bg-darkBackgroundV1/30">
                        <CardContent className="p-0 relative">
                          <div className="h-64 w-full bg-darkBackgroundV1/50 relative">
                            {(() => {
                              const coords = userData?.data?.driverProfile?.location?.coordinates || userData?.data?.location?.coordinates;
                              const lat = coords?.[1];
                              const lng = coords?.[0];
                              const hasCoords = typeof lat === "number" && typeof lng === "number";

                              if (hasCoords) {
                                return (
                                  <>
                                    <iframe
                                      width="100%"
                                      height="100%"
                                      style={{ border: 0 }}
                                      loading="lazy"
                                      allowFullScreen
                                      referrerPolicy="no-referrer-when-downgrade"
                                      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY
                                        }&q=${lat},${lng}&zoom=15&maptype=roadmap`}
                                      className="opacity-95 hover:opacity-100 transition-opacity"
                                    ></iframe>
                                    <button
                                      onClick={openInGoogleMaps}
                                      className="absolute bottom-4 right-4 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-full text-xs font-bold shadow-2xl transition-all flex items-center gap-2 group/btn active:scale-95 z-20"
                                    >
                                      <Icon path={mdiRouter} size={0.6} />
                                      <span>Xem trên Google Maps</span>
                                    </button>
                                  </>
                                );
                              }

                              return (
                                <div className="w-full h-full flex items-center justify-center text-neutral-500 italic text-sm gap-2">
                                  <Icon path={mdiMapMarker} size={1} className="opacity-20" />
                                  Chưa cập nhật vị trí
                                </div>
                              );
                            })()}
                          </div>

                          <div className="p-4 bg-darkCardV1/40 flex items-center justify-between">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-primary/10 text-primary mt-1 shadow-inner">
                                <Icon path={mdiNavigation} size={0.8} />
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs uppercase font-bold text-white tracking-wider">
                                  Vị trí hiện tại
                                </p>
                                <p className="font-semibold text-sm text-primary leading-relaxed">
                                  {currentAddress || "Đang tải vị trí..."}
                                </p>
                              </div>
                            </div>
                            <Badge variant={userData.data.isOnline ? "green" : "neutral"}>
                              <div className={`w-2 h-2 rounded-full animate-pulse ${userData.data.isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-neutral-500'}`} />
                              {userData.data.isOnline ? "Trực tuyến" : "Ngoại tuyến"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
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
