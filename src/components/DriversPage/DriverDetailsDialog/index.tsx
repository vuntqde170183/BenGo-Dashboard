import { useEffect, useState } from "react";
import { useDriverDetails, useUpdateDriverStatus } from "@/hooks/useAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Star, Car as CarIcon } from "lucide-react";
import { getStatusVariant } from "@/lib/formatters";

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
  const { data: driverData, isLoading } = useDriverDetails(driverId);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateDriverStatus();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
  });

  const driver = driverData?.data;

  useEffect(() => {
    if (driver) {
      setFormData({
        status: driver.status || "",
      });
    }
  }, [driver]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatus(
      { id: driverId, status: formData.status },
      {
        onSuccess: () => {
          setIsEditing(false);
          onSuccess?.();
        },
      }
    );
  };

  const handleCancel = () => {
    if (driver) {
      setFormData({
        status: driver.status || "",
      });
    }
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết tài xế</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : driver ? (
          <div className="space-y-6">
            {/* Driver Info Section */}
            <div className="flex items-center gap-4 p-4 bg-darkCardV1 rounded-lg border border-darkBorderV1">
              <div className="w-16 h-16 flex-shrink-0 rounded-full bg-darkBorderV1 flex items-center justify-center overflow-hidden">
                <img
                  src={
                    driver.userId?.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.userId?.name}`
                  }
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold dark:text-neutral-200">
                  {driver.userId?.name}
                </h3>
                <p className="text-sm text-neutral-400">
                  {driver.userId?.email}
                </p>
                {driver.userId?.phone && (
                  <p className="text-sm text-neutral-400">
                    {driver.userId.phone}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">
                    {driver.userId?.rating
                      ? driver.userId.rating.toFixed(1)
                      : "5.0"}
                  </span>
                </div>
                <Badge variant={driver.isOnline ? "default" : "secondary"}>
                  {driver.isOnline ? "Trực tuyến" : "Ngoại tuyến"}
                </Badge>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-neutral-400">Biển số xe</Label>
                <div className="mt-1 p-2 bg-darkCardV1 rounded border border-darkBorderV1">
                  <p className="font-medium">{driver.plateNumber}</p>
                </div>
              </div>
              <div>
                <Label className="text-neutral-400">Loại xe</Label>
                <div className="mt-1 p-2 bg-darkCardV1 rounded border border-darkBorderV1 flex items-center gap-2">
                  <CarIcon className="w-4 h-4" />
                  <p className="font-medium">{driver.vehicleType}</p>
                </div>
              </div>
            </div>

            {/* Status Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="status">Trạng thái</Label>
                {isEditing ? (
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                      <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                      <SelectItem value="LOCKED">Đã khóa</SelectItem>
                      <SelectItem value="REJECTED">Từ chối</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="mt-1">
                    <Badge variant={getStatusVariant(driver.status)}>
                      {driver.status}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isUpdating}
                    >
                      Hủy
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button type="button" variant="outline" onClick={onClose}>
                      Đóng
                    </Button>
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      Chỉnh sửa
                    </Button>
                  </>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-8 text-neutral-400">
            Không tìm thấy thông tin tài xế
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
