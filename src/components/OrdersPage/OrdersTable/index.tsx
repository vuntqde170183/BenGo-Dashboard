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
import { MapPin, MoreVertical } from "lucide-react";
import { formatCurrency, formatDate, getStatusVariant } from "@/lib/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrdersTableProps {
  orders: any[];
  isSearching: boolean;
  onViewDetails: (id: string) => void;
  onCancel: (id: string) => void;
}

export function OrdersTable({
  orders,
  isSearching,
  onViewDetails,
  onCancel,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-200">
        {isSearching ? "Không tìm thấy đơn hàng nào" : "Chưa có đơn hàng"}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã đơn</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Tài xế</TableHead>
          <TableHead>Tuyến đường</TableHead>
          <TableHead>Loại xe</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Giá tiền</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell>
              <button
                onClick={() => onViewDetails(order._id)}
                className="text-blue-600 hover:underline font-mono"
              >
                #{order._id?.slice(-8)}
              </button>
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{order.customerId?.name || "N/A"}</p>
                <p className="text-sm text-neutral-200">
                  {order.customerId?.phone}
                </p>
              </div>
            </TableCell>
            <TableCell>
              {order.driverId ? (
                <div>
                  <p className="font-medium">{order.driverId?.name}</p>
                  <p className="text-sm text-neutral-200">
                    {order.driverId?.phone}
                  </p>
                </div>
              ) : (
                <span className="text-gray-400">Chưa có</span>
              )}
            </TableCell>
            <TableCell>
              <div className="text-sm max-w-xs">
                <p className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-green-600 flex-shrink-0" />
                  <span>{order.pickup?.address?.slice(0, 30)}...</span>
                </p>
                <p className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-red-600 flex-shrink-0" />
                  <span>{order.dropoff?.address?.slice(0, 30)}...</span>
                </p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">{order.vehicleType}</Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusVariant(order.status)}>
                {order.status}
              </Badge>
            </TableCell>
            <TableCell className="font-semibold">
              {formatCurrency(order.totalPrice || 0)}
            </TableCell>
            <TableCell className="text-sm text-neutral-200">
              {formatDate(order.createdAt)}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewDetails(order._id)}>
                    Xem chi tiết
                  </DropdownMenuItem>
                  {order.status !== "CANCELLED" &&
                    order.status !== "DELIVERED" && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onCancel(order._id)}
                        >
                          Hủy đơn
                        </DropdownMenuItem>
                      </>
                    )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
