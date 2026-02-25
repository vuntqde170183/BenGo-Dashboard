import { useCreatePromotion } from "@/hooks/useAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { mdiGiftOutline, mdiPlus, mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { usePromotionCreateForm } from "@/stores/usePromotionCreateForm";

interface PromotionCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const VEHICLE_TYPES = [
  { id: "BIKE", label: "Xe máy" },
  { id: "VAN", label: "Xe tải nhỏ" },
  { id: "TRUCK", label: "Xe tải" },
];

export function PromotionCreateDialog({
  isOpen,
  onClose,
  onSuccess,
}: PromotionCreateDialogProps) {
  const { mutate: createPromotion, isPending } = useCreatePromotion();
  const { formData, errors, updateFormData, setErrors, resetForm } =
    usePromotionCreateForm();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = "Vui lòng nhập mã";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề";
    }

    if (!formData.discountValue) {
      newErrors.discountValue = "Vui lòng nhập giá trị giảm giá";
    } else if (parseFloat(formData.discountValue) <= 0) {
      newErrors.discountValue = "Phải là số dương";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const promotionData = {
      ...formData,
      discountValue: parseFloat(formData.discountValue),
      minOrderValue: parseFloat(formData.minOrderValue || "0"),
      maxDiscountAmount: formData.maxDiscountAmount
        ? parseFloat(formData.maxDiscountAmount)
        : null,
      usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
    };

    createPromotion(promotionData, {
      onSuccess: () => {
        resetForm();
        onSuccess();
        onClose();
      },
    });
  };

  const handleClose = () => {
    // Don't reset form on close - data persists
    onClose();
  };

  const handleVehicleChange = (vehicleId: string, checked: boolean) => {
    const current = formData.applicableVehicles || [];
    const updated = checked
      ? [...current, vehicleId]
      : current.filter((v) => v !== vehicleId);
    updateFormData({ applicableVehicles: updated });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Icon path={mdiGiftOutline} size={0.8} />
            Tạo khuyến mãi mới
          </DialogTitle>
        </DialogHeader>

        <form
          id="promotion-create-form"
          onSubmit={onSubmit}
          className="space-y-3 md:space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar p-3 md:p-4"
        >
          {/* Code & Title */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Mã khuyến mãi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="KHUYENMAI2024"
                value={formData.code}
                onChange={(e) =>
                  updateFormData({ code: e.target.value.toUpperCase() })
                }
                className="uppercase"
              />
              {errors.code && (
                <p className="text-xs text-red-500 mt-1">{errors.code}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ví dụ: Giảm giá hè"
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
              />
              {errors.title && (
                <p className="text-xs text-red-500 mt-1">{errors.title}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Mô tả chi tiết về chương trình khuyến mãi..."
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              rows={3}
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">
                Loại giảm giá <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.discountType}
                onValueChange={(value) => updateFormData({ discountType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Phần trăm (%)</SelectItem>
                  <SelectItem value="FIXED_AMOUNT">
                    Số tiền cố định (VNĐ)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Giá trị giảm giá <span className="text-red-500">*</span>
              </Label>
              <Input
                id="discountValue"
                type="number"
                step={formData.discountType === "PERCENTAGE" ? "1" : "1000"}
                max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
                placeholder={
                  formData.discountType === "PERCENTAGE" ? "10" : "50000"
                }
                value={formData.discountValue}
                onChange={(e) =>
                  updateFormData({ discountValue: e.target.value })
                }
              />
              {errors.discountValue && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.discountValue}
                </p>
              )}
            </div>
          </div>

          {/* Min Order & Max Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minOrderValue">Giá trị đơn tối thiểu (VNĐ)</Label>
              <Input
                id="minOrderValue"
                type="number"
                step="1000"
                placeholder="0"
                value={formData.minOrderValue}
                onChange={(e) =>
                  updateFormData({ minOrderValue: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDiscountAmount">Mức giảm tối đa (VNĐ)</Label>
              <Input
                id="maxDiscountAmount"
                type="number"
                step="1000"
                placeholder="Không bắt buộc"
                value={formData.maxDiscountAmount}
                onChange={(e) =>
                  updateFormData({ maxDiscountAmount: e.target.value })
                }
              />
              <p className="text-xs text-neutral-400 mt-1">
                Để trống nếu không giới hạn
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => updateFormData({ startDate: e.target.value })}
              />
              {errors.startDate && (
                <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">
                Ngày kết thúc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => updateFormData({ endDate: e.target.value })}
              />
              {errors.endDate && (
                <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Applicable Vehicles */}
          <div className="space-y-2">
            <Label className="mb-2 block">Loại xe áp dụng</Label>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border border-darkBorderV1 bg-darkBackgroundV1/30">
              {VEHICLE_TYPES.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`create-vehicle-${type.id}`}
                    checked={formData.applicableVehicles?.includes(type.id)}
                    onCheckedChange={(checked) =>
                      handleVehicleChange(type.id, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`create-vehicle-${type.id}`}
                    className="text-xs font-normal cursor-pointer text-neutral-300"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Limit */}
          <div className="space-y-2">
            <Label htmlFor="usageLimit">Giới hạn lượt dùng (Tổng cộng)</Label>
            <Input
              id="usageLimit"
              type="number"
              placeholder="Để trống nếu không giới hạn"
              value={formData.usageLimit}
              onChange={(e) => updateFormData({ usageLimit: e.target.value })}
            />
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
          >
            <Icon path={mdiClose} size={0.8} />
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="promotion-create-form"
            disabled={isPending}
          >
            <Icon path={mdiPlus} size={0.8} />
            {isPending ? "Đang tạo..." : "Tạo khuyến mãi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

