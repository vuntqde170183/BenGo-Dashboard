import { useOrderDetails } from "@/hooks/useAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@tabler/icons-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOrderStatusBadge } from "@/lib/badge-helpers";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@mdi/react";
import { mdiLocationEnter, mdiLocationExit, mdiPackageVariant } from "@mdi/js";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { getVehicleIcon } from "@/lib/vehicle-helpers";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}
const getVehicleTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    BIKE: "Xe máy",
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

  const [routeGeometry, setRouteGeometry] = useState<string>("");
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!order?.pickup || !order?.dropoff || !isOpen) return;

      setIsRouteLoading(true);
      try {
        const apiKey = import.meta.env.VITE_PUBLIC_GEOAPIFY_API_KEY;
        const pickup = `${order.pickup.lat},${order.pickup.lng}`;
        const dropoff = `${order.dropoff.lat},${order.dropoff.lng}`;

        const response = await axios.get(
          `https://api.geoapify.com/v1/routing?waypoints=${pickup}|${dropoff}&mode=drive&apiKey=${apiKey}`,
        );

        if (response.data.features?.[0]?.geometry?.coordinates?.[0]) {
          // Geoapify trả về [lng, lat], ta cần chuyển sang string cho Static Map: lon,lat|lon,lat...
          const coords = response.data.features[0].geometry.coordinates[0];
          const pathString = coords
            .map((pair: number[]) => `${pair[0]},${pair[1]}`)
            .join(",");

          setRouteGeometry(pathString);
        }
      } catch (error) {
        console.error("Lỗi khi lấy lộ trình:", error);
      } finally {
        setIsRouteLoading(false);
      }
    };

    fetchRoute();
  }, [order?.pickup, order?.dropoff, isOpen]);

  const mapUrl = useMemo(() => {
    if (!order?.pickup || !order?.dropoff) return "";
    const apiKey = import.meta.env.VITE_PUBLIC_GEOAPIFY_API_KEY;
    const pickup = `${order.pickup.lng},${order.pickup.lat}`;
    const dropoff = `${order.dropoff.lng},${order.dropoff.lat}`;

    // Nếu có lộ trình thực (Route), dùng nó. Nếu không (hoặc đang load), dùng đường thẳng tạm thời
    const polyline = routeGeometry
      ? `polyline:${routeGeometry};linecolor:%233b82f6;linewidth:4;lineopacity:0.8`
      : `polyline:${pickup},${dropoff};linecolor:%233b82f6;linewidth:2;lineopacity:0.5`;

    return `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=800&height=400&marker=lonlat:${pickup};color:%234ade80;size:medium;text:A|lonlat:${dropoff};color:%23f87171;size:medium;text:B&geometry=${polyline}&apiKey=${apiKey}`;
  }, [order?.pickup, order?.dropoff, routeGeometry]);

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
          <DialogTitle className="flex items-center justify-between w-full text-primary">
            <div className="flex items-center gap-2">
              <Icon path={mdiPackageVariant} size={0.8} />
              <span>Chi tiết đơn hàng #{order?._id?.slice(-8)}</span>
            </div>
            {order && (
              <div className="flex gap-2">
                {getOrderStatusBadge(order.status)}
              </div>
            )}
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
            {/* Map & Route Section */}
            <Card className="overflow-hidden border-darkBorderV1 bg-darkBackgroundV1/30">
              <CardContent className="p-0 relative">
                <div className="h-80 w-full bg-darkBackgroundV1/50 relative overflow-hidden group">
                  {(isLoading || isRouteLoading) && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-darkCardV1/40 backdrop-blur-sm">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-primary font-medium">
                          Đang tính toán lộ trình...
                        </span>
                      </div>
                    </div>
                  )}
                  <img
                    src={mapUrl}
                    alt="Route Map"
                    className={`w-full h-full object-cover transition-all duration-700 ${isRouteLoading ? "opacity-50 blur-sm" : "opacity-90"} group-hover:opacity-100 group-hover:scale-[1.02]`}
                  />
                  {/* Google Maps Link Button */}
                  <button
                    onClick={openInGoogleMaps}
                    className="absolute bottom-4 right-4 bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded-full text-xs font-bold shadow-2xl transition-all flex items-center gap-2 group/btn active:scale-95"
                  >
                    <IconRoute
                      size={14}
                      className="group-hover/btn:animate-pulse"
                    />
                    <span>Xem lộ trình thực tế</span>
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
              {/* Stakeholders Info */}
              <div className="space-y-4">
                {/* Customer Info */}
                <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                  <CardHeader className="border-b border-b-darkBorderV1 py-3">
                    <div className="flex items-center gap-2">
                      <IconUserSquareRounded className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-primary uppercase tracking-tight">
                        Khách hàng
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 px-4 pb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-10 h-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-darkBackgroundV1">
                        <AvatarImage src={order.customerId?.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {order.customerId?.name?.[0]}
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

                {/* Driver Info */}
                <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                  <CardHeader className="border-b border-b-darkBorderV1 py-3">
                    <div className="flex items-center gap-2">
                      <IconTruck className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-primary uppercase tracking-tight">
                        Tài xế
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 px-4 pb-4">
                    {order.driverId ? (
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-darkBackgroundV1">
                          <AvatarImage src={order.driverId?.avatar} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {order.driverId?.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="font-bold text-lg text-white leading-none">
                            {order.driverId?.name}
                          </p>
                          <div className="flex items-center gap-1.5 text-neutral-400 pt-1 group">
                            <IconPhone
                              size={12}
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

              {/* Order Summary & Goods */}
              <div className="space-y-4">
                <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                  <CardHeader className="border-b border-b-darkBorderV1 py-3">
                    <div className="flex items-center gap-2">
                      <IconClipboardList className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-primary uppercase tracking-tight">
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

                {/* Goods Images */}
                {order.goodsImages && order.goodsImages.length > 0 && (
                  <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                    <CardHeader className="border-b border-b-darkBorderV1 py-3">
                      <div className="flex items-center gap-2">
                        <IconPhoto className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-primary uppercase tracking-tight">
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

            {/* Notes */}
            {order.note && (
              <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                <CardHeader className="border-b border-b-darkBorderV1 py-3">
                  <div className="flex items-center gap-2">
                    <IconMessage className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-primary uppercase tracking-tight">
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
    </Dialog>
  );
}
