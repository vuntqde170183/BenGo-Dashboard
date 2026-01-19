import { useOrderDetails } from "@/hooks/useAdmin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  DollarSign,
  Calendar,
  Map,
  User,
  Truck,
  Navigation,
  ClipboardList,
  Image as ImageIcon,
  MessageSquare,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { getOrderStatusBadge } from "@/lib/badge-helpers";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@mdi/react";
import { mdiLocationEnter, mdiLocationExit, mdiPackageVariant } from "@mdi/js";

interface OrderDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export function OrderDetailsDialog({
  isOpen,
  onClose,
  orderId,
}: OrderDetailsDialogProps) {
  const { data: orderResponse, isLoading } = useOrderDetails(orderId);
  const order = orderResponse?.data;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent size="medium">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon path={mdiPackageVariant} size={0.8} />
            <span>Đơn hàng #{order?._id?.slice(-8)}</span>
            <div className="ml-auto">
              {order && getOrderStatusBadge(order.status)}
            </div>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : !order ? (
          <div className="text-center py-8 text-neutral-200">
            Không tìm thấy đơn hàng
          </div>
        ) : (
          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {/* Map Placeholder */}
            <Card>
              <CardHeader className="border-b border-b-darkBorderV1 py-3">
                <div className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-blue-500" />
                  <span className="font-semibold dark:text-neutral-200">
                    Sơ đồ tuyến đường
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-neutral-200">Bản đồ đang được tích hợp</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Customer Info */}
              <Card>
                <CardHeader className="border-b border-b-darkBorderV1 py-3">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-green-500" />
                    <span className="font-semibold dark:text-neutral-200">
                      Khách hàng
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={order.customerId?.avatar} />
                      <AvatarFallback>
                        {order.customerId?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{order.customerId?.name}</p>
                      <p className="text-sm text-neutral-200">
                        {order.customerId?.phone}
                      </p>
                      {order.customerId?.email && (
                        <p className="text-xs text-neutral-400">
                          {order.customerId.email}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Driver Info */}
              <Card>
                <CardHeader className="border-b border-b-darkBorderV1 py-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold dark:text-neutral-200">
                      Tài xế
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  {order.driverId ? (
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={order.driverId?.avatar} />
                        <AvatarFallback>
                          {order.driverId?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{order.driverId?.name}</p>
                        <p className="text-sm text-neutral-200">
                          {order.driverId?.phone}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-200">Chưa có tài xế nhận đơn</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Route Details */}
            <Card>
              <CardHeader className="border-b border-b-darkBorderV1 py-3">
                <div className="flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-purple-500" />
                  <span className="font-semibold dark:text-neutral-200">
                    Chi tiết tuyến đường
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <Icon
                    path={mdiLocationExit}
                    size={0.8}
                    className="text-green-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium">Điểm đón khách</p>
                    <p className="text-sm text-gray-600">
                      {order.pickup?.address?.replace(
                        "Pickup Address",
                        "Địa chỉ đón",
                      )}
                    </p>
                    <p className="text-sm text-neutral-200 mt-1">
                      {order.pickup?.lat}, {order.pickup?.lng}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Icon
                    path={mdiLocationEnter}
                    size={0.8}
                    className="text-red-500 mt-1 flex-shrink-0"
                  />
                  <div>
                    <p className="font-medium">Điểm trả khách</p>
                    <p className="text-sm text-gray-600">
                      {order.dropoff?.address?.replace(
                        "Dropoff Address",
                        "Địa chỉ trả",
                      )}
                    </p>
                    <p className="text-sm text-neutral-200 mt-1">
                      {order.dropoff?.lat}, {order.dropoff?.lng}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader className="border-b border-b-darkBorderV1 py-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-mainActiveV1" />
                  <span className="font-semibold dark:text-neutral-200">
                    Tóm tắt đơn hàng
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <span>Loại xe:</span>
                  </div>
                  <Badge variant="outline">{order.vehicleType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Khoảng cách:</span>
                  <span className="font-medium">
                    {order.distanceKm?.toFixed(2)} km
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  {getOrderStatusBadge(order.paymentMethod)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Trạng thái thanh toán:</span>
                  {getOrderStatusBadge(order.paymentStatus)}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Ngày tạo:</span>
                  </div>
                  <span className="font-medium">
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-lg font-bold">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Tổng cộng:</span>
                  </div>
                  <span>{formatCurrency(order.totalPrice)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Goods Images */}
            {order.goodsImages && order.goodsImages.length > 0 && (
              <Card>
                <CardHeader className="border-b border-b-darkBorderV1 py-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-indigo-500" />
                    <span className="font-semibold dark:text-neutral-200">
                      Hình ảnh hàng hóa
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {order.goodsImages.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Goods ${idx + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            {order.note && (
              <Card>
                <CardHeader className="border-b border-b-darkBorderV1 py-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold dark:text-neutral-200">
                      Ghi chú
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600">{order.note}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
