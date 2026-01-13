import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IUpdateUserBody, IUploadResponse } from "@/interface/auth";
import {
  IconLoader2,
  IconCheck,
  IconEye,
  IconEyeOff,
  IconX,
  IconUpload,
  IconTrash,
  IconPlus,
  IconUser,
  IconTruck,
  IconId,
  IconBuildingBank,
} from "@tabler/icons-react";
import { useState } from "react";
import { useUploadFile } from "@/hooks/useUpload";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface UserFormProps {
  formData: IUpdateUserBody;
  errors: Record<string, string>;
  isUpdating: boolean;
  onFormDataChange: (data: IUpdateUserBody) => void;
  onErrorsChange: (errors: Record<string, string>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  mode?: "create" | "edit";
}

export const UserForm = ({
  formData,
  errors,
  isUpdating,
  onFormDataChange,
  onErrorsChange,
  onSubmit,
  onCancel,
  mode = "edit",
}: UserFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: uploadFileMutation } = useUploadFile();
  const [isUploading, setIsUploading] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    onFormDataChange(newFormData);

    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
      onErrorsChange(newErrors);
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = value === "" ? undefined : Number(value);
    const newFormData = { ...formData, [name]: numValue };
    onFormDataChange(newFormData);

    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
      onErrorsChange(newErrors);
    }
  };

  const handleClear = (name: string) => {
    const newFormData = { ...formData, [name]: "" };
    onFormDataChange(newFormData);
    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
      onErrorsChange(newErrors);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    const newFormData = { ...formData, [name]: value };
    onFormDataChange(newFormData);
    if (errors[name]) {
      const newErrors = { ...errors, [name]: "" };
      onErrorsChange(newErrors);
    }
  };

  const handleBankInfoChange = (field: string, value: string) => {
    const newFormData = {
      ...formData,
      bankInfo: {
        ...(formData.bankInfo || {
          bankName: "",
          accountNumber: "",
          accountHolder: "",
        }),
        [field]: value,
      },
    };
    onFormDataChange(newFormData);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof IUpdateUserBody,
    isMultiple: boolean = false
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(field as string);
    const uploadData = new FormData();
    uploadData.append("file", file);

    uploadFileMutation(uploadData, {
      onSuccess: (response: IUploadResponse) => {
        if (
          response?.statusCode === 200 ||
          response?.data?.statusCode === 200
        ) {
          const imageUrl = response?.data?.data?.url;
          if (isMultiple) {
            const currentImages = (formData[field] as string[]) || [];
            onFormDataChange({
              ...formData,
              [field]: [...currentImages, imageUrl],
            });
          } else {
            onFormDataChange({ ...formData, [field]: imageUrl });
          }
          toast.success("Tải ảnh lên thành công!");
        } else {
          toast.error("Tải ảnh lên thất bại!");
        }
        setIsUploading(null);
      },
      onError: () => {
        toast.error("Tải ảnh lên thất bại!");
        setIsUploading(null);
      },
    });
    e.target.value = "";
  };

  const removeImage = (field: keyof IUpdateUserBody, index: number) => {
    const currentImages = (formData[field] as string[]) || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    onFormDataChange({ ...formData, [field]: newImages });
  };

  const role = formData.role;

  return (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["basic"]} className="w-full">
        {/* Thông tin cơ bản */}
        <AccordionItem value="basic" className="border-none">
          <AccordionTrigger className="hover:no-underline py-2">
            <div className="flex items-center gap-2">
              <IconUser className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold text-primary">
                Thông tin cơ bản
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="dark:text-neutral-200">
                  Họ tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onClear={() => handleClear("name")}
                  placeholder="Nhập họ tên"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="dark:text-neutral-200">
                  Số điện thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onClear={() => handleClear("phone")}
                  placeholder="Nhập số điện thoại"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-neutral-200">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onClear={() => handleClear("email")}
                  placeholder="Nhập email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-neutral-200">
                  Mật khẩu {mode === "edit" && "(để trống nếu không đổi)"}{" "}
                  <span className="text-red-500">
                    {mode === "create" && "*"}
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu"
                    className={`${
                      errors.password ? "border-red-500" : ""
                    } pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                  >
                    {showPassword ? (
                      <IconEyeOff className="h-5 w-5" />
                    ) : (
                      <IconEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="walletBalance"
                  className="dark:text-neutral-200"
                >
                  Số dư ví <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="walletBalance"
                  name="walletBalance"
                  type="number"
                  value={formData.walletBalance}
                  onChange={handleNumberChange}
                  placeholder="0"
                />
              </div>

              {role === "DRIVER" && (
                <div className="space-y-2">
                  <Label htmlFor="rating" className="dark:text-neutral-200">
                    Điểm đánh giá <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={handleNumberChange}
                    placeholder="5"
                  />
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {role === "DRIVER" && (
          <>
            {/* Thông tin xe */}
            <AccordionItem value="vehicle" className="border-none mt-2">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-2">
                  <IconTruck className="h-5 w-5 text-primary" />
                  <span className="text-base font-semibold text-primary">
                    Thông tin xe
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="vehicleType"
                      className="dark:text-neutral-200"
                    >
                      Loại xe <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.vehicleType as string}
                      onValueChange={(value) =>
                        handleSelectChange("vehicleType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại xe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BIKE">Xe máy (BIKE)</SelectItem>
                        <SelectItem value="VAN">Xe tải nhỏ (VAN)</SelectItem>
                        <SelectItem value="TRUCK">Xe tải (TRUCK)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="plateNumber"
                      className="dark:text-neutral-200"
                    >
                      Biển số xe <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="plateNumber"
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleChange}
                      onClear={() => handleClear("plateNumber")}
                      placeholder="Nhập biển số xe (Ví dụ: 29A-12345)"
                      className={errors.plateNumber ? "border-red-500" : ""}
                    />
                    {errors.plateNumber && (
                      <p className="text-red-500 text-sm">
                        {errors.plateNumber}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="drivingLicenseNumber"
                      className="dark:text-neutral-200"
                    >
                      Số bằng lái xe
                    </Label>
                    <Input
                      id="drivingLicenseNumber"
                      name="drivingLicenseNumber"
                      value={formData.drivingLicenseNumber}
                      onChange={handleChange}
                      placeholder="Nhập số bằng lái"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Ảnh Bằng lái */}
                  <div className="space-y-2 w-full">
                    <Label className="dark:text-neutral-200">
                      Ảnh bằng lái
                    </Label>
                    <div>
                      {formData.licenseImages?.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-lg overflow-hidden border border-darkBorderV1 bg-darkBackgroundV2 group"
                        >
                          <img
                            src={url}
                            alt={`license-${idx}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage("licenseImages", idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <IconTrash className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {(formData.licenseImages?.length || 0) < 2 && (
                        <label className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-darkBorderV1 rounded-lg cursor-pointer hover:bg-darkBackgroundV2 transition-colors">
                          {isUploading === "licenseImages" ? (
                            <IconLoader2 className="h-6 w-6 animate-spin text-neutral-400" />
                          ) : (
                            <>
                              <IconPlus className="h-6 w-6 text-neutral-400" />
                              <span className="text-sm text-neutral-400">
                                Tải ảnh bằng lái
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(e, "licenseImages", true)
                            }
                            disabled={!!isUploading}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Ảnh đăng ký xe (Cà vẹt) */}
                  <div className="space-y-2 w-full">
                    <Label className="dark:text-neutral-200">
                      Ảnh đăng ký xe
                    </Label>
                    <div>
                      {formData.vehicleRegistrationImages?.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-lg overflow-hidden border border-darkBorderV1 bg-darkBackgroundV2 group"
                        >
                          <img
                            src={url}
                            alt={`registration-${idx}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              removeImage("vehicleRegistrationImages", idx)
                            }
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <IconTrash className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {(formData.vehicleRegistrationImages?.length || 0) <
                        2 && (
                        <label className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-darkBorderV1 rounded-lg cursor-pointer hover:bg-darkBackgroundV2 transition-colors">
                          {isUploading === "vehicleRegistrationImages" ? (
                            <IconLoader2 className="h-6 w-6 animate-spin text-neutral-400" />
                          ) : (
                            <>
                              <IconPlus className="h-6 w-6 text-neutral-400" />
                              <span className="text-sm text-neutral-400">
                                Tải ảnh đăng ký xe
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                              handleImageUpload(
                                e,
                                "vehicleRegistrationImages",
                                true
                              )
                            }
                            disabled={!!isUploading}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Giấy tờ & Định danh */}
            <AccordionItem value="documents" className="border-none mt-2">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-2">
                  <IconId className="h-5 w-5 text-primary" />
                  <span className="text-base font-semibold text-primary">
                    Giấy tờ & Định danh
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="identityNumber"
                    className="dark:text-neutral-200"
                  >
                    Số CCCD/CMND
                  </Label>
                  <Input
                    id="identityNumber"
                    name="identityNumber"
                    value={formData.identityNumber}
                    onChange={handleChange}
                    placeholder="Nhập số CCCD/CMND"
                    className="max-w-md"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                  {/* Mặt trước */}
                  <div className="space-y-2">
                    <Label className="dark:text-neutral-200">Mặt trước</Label>
                    {formData.identityFrontImage ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-darkBorderV1 bg-darkBackgroundV2 group">
                        <img
                          src={formData.identityFrontImage}
                          alt="identity-front"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            onFormDataChange({
                              ...formData,
                              identityFrontImage: "",
                            })
                          }
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <IconTrash className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-darkBorderV1 rounded-lg cursor-pointer hover:bg-darkBackgroundV2 transition-colors">
                        {isUploading === "identityFrontImage" ? (
                          <IconLoader2 className="h-6 w-6 animate-spin text-neutral-400" />
                        ) : (
                          <>
                            <IconPlus className="h-6 w-6 text-neutral-400" />
                            <span className="text-sm text-neutral-400 mt-1">
                              Tải ảnh CCCD mặt trước
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, "identityFrontImage")
                          }
                          disabled={!!isUploading}
                        />
                      </label>
                    )}
                  </div>

                  {/* Mặt sau */}
                  <div className="space-y-2">
                    <Label className="dark:text-neutral-200">Mặt sau</Label>
                    {formData.identityBackImage ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-darkBorderV1 bg-darkBackgroundV2 group">
                        <img
                          src={formData.identityBackImage}
                          alt="identity-back"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            onFormDataChange({
                              ...formData,
                              identityBackImage: "",
                            })
                          }
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <IconTrash className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <label className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-darkBorderV1 rounded-lg cursor-pointer hover:bg-darkBackgroundV2 transition-colors">
                        {isUploading === "identityBackImage" ? (
                          <IconLoader2 className="h-6 w-6 animate-spin text-neutral-400" />
                        ) : (
                          <>
                            <IconPlus className="h-6 w-6 text-neutral-400" />
                            <span className="text-sm text-neutral-400 mt-1">
                              Tải ảnh CCCD mặt sau
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(e, "identityBackImage")
                          }
                          disabled={!!isUploading}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Thông tin ngân hàng */}
            <AccordionItem value="bank" className="border-none mt-2">
              <AccordionTrigger className="hover:no-underline py-2">
                <div className="flex items-center gap-2">
                  <IconBuildingBank className="h-5 w-5 text-primary" />
                  <span className="text-base font-semibold text-primary">
                    Thông tin ngân hàng
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="dark:text-neutral-200">
                      Tên ngân hàng
                    </Label>
                    <Input
                      value={formData.bankInfo?.bankName || ""}
                      onChange={(e) =>
                        handleBankInfoChange("bankName", e.target.value)
                      }
                      placeholder="Ví dụ: MB Bank, Vietcombank..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-neutral-200">
                      Số tài khoản
                    </Label>
                    <Input
                      value={formData.bankInfo?.accountNumber || ""}
                      onChange={(e) =>
                        handleBankInfoChange("accountNumber", e.target.value)
                      }
                      placeholder="Nhập số tài khoản"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="dark:text-neutral-200">
                      Chủ tài khoản
                    </Label>
                    <Input
                      value={formData.bankInfo?.accountHolder || ""}
                      onChange={(e) =>
                        handleBankInfoChange("accountHolder", e.target.value)
                      }
                      placeholder="Nhập tên chủ tài khoản (In hoa không dấu)"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </>
        )}
      </Accordion>

      <div className="flex gap-2 justify-end pt-4 border-t border-darkBorderV1">
        <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
          <IconX className="h-4 w-4" />
          {mode === "create" ? "Hủy" : "Đóng"}
        </Button>
        <Button onClick={onSubmit} disabled={isUpdating || !!isUploading}>
          {isUpdating ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              {mode === "create" ? "Đang tạo..." : "Đang cập nhật..."}
            </>
          ) : (
            <>
              <IconCheck className="h-4 w-4" />
              {mode === "create" ? "Tạo người dùng" : "Lưu thay đổi"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
