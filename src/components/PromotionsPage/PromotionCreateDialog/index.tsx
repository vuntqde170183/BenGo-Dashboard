import { useCreatePromotion } from "@/hooks/useAdmin";
import { useUploadImage } from "@/hooks/useUpload";
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
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IconUpload } from "@tabler/icons-react";

interface PromotionCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function PromotionCreateDialog({
  isOpen,
  onClose,
  onSuccess,
}: PromotionCreateDialogProps) {
  const { mutate: createPromotion, isPending } = useCreatePromotion();
  const { mutate: uploadImage, isPending: isUploading } = useUploadImage();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const discountType = watch("discountType", "PERCENTAGE");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    const formData = new FormData();
    formData.append("image", file);

    uploadImage(formData, {
      onSuccess: (response: any) => {
        setImageUrl(response.data.url);
      },
    });
  };

  const onSubmit = (data: any) => {
    const promotionData = {
      ...data,
      imageUrl: imageUrl || undefined,
      discountValue: parseFloat(data.discountValue),
      minOrderValue: parseFloat(data.minOrderValue || 0),
      maxDiscountAmount: data.maxDiscountAmount
        ? parseFloat(data.maxDiscountAmount)
        : undefined,
      usageLimit: data.usageLimit ? parseInt(data.usageLimit) : undefined,
    };

    createPromotion(promotionData, {
      onSuccess: () => {
        reset();
        setImagePreview("");
        setImageUrl("");
        onSuccess();
        onClose();
      },
    });
  };

  const handleClose = () => {
    reset();
    setImagePreview("");
    setImageUrl("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent size="medium">
        <DialogHeader>
          <DialogTitle>Create New Promotion</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Code & Title */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="code">
                Promotion Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="code"
                placeholder="SUMMER2024"
                {...register("code", { required: "Code is required" })}
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
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Summer Sale"
                {...register("title", { required: "Title is required" })}
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your promotion..."
              {...register("description")}
              rows={3}
            />
          </div>

          {/* Discount Type & Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="discountType">
                Discount Type <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) => setValue("discountType", value)}
                defaultValue="PERCENTAGE"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount (VND)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discountValue">
                Discount Value <span className="text-red-500">*</span>
              </Label>
              <Input
                id="discountValue"
                type="number"
                step={discountType === "PERCENTAGE" ? "1" : "1000"}
                max={discountType === "PERCENTAGE" ? "100" : undefined}
                placeholder={discountType === "PERCENTAGE" ? "10" : "50000"}
                {...register("discountValue", {
                  required: "Discount value is required",
                  min: { value: 0, message: "Must be positive" },
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
              <Label htmlFor="minOrderValue">Minimum Order Value (VND)</Label>
              <Input
                id="minOrderValue"
                type="number"
                step="1000"
                placeholder="0"
                {...register("minOrderValue")}
              />
            </div>
            <div>
              <Label htmlFor="maxDiscountAmount">Max Discount Cap (VND)</Label>
              <Input
                id="maxDiscountAmount"
                type="number"
                step="1000"
                placeholder="Optional"
                {...register("maxDiscountAmount")}
              />
              <p className="text-sm text-neutral-200 mt-1">
                Leave empty for no limit
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                {...register("startDate", {
                  required: "Start date is required",
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
                End Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                {...register("endDate", { required: "End date is required" })}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.endDate.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Usage Limit */}
          <div>
            <Label htmlFor="usageLimit">Usage Limit (Total Uses)</Label>
            <Input
              id="usageLimit"
              type="number"
              placeholder="Leave empty for unlimited"
              {...register("usageLimit")}
            />
            <p className="text-sm text-neutral-200 mt-1">
              How many times this code can be used in total
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image">Promotion Image</Label>
            <div className="mt-2">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview("");
                      setImageUrl("");
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <label
                  htmlFor="image"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50"
                >
                  <IconUpload className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-neutral-200 mt-2">
                    Click to upload image
                  </p>
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending || isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isUploading}>
              {isPending ? "Creating..." : "Create Promotion"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
