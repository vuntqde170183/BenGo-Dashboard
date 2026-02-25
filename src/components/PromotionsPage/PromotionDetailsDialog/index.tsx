import { useUpdatePromotion } from "@/hooks/useAdmin";
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
import { useForm, Controller } from "react-hook-form";
import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { mdiGiftOpenOutline, mdiClose, mdiPencil } from "@mdi/js";
import Icon from "@mdi/react";

interface PromotionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  promotion: any;
  onSuccess: () => void;
}

const VEHICLE_TYPES = [
  { id: "BIKE", label: "Xe máy" },
  { id: "VAN", label: "Xe tải nhỏ (Van)" },
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

export function PromotionDetailsDialog({
  isOpen,
  onClose,
  promotion,
  onSuccess,
}: PromotionDetailsDialogProps) {
  const { mutate: updatePromotion, isPending } = useUpdatePromotion();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const discountType = watch(
    "discountType",
    promotion?.discountType || "PERCENTAGE",
  );

  useEffect(() => {
    if (promotion) {
      reset({
        code: promotion.code,
        title: promotion.title,
        description: promotion.description,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue?.toString() || "",
        minOrderValue: promotion.minOrderValue?.toString() || "",
        maxDiscountAmount: promotion.maxDiscountAmount?.toString() || "",
        startDate: promotion.startDate
          ? new Date(promotion.startDate).toISOString().slice(0, 16)
          : "",
        endDate: promotion.endDate
          ? new Date(promotion.endDate).toISOString().slice(0, 16)
          : "",
        usageLimit: promotion.usageLimit?.toString() || "",
        applicableVehicles: promotion.applicableVehicles || [],
      });
    }
  }, [promotion, reset]);

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

    updatePromotion(
      { id: promotion._id, data: promotionData },
      {
        onSuccess: () => {
          onSuccess();
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="medium">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Icon path={mdiGiftOpenOutline} size={0.8} />
            Chỉnh sửa khuyến mãi
          </DialogTitle>
        </DialogHeader>

        <form
          id="promotion-details-form"
          onSubmit={handleSubmit(onSubmit)}
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
                {...register("code", { required: "Vui lòng nhập mã" })}
                className="uppercase"
              />
              {errors.code && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.code.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Ví dụ: Giảm giá hè"
                {...register("title", { required: "Vui lòng nhập tiêu đề" })}
              />
              {errors.title && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.title.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
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
            <div className="space-y-2">
              <Label htmlFor="discountType">
                Loại giảm giá <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("discountType", value)}
                value={watch("discountType")}
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
                step={discountType === "PERCENTAGE" ? "1" : "1000"}
                max={discountType === "PERCENTAGE" ? "100" : undefined}
                placeholder={discountType === "PERCENTAGE" ? "10" : "50000"}
                {...register("discountValue", {
                  required: "Vui lòng nhập giá trị giảm giá",
                  min: { value: 0, message: "Phải là số dương" },
                })}
              />
              {errors.discountValue && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.discountValue.message as string}
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
                {...register("minOrderValue")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxDiscountAmount">Mức giảm tối đa (VNĐ)</Label>
              <Input
                id="maxDiscountAmount"
                type="number"
                step="1000"
                placeholder="Không bắt buộc"
                {...register("maxDiscountAmount")}
              />
              <p className="text-[10px] text-neutral-400 mt-1">
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
                {...register("startDate", {
                  required: "Vui lòng chọn ngày bắt đầu",
                })}
              />
              {errors.startDate && (
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.startDate.message as string}
                </p>
              )}
            </div>
            <div className="space-y-2">
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
                <p className="text-[10px] text-red-500 mt-1">
                  {errors.endDate.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Applicable Vehicles */}
          <div className="space-y-2">
            <Label className="mb-2 block">Loại xe áp dụng</Label>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border border-darkBorderV1 bg-darkBackgroundV1/30">
              {VEHICLE_TYPES.map((type) => (
                <div key={type.id} className="flex items-center space-x-2">
                  <Controller
                    name="applicableVehicles"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`vehicle-${type.id}`}
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
                    htmlFor={`vehicle-${type.id}`}
                    className="text-xs font-normal cursor-pointer text-neutral-300"
                  >
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Stats & Limit */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Lượt sử dụng hiện tại</Label>
              <p className="text-xs text-neutral-400 mt-1">
                Đã dùng:{" "}
                <span className="font-semibold text-primary">
                  {promotion?.usedCount || 0}
                </span>{" "}
                lượt
              </p>
            </div>
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
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            <Icon path={mdiClose} size={0.8} />
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="promotion-details-form"
            disabled={isPending}
          >
            <Icon path={mdiPencil} size={0.8} />
            {isPending ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

