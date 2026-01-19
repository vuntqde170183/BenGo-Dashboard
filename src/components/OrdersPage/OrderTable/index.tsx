import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IOrder } from "@/interface/admin";
import { IconEye, IconX } from "@tabler/icons-react";
import { formatCurrency } from "@/lib/utils";

interface OrderTableProps {
  orders: IOrder[];
  isSearching: boolean;
  currentPage: number;
  pageSize: number;
  onViewDetails: (id: string) => void;
  onCancelOrder?: (id: string) => void;
}

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; variant: any }> = {
    PENDING: { label: "Chờ xử lý", variant: "warning" },
    ACCEPTED: { label: "Đã nhận", variant: "info" },
    PICKED_UP: { label: "Đã lấy hàng", variant: "default" },
    DELIVERED: { label: "Đã giao", variant: "success" },
    CANCELLED: { label: "Đã hủy", variant: "destructive" },
  };
  return statusMap[status] || { label: status, variant: "default" };
};

const getPaymentStatusBadge = (status: string) => {
  const statusMap: Record<string, { label: string; variant: any }> = {
    PENDING: { label: "Chờ thanh toán", variant: "warning" },
    PAID: { label: "Đã thanh toán", variant: "success" },
    FAILED: { label: "Thất bại", variant: "destructive" },
  };
  return statusMap[status] || { label: status, variant: "default" };
};

const getPaymentMethodLabel = (method: string) => {
  const methodMap: Record<string, string> = {
    CASH: "Tiền mặt",
    WALLET: "Ví điện tử",
    QR: "QR Code",
  };
  return methodMap[method] || method;
};

const getVehicleTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    BIKE: "Xe máy",
    VAN: "Xe tải nhỏ",
    TRUCK: "Xe tải",
  };
  return typeMap[type] || type;
};

export const OrderTable = ({
  orders,
  isSearching,
  currentPage,
  pageSize,
  onViewDetails,
  onCancelOrder,
}: OrderTableProps) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
        <p className="text-lg font-medium">
          {isSearching ? "Không tìm thấy đơn hàng nào" : "Chưa có đơn hàng"}
        </p>
        <p className="text-sm mt-2">
          {isSearching
            ? "Thử tìm kiếm với từ khóa khác"
            : "Đơn hàng sẽ xuất hiện ở đây khi có khách đặt"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">STT</TableHead>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Tài xế</TableHead>
            <TableHead>Điểm đón</TableHead>
            <TableHead>Điểm trả</TableHead>
            <TableHead>Loại xe</TableHead>
            <TableHead>Khoảng cách</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead>Thanh toán</TableHead>
            <TableHead>Trạng thái đơn</TableHead>
            <TableHead>Trạng thái TT</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => {
            const orderStatus = getStatusBadge(order.status);
            const paymentStatus = getPaymentStatusBadge(order.paymentStatus);
            const stt = (currentPage - 1) * pageSize + index + 1;

            return (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{stt}</TableCell>
                <TableCell className="font-mono text-xs">
                  {order._id.slice(-8).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {order.customerId?.name}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {order.customerId?.phone}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {order.driverId ? (
                    <div className="flex flex-col">
                      <span className="font-medium">{order.driverId.name}</span>
                      <span className="text-xs text-neutral-400">
                        {order.driverId.phone}
                      </span>
                    </div>
                  ) : (
                    <span className="text-neutral-400 text-sm">Chưa có</span>
                  )}
                </TableCell>
                <TableCell>
                  <div
                    className="max-w-[200px] truncate"
                    title={order.pickup.address}
                  >
                    {order.pickup.address}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className="max-w-[200px] truncate"
                    title={order.dropoff.address}
                  >
                    {order.dropoff.address}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getVehicleTypeLabel(order.vehicleType)}
                  </Badge>
                </TableCell>
                <TableCell>{order.distanceKm.toFixed(2)} km</TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(order.totalPrice)}
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {getPaymentMethodLabel(order.paymentMethod)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={orderStatus.variant}>
                    {orderStatus.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={paymentStatus.variant}>
                    {paymentStatus.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(order._id)}
                    >
                      <IconEye className="h-4 w-4" />
                    </Button>
                    {order.status !== "CANCELLED" &&
                      order.status !== "DELIVERED" &&
                      onCancelOrder && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancelOrder(order._id)}
                        >
                          <IconX className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
