import { useOrderDetails, useUpdateOrderStatus } from "@/hooks/useAdmin";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  IconPackage,
  IconCurrencyDollar,
  IconUserSquareRounded,
  IconTruck,
  IconRoute,
  IconClipboardList,
  IconPhoto,
  IconMessage,
  IconPhone,
  IconMail,
  IconClock,
  IconBox,
  IconCar,
  IconCircleCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOrderStatusBadge } from "@/lib/badge-helpers";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@mdi/react";
import {
  mdiLocationEnter,
  mdiLocationExit,
  mdiPackageVariant,
  mdiCreditCardCheck,
  mdiCreditCardOff,
} from "@mdi/js";
import { useEffect, useState } from "react";
import { getVehicleIcon } from "@/lib/vehicle-helpers";
import { cn } from "@/lib/utils";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

const ORDER_STATUS_STEPS = [
  {
    key: "PENDING",
    label: "Chờ duyệt",
    icon: IconClock,
    color: "bg-yellow-500",
    text: "text-yellow-500",
  },
  {
    key: "ACCEPTED",
    label: "Đã nhận",
    icon: IconBox,
    color: "bg-blue-500",
    text: "text-blue-500",
  },
  {
    key: "PICKED_UP",
    label: "Đang giao",
    icon: IconCar,
    color: "bg-purple-500",
    text: "text-purple-500",
  },
  {
    key: "DELIVERED",
    label: "Hoàn tất",
    icon: IconCircleCheck,
    color: "bg-green-500",
    text: "text-green-500",
  },
];

const getVehicleTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    MOTORCYCLE: "Xe máy",
    VAN: "Xe tải nhỏ",
    TRUCK: "Xe tải",
  };
  return typeMap[type] || type;
};

