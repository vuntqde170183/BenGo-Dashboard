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
import { IUpdateUserBody } from "@/interface/auth";
import { IconLoader2, IconCheck } from "@tabler/icons-react";

interface UserFormProps {
  formData: IUpdateUserBody;
  errors: Record<string, string>;
  isUpdating: boolean;
  onFormDataChange: (data: IUpdateUserBody) => void;
  onErrorsChange: (errors: Record<string, string>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const UserForm = ({
  formData,
  errors,
  isUpdating,
  onFormDataChange,
  onErrorsChange,
  onSubmit,
  onCancel,
}: UserFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="role" className="dark:text-neutral-200">
          Vai trò
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value) => handleSelectChange("role", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="DISPATCHER">Điều phối viên</SelectItem>
            <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
            <SelectItem value="DRIVER">Tài xế</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="dark:text-neutral-200">
            Tên hiển thị <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onClear={() => handleClear("name")}
            placeholder="Nhập tên hiển thị"
            className={`${
              errors.name ? "border-red-500" : "border-lightBorderV1"
            } focus:border-mainTextHoverV1`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="dark:text-neutral-200">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onClear={() => handleClear("email")}
            placeholder="Nhập email"
            className={`${
              errors.email ? "border-red-500" : "border-lightBorderV1"
            } focus:border-mainTextHoverV1`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="dark:text-neutral-200">
            Số điện thoại
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onClear={() => handleClear("phone")}
            placeholder="Nhập số điện thoại"
            className={`${
              errors.phone ? "border-red-500" : "border-lightBorderV1"
            } focus:border-mainTextHoverV1`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="dark:text-neutral-200">
            Mật khẩu mới (để trống nếu không thay đổi)
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            onClear={() => handleClear("password")}
            placeholder="Nhập mật khẩu mới"
            className={`${
              errors.password ? "border-red-500" : "border-lightBorderV1"
            } focus:border-mainTextHoverV1`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isUpdating}>
          Hủy
        </Button>
        <Button onClick={onSubmit} disabled={isUpdating}>
          {isUpdating ? (
            <>
              <IconLoader2 className="h-4 w-4 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            <>
              <IconCheck className="h-4 w-4" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
