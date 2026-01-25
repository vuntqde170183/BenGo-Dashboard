import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { formatCurrency, formatDate } from "@/lib/format";
import { getVehicleIcon } from "@/lib/vehicle-helpers";
import { getOrderStatusBadge } from "@/lib/badge-helpers";
import Icon from "@mdi/react";
import {
  mdiLocationEnter,
  mdiLocationExit,
  mdiTableEye,
  mdiCloseCircleOutline,
} from "@mdi/js";

interface OrdersTableProps {
  orders: any[];
  isSearching: boolean;
  onViewDetails: (id: string) => void;
  onCancel: (id: string) => void;
  currentPage: number;
  pageSize: number;
}

export function OrdersTable({
  orders,
  isSearching,
  onViewDetails,
  onCancel,
  currentPage,
  pageSize,
}: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-200">
        {isSearching ? "Không tìm thấy đơn hàng nào" : "Chưa có đơn hàng"}
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto border border-darkBackgroundV1 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">STT</TableHead>
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
          {orders.map((order, index) => (
            <TableRow
              key={order._id}
              className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-darkBorderV1/50 transition-colors"
              onClick={() => onViewDetails(order._id)}
            >
              <TableCell className="font-medium">
                {(currentPage - 1) * pageSize + index + 1}
              </TableCell>
              <TableCell>
                <button
                  onClick={() => onViewDetails(order._id)}
                  className="text-primary hover:underline font-mono"
                >
                  #{order._id?.slice(-8)}
                </button>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">
                    {order.customerId?.name || "N/A"}
                  </p>
                  <p className="text-sm text-neutral-400">
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
                  <span className="text-neutral-400">Chưa có</span>
                )}
              </TableCell>
              <TableCell>
                <div className="text-sm max-w-xs space-y-1">
                  <p
                    className="flex items-center gap-1 truncate"
                    title="Điểm đón khách"
                  >
                    <Icon
                      path={mdiLocationExit}
                      size={0.8}
                      className="text-green-500 flex-shrink-0"
                    />
                    <span className="text-neutral-200 font-medium">Đón:</span>
                    <span>
                      {order.pickup?.address
                        ?.replace("Pickup Address", "Địa chỉ đón")
                        ?.slice(0, 30)}
                      ...
                    </span>
                  </p>
                  <p
                    className="flex items-center gap-1 truncate"
                    title="Điểm trả khách"
                  >
                    <Icon
                      path={mdiLocationEnter}
                      size={0.8}
                      className="text-red-500 flex-shrink-0"
                    />
                    <span className="text-neutral-200 font-medium">Trả:</span>
                    <span>
                      {order.dropoff?.address
                        ?.replace("Dropoff Address", "Địa chỉ trả")
                        ?.slice(0, 30)}
                      ...
                    </span>
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getVehicleIcon(order.vehicleType)}
                  <span>{order.vehicleType}</span>
                </div>
              </TableCell>
              <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
              <TableCell className="font-semibold">
                {formatCurrency(order.totalPrice || 0)}
              </TableCell>
              <TableCell className="text-sm text-neutral-200">
                {formatDate(order.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(order._id);
                      }}
                      title="Chi tiết"
                    >
                      <Icon path={mdiTableEye} size={0.8} />
                    </Button>
                  </motion.div>

                  {order.status !== "CANCELLED" &&
                    order.status !== "DELIVERED" && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className="bg-red-500 hover:bg-red-600 border-none"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancel(order._id);
                          }}
                          title="Hủy đơn"
                        >
                          <Icon path={mdiCloseCircleOutline} size={0.8} />
                        </Button>
                      </motion.div>
                    )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