export function OrderDetailsDialog({
  isOpen,
  onClose,
  orderId,
}: OrderDetailsDialogProps) {
  const { data: orderResponse, isLoading } = useOrderDetails(orderId);
  const order = orderResponse?.data;
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus();

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive" | "warning";
  }>({
    isOpen: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const handleStatusUpdate = (status: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận cập nhật trạng thái",
      description: `Bạn có chắc chắn muốn thay đổi trạng thái đơn hàng sang "${
        ORDER_STATUS_STEPS.find((s) => s.key === status)?.label ||
        (status === "CANCELLED" ? "Hủy đơn" : status)
      }"?`,
      variant: status === "CANCELLED" ? "destructive" : "warning",
      onConfirm: () => {
        updateStatus({ id: orderId, data: { status } });
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handlePaymentUpdate = (paymentStatus: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xác nhận cập nhật thanh toán",
      description: `Bạn có chắc chắn muốn đánh dấu đơn hàng này là ${
        paymentStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"
      }?`,
      variant: "warning",
      onConfirm: () => {
        updateStatus({ id: orderId, data: { paymentStatus } });
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const openInGoogleMaps = () => {
    if (!order?.pickup || !order?.dropoff) return;
    const origin = `${order.pickup.lat},${order.pickup.lng}`;
    const destination = `${order.dropoff.lat},${order.dropoff.lng}`;
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`,
      "_blank",
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        size="medium"
        className="bg-darkCardV1 border-darkBorderV1 max-h-[95vh]"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-start w-full text-primary">
            <div className="flex items-center gap-2">
              <Icon path={mdiPackageVariant} size={0.8} />
              <span>Chi tiết đơn hàng #{order?._id?.slice(-8)}</span>
            </div>
            {order && getOrderStatusBadge(order.status)}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-[300px] w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          </div>
        ) : !order ? (
          <div className="text-center py-20 text-neutral-400 flex flex-col items-center gap-3">
            <IconPackage className="w-12 h-12 opacity-20" />
            <p>Không tìm thấy thông tin chi tiết đơn hàng</p>
          </div>
        ) : (
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar pb-6">
            {/* Status Progress Bar */}
            <div className="px-4 py-8">
              {order.status === "CANCELLED" ? (
                <div className="flex flex-col items-center justify-center py-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                  <IconAlertCircle className="w-10 h-10 text-red-500 mb-2" />
                  <p className="text-red-500 font-bold">ĐƠN HÀNG ĐÃ HỦY</p>
                  <p className="text-xs text-red-400/80 mt-1">
                    Lý do: {order.cancelReason || "Không có lý do"}
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute top-5 left-0 w-full h-1 bg-darkBorderV1 -translate-y-1/2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-1000 ease-out"
                      style={{
                        width: `${(ORDER_STATUS_STEPS.findIndex((s) => s.key === order.status) / (ORDER_STATUS_STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="relative flex justify-between">
                    {ORDER_STATUS_STEPS.map((step, index) => {
                      const isActive =
                        ORDER_STATUS_STEPS.findIndex(
                          (s) => s.key === order.status,
                        ) >= index;
                      const isCurrent = order.status === step.key;
                      const StepIcon = step.icon;

                      return (
                        <div
                          key={step.key}
                          className="flex flex-col items-center group"
                        >
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 shadow-lg",
                              isActive
                                ? "bg-primary text-white scale-110"
                                : "bg-darkBackgroundV1 text-neutral-400 border-2 border-darkBorderV1",
                              isCurrent && "ring-4 ring-primary/30",
                            )}
                          >
                            <StepIcon size={20} />
                          </div>
                          <span
                            className={cn(
                              "text-[10px] md:text-xs font-bold mt-2 uppercase tracking-tight transition-colors duration-300",
                              isActive ? "text-primary" : "text-neutral-400",
                            )}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions / Status Updates */}
            <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-darkBackgroundV1/40 border border-darkBorderV1">
              <div className="flex-1 space-y-2">
                <p className="text-xs font-bold text-white uppercase">
                  Cập nhật trạng thái
                </p>
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={order.status}
                    onValueChange={handleStatusUpdate}
                    disabled={isUpdating || order.status === "CANCELLED"}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                      <SelectItem value="ACCEPTED">Đã nhận</SelectItem>
                      <SelectItem value="PICKED_UP">Đang giao</SelectItem>
                      <SelectItem value="DELIVERED">Hoàn tất</SelectItem>
                      <SelectItem value="CANCELLED">Hủy đơn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="w-px bg-darkBorderV1 hidden md:block" />

              <div className="flex-1 space-y-2">
                <p className="text-xs font-bold text-white uppercase">
                  Thanh toán
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant={
                      order.paymentStatus === "PAID" ? "default" : "outline"
                    }
                    className={cn(
                      order.paymentStatus === "PAID" &&
                        "bg-green-500 hover:bg-green-600 text-white border-none",
                    )}
                    disabled={isUpdating || order.paymentStatus === "PAID"}
                    onClick={() => handlePaymentUpdate("PAID")}
                  >
                    <Icon path={mdiCreditCardCheck} size={0.8} />
                    Đã thanh toán
                  </Button>
                  <Button
                    variant={
                      order.paymentStatus === "UNPAID" ? "default" : "outline"
                    }
                    className={cn(
                      order.paymentStatus === "UNPAID" &&
                        "bg-red-500 hover:bg-red-600 text-white border-none",
                    )}
                    disabled={isUpdating || order.paymentStatus === "UNPAID"}
                    onClick={() => handlePaymentUpdate("UNPAID")}
                  >
                    <Icon path={mdiCreditCardOff} size={0.8} />
                    Chưa thanh toán
                  </Button>
                </div>
              </div>
            </div>

            {/* Interactive Google Map Section */}
            <Card className="overflow-hidden border-darkBorderV1 bg-darkBackgroundV1/30">
              <CardContent className="p-0 relative">
                <div className="h-80 w-full bg-darkBackgroundV1/50 relative">
                  {isLoading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-darkCardV1/40 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-primary font-medium">
                          Đang tải bản đồ...
                        </span>
                      </div>
                    </div>
                  )}
                  {order?.pickup && order?.dropoff && (
                    <iframe
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&origin=${order.pickup.lat},${order.pickup.lng}&destination=${order.dropoff.lat},${order.dropoff.lng}&mode=driving&maptype=roadmap`}
                      className="opacity-95 hover:opacity-100 transition-opacity"
                    ></iframe>
                  )}
                  <button
                    onClick={openInGoogleMaps}
                    className="absolute bottom-4 right-4 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-full text-xs font-bold shadow-2xl transition-all flex items-center gap-2 group/btn active:scale-95 z-20"
                  >
                    <IconRoute size={14} />
                    <span>Xem trên Google Maps</span>
                  </button>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-darkCardV1/40">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-green-500/10 text-green-500 mt-1 shadow-inner">
                      <Icon path={mdiLocationExit} size={0.8} />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold text-white tracking-wider mb-1">
                        Địa chỉ đón (A)
                      </p>
                      <p className="font-semibold text-sm text-neutral-400 leading-relaxed">
                        {order.pickup?.address}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 font-mono">
                        {order.pickup?.lat?.toFixed(6)},{" "}
                        {order.pickup?.lng?.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-red-500/10 text-red-500 mt-1 shadow-inner">
                      <Icon path={mdiLocationEnter} size={0.8} />
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold text-white tracking-wider mb-1">
                        Địa chỉ trả (B)
                      </p>
                      <p className="font-semibold text-sm text-neutral-400 leading-relaxed">
                        {order.dropoff?.address}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 font-mono">
                        {order.dropoff?.lat?.toFixed(6)},{" "}
                        {order.dropoff?.lng?.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                  <CardHeader className="border-b border-b-darkBorderV1 py-3">
                    <div className="flex items-center gap-2">
                      <IconUserSquareRounded className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-primary">
                        Khách hàng
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 px-4 pb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-darkBackgroundV1">
                        <AvatarImage
                          src={
                            order.customerId?.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customerId?.name}`
                          }
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.customerId?.name}`}
                            alt={order.customerId?.name}
                            className="w-full h-full"
                          />
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <p className="font-bold text-lg text-white leading-none">
                          {order.customerId?.name}
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                          <div className="flex items-center gap-1.5 text-neutral-400 group">
                            <IconPhone
                              size={16}
                              className="group-hover:text-primary transition-colors"
                            />
                            <span className="text-xs">
                              {order.customerId?.phone}
                            </span>
                          </div>
                          {order.customerId?.email && (
                            <div className="flex items-center gap-1.5 text-neutral-400 group">
                              <IconMail
                                size={16}
                                className="group-hover:text-primary transition-colors"
                              />
                              <span className="text-xs truncate max-w-[200px]">
                                {order.customerId.email}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                  <CardHeader className="border-b border-b-darkBorderV1 py-3">
                    <div className="flex items-center gap-2">
                      <IconTruck className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-primary">Tài xế</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 px-4 pb-4">
                    {order.driverId ? (
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-darkBackgroundV1">
                          <AvatarImage
                            src={
                              order.driverId?.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.driverId?.name}`
                            }
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${order.driverId?.name}`}
                              alt={order.driverId?.name}
                              className="w-full h-full"
                            />
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="font-bold text-lg text-white leading-none">
                            {order.driverId?.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-neutral-400 pt-1 group">
                            <IconPhone
                              size={16}
                              className="group-hover:text-primary transition-colors"
                            />
                            <span className="text-xs">
                              {order.driverId?.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4 text-center">
                        <div className="w-10 h-10 rounded-full bg-neutral-500/5 flex items-center justify-center mb-2">
                          <IconTruck className="h-5 w-5 text-neutral-400" />
                        </div>
                        <p className="text-sm text-neutral-400">
                          Chưa có tài xế nhận đơn
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                  <CardHeader className="border-b border-b-darkBorderV1 py-3">
                    <div className="flex items-center gap-2">
                      <IconClipboardList className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-primary">
                        Tóm tắt đơn hàng
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <p className="text-xs text-white uppercase font-bold tracking-wider">
                          Loại xe
                        </p>
                        <div className="flex items-center gap-1 text-neutral-400">
                          {getVehicleIcon(order.vehicleType)}
                          <span>{getVehicleTypeLabel(order.vehicleType)}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-white uppercase font-bold tracking-wider">
                          Khoảng cách
                        </p>
                        <p className="text-sm font-medium text-neutral-400">
                          {order.distanceKm?.toFixed(2)} km
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-white uppercase font-bold tracking-wider">
                          Thanh toán
                        </p>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-neutral-400">
                              Phương thức:
                            </span>
                            {getOrderStatusBadge(order.paymentMethod)}
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-neutral-400">
                              Trạng thái:
                            </span>
                            {getOrderStatusBadge(order.paymentStatus)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-white uppercase font-bold tracking-wider">
                          Ngày tạo
                        </p>
                        <p className="text-sm font-medium text-neutral-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-darkBorderV1" />

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          <IconCurrencyDollar size={18} />
                        </div>
                        <span className="font-bold text-neutral-400">
                          Tổng cộng
                        </span>
                      </div>
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {order.goodsImages && order.goodsImages.length > 0 && (
                  <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                    <CardHeader className="border-b border-b-darkBorderV1 py-3">
                      <div className="flex items-center gap-2">
                        <IconPhoto className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-primary">
                          Hình ảnh hàng hóa
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-2">
                        {order.goodsImages.map((img: string, idx: number) => (
                          <div
                            key={idx}
                            className="aspect-square rounded-lg overflow-hidden border border-darkBorderV1 bg-black group relative cursor-zoom-in"
                          >
                            <img
                              src={img}
                              alt={`Goods ${idx + 1}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-xs text-white font-bold bg-darkCardV1/80 px-2 py-1 rounded">
                                Xem
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {order.note && (
              <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                <CardHeader className="border-b border-b-darkBorderV1 py-3">
                  <div className="flex items-center gap-2">
                    <IconMessage className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-primary">
                      Ghi chú từ khách hàng
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="bg-darkBackgroundV1 px-4 py-3 rounded-lg border border-darkBorderV1/50 italic text-neutral-400 text-sm">
                    "{order.note}"
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        variant={confirmConfig.variant}
        isPending={isUpdating}
      />
    </Dialog>
  );
}
