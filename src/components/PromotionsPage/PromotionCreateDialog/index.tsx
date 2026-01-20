import { useCreatePromotion } from "@/hooks/useAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { useForm, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { mdiGiftOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { IconPlus, IconX } from "@tabler/icons-react";

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

interface FormValues {
  code: string;
  title: string;
  description: string;
  discountType: string;
  discountValue: string;
  minOrderValue: string;
  maxDiscountAmount: string;
  startDate: string;
  endDate: string;
  applicableVehicles: string[];
  usageLimit: string;
}

export function PromotionCreateDialog({
  isOpen,
  onClose,
  onSuccess,
}: PromotionCreateDialogProps) {
  const { mutate: createPromotion, isPending } = useCreatePromotion();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      code: "",
      title: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      minOrderValue: "",
      maxDiscountAmount: "",
      startDate: "",
      endDate: "",
      applicableVehicles: ["BIKE", "VAN", "TRUCK"],
      usageLimit: "",
    },
  });

  const discountType = watch("discountType");

  const onSubmit = (data: any) => {
    const promotionData = {
      ...data,
      discountValue: parseFloat(data.discountValue),
      minOrderValue: parseFloat(data.minOrderValue || 0),
      maxDiscountAmount: data.maxDiscountAmount
        ? parseFloat(data.maxDiscountAmount)
        : null,
      usageLimit: data.usageLimit ? parseInt(data.usageLimit) : undefined,
    };

    createPromotion(promotionData, {
      onSuccess: () => {
        reset();
        onSuccess();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Icon path={mdiGiftOutline} size={0.8} />
            Tạo khuyến mãi mới
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          {/* Code & Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">
                Mã khuyến mãi <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="KHUYENMAI2024"
                {...register("code", { required: "Vui lòng nhập mã" })}
                className="uppercase"
              />
              {errors.code && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.code.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="title">
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ví dụ: Giảm giá hè"
                {...register("title", { required: "Vui lòng nhập tiêu đề" })}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.title.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              placeholder="Mô tả chi tiết về chương trình khuyến mãi..."
              {...register("description")}
              rows={3}
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discountType">
                Loại giảm giá <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("discountType", value)}
                defaultValue="PERCENTAGE"
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
            <div>
              <Label htmlFor="discountValue">
                Giá trị giảm giá <span className="text-red-500">*</span>
              </Label>
              <Input
                id="discountValue"
                type="number"
                step={discountType === "PERCENTAGE" ? "1" : "1000"}
                max={discountType === "PERCENTAGE" ? "100" : undefined}
                placeholder={discountType === "PERCENTAGE" ? "10" : "50000"}
                {...register("discountValue", {
                  required: "Vui lòng nhập giá trị giảm giá",
                  min: { value: 0, message: "Phải là số dương" },
                })}
              />
              {errors.discountValue && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.discountValue.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Min Order & Max Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minOrderValue">Giá trị đơn tối thiểu (VNĐ)</Label>
              <Input
                id="minOrderValue"
                type="number"
                step="1000"
                placeholder="0"
                {...register("minOrderValue")}
              />
            </div>
            <div>
              <Label htmlFor="maxDiscountAmount">Mức giảm tối đa (VNĐ)</Label>
              <Input
                id="maxDiscountAmount"
                type="number"
                step="1000"
                placeholder="Không bắt buộc"
                {...register("maxDiscountAmount")}
              />
              <p className="text-sm text-neutral-400 mt-1">
                Để trống nếu không giới hạn
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">
                Ngày bắt đầu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                {...register("startDate", {
                  required: "Vui lòng chọn ngày bắt đầu",
                })}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.startDate.message as string}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="endDate">
                Ngày kết thúc <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                {...register("endDate", {
                  required: "Vui lòng chọn ngày kết thúc",
                })}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.endDate.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Applicable Vehicles */}
          <div>
            <Label className="mb-2 block">Loại xe áp dụng</Label>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border border-darkBorderV1 bg-darkBackgroundV1/30">
              {VEHICLE_TYPES.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Controller
                    name="applicableVehicles"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`create-vehicle-${type.id}`}
                        checked={field.value?.includes(type.id)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          const updated = checked
                            ? [...current, type.id]
                            : current.filter((v: string) => v !== type.id);
                          field.onChange(updated);
                        }}
                      />
                    )}
                  />
                  <Label
                    htmlFor={`create-vehicle-${type.id}`}
                    className="text-sm font-normal cursor-pointer text-neutral-200"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Limit */}
          <div>
            <div className="space-y-2">
              <Label htmlFor="usageLimit">Giới hạn lượt dùng (Tổng cộng)</Label>
              <Input
                id="usageLimit"
                type="number"
                placeholder="Để trống nếu không giới hạn"
                {...register("usageLimit")}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-darkBorderV1">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              <IconX className="w-4 h-4" />
              Đóng
            </Button>
            <Button type="submit" disabled={isPending}>
              <IconPlus className="w-4 h-4" />
              {isPending ? "Đang tạo..." : "Tạo khuyến mãi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
