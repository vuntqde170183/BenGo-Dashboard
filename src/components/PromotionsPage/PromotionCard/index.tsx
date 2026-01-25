import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash, IconCopy } from "@tabler/icons-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "react-toastify";

interface PromotionCardProps {
  promo: any;
  onEdit: (promo: any) => void;
  onDelete: (promo: any) => void;
}

export function PromotionCard({ promo, onEdit, onDelete }: PromotionCardProps) {
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(promo.code);
      toast.success(`Đã sao chép mã: ${promo.code}`);
    } catch (error) {
      toast.error("Không thể sao chép mã");
    }
  };

  const isUsageLimitReached =
    promo.usageLimit && promo.usedCount >= promo.usageLimit;

  return (
    <Card className="hover:shadow-lg transition-shadow border-darkBorderV1 bg-darkBackgroundV1/20 flex flex-col">
      <CardHeader className="border-b border-b-darkBorderV1 py-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg text-primary">
              {promo.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-neutral-400 font-mono">
                Mã: {promo.code}
              </p>
              <button
                onClick={handleCopyCode}
                className="text-neutral-400 hover:text-primary transition-colors p-1 rounded hover:bg-primary/10"
                title="Sao chép mã"
              >
                <IconCopy className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-end">
            {!promo.isActive ? (
              <Badge variant="destructive">Hết hạn sử dụng</Badge>
            ) : isUsageLimitReached ? (
              <Badge variant="neutral">Hết lượt dùng</Badge>
            ) : (
              <Badge variant="green">Đang hoạt động</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-4 flex-1 flex flex-col">
        {promo.imageUrl && (
          <img
            src={promo.imageUrl}
            alt={promo.title}
            className="w-full h-32 object-cover rounded-lg border border-darkBorderV1"
          />
        )}
        <p className="text-sm text-neutral-400 line-clamp-2">
          {promo.description}
        </p>

        <div className="space-y-2 text-sm flex-1">
          <div className="flex justify-between">
            <span className="text-neutral-400">Giảm giá:</span>
            <span className="font-medium text-white">
              {promo.discountType === "PERCENTAGE"
                ? `${promo.discountValue}%`
                : formatCurrency(promo.discountValue)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Đơn tối thiểu:</span>
            <span className="font-medium text-white">
              {formatCurrency(promo.minOrderValue || 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Lượt dùng:</span>
            <span className="font-medium text-white">
              {promo.usedCount || 0} / {promo.usageLimit || "∞"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Hạn sử dụng:</span>
            <span className="font-medium text-white">
              {formatDate(promo.endDate)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t border-t-darkBorderV1 pt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onEdit(promo)}
        >
          <IconEdit className="w-4 h-4" />
          Cập nhật khuyến mãi
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(promo)}
        >
          <IconTrash className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
