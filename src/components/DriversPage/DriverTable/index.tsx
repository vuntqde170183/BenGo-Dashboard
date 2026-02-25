import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { IconStar } from "@tabler/icons-react";
import { getStatusBadge } from "@/lib/badge-helpers";
import { getVehicleIcon } from "@/lib/vehicle-helpers";
import Icon from "@mdi/react";
import {
  mdiTableEye,
  mdiTrashCanOutline,
  mdiLockOutline,
  mdiCheckCircleOutline,
  mdiCloseCircleOutline,
  mdiLockOpenVariantOutline,
  mdiInboxRemoveOutline,
} from "@mdi/js";

interface IDriver {
  _id: string;
  userId: {
    id?: string;
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    rating?: number;
    avatar?: string;
  };
  plateNumber: string;
  vehicleType: string;
  status: string;
  isOnline: boolean;
  adminNote?: string;
  rejectionReason?: string;
}

interface DriverTableProps {
  drivers: IDriver[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onLock?: (id: string) => void;
  onUnlock?: (id: string) => void;
  role?: string;
  currentPage?: number;
  pageSize?: number;
}

export const DriverTable = ({
  drivers,
  isSearching,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onLock,
  onUnlock,
  role,
  currentPage = 1,
  pageSize = 10,
}: DriverTableProps) => {
  if (drivers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-neutral-400 italic gap-3">
        <Icon path={mdiInboxRemoveOutline} size={1.6} className="opacity-60" />
        <p>{isSearching ? "Không tìm thấy tài xế" : "Danh sách tài xế trống"}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto border border-darkBackgroundV1 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">STT</TableHead>
            <TableHead>Thông tin tài xế</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Biển số xe</TableHead>
            <TableHead>Loại xe</TableHead>
            <TableHead>Đánh giá</TableHead>
            <TableHead>Trực tuyến</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver, index) => {
            const rowNumber = (currentPage - 1) * pageSize + index + 1;
            const driverId = driver._id;
            return (
              <TableRow
                key={driverId}
                className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-darkBorderV1/50 transition-colors"
                onClick={() => onEdit(driverId)}
              >
                <TableCell>{rowNumber}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-darkBorderV1 flex items-center justify-center overflow-hidden">
                      <img
                        src={
                          driver.userId?.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.userId?.name}`
                        }
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold dark:text-neutral-300 text-nowrap">
                        {driver.userId?.name}
                      </p>
                      {driver.userId?.phone && (
                        <p className="text-sm text-neutral-400">
                          {driver.userId.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="w-[180px]">
                  {driver.userId?.email}
                </TableCell>
                <TableCell>
                  <span className="font-medium">{driver.plateNumber}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getVehicleIcon(driver.vehicleType)}
                    <span>{driver.vehicleType}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 dark:text-neutral-300 font-medium">
                    <IconStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {driver.userId?.rating
                      ? driver.userId.rating.toFixed(1)
                      : "5.0"}
                  </div>
                </TableCell>
                <TableCell>
                  {driver.isOnline ? (
                    <Badge variant="emerald" className="capitalize">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Trực tuyến
                    </Badge>
                  ) : (
                    <Badge variant="neutral" className="capitalize">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                      Ngoại tuyến
                    </Badge>
                  )}
                </TableCell>
                <TableCell>{getStatusBadge(driver.status)}</TableCell>
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
                          onEdit(driverId);
                        }}
                        title="Chi tiết"
                      >
                        <Icon path={mdiTableEye} size={0.8} />
                      </Button>
                    </motion.div>

                    {/* APPROVED: Show Lock */}
                    {driver.status === "APPROVED" && role !== "DISPATCHER" && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className="bg-orange-500 hover:bg-orange-600"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLock && onLock(driverId);
                          }}
                          title="Khóa tài khoản"
                        >
                          <Icon path={mdiLockOutline} size={0.8} />
                        </Button>
                      </motion.div>
                    )}

                    {/* PENDING: Show Approve and Reject */}
                    {driver.status === "PENDING" && role !== "DISPATCHER" && (
                      <>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            className="bg-green-500 hover:bg-green-600"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApprove && onApprove(driverId);
                            }}
                            title="Duyệt"
                          >
                            <Icon path={mdiCheckCircleOutline} size={0.8} />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            className="bg-red-500 hover:bg-red-600"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReject && onReject(driverId);
                            }}
                            title="Từ chối"
                          >
                            <Icon path={mdiCloseCircleOutline} size={0.8} />
                          </Button>
                        </motion.div>
                      </>
                    )}

                    {/* LOCKED: Show Unlock */}
                    {driver.status === "LOCKED" && role !== "DISPATCHER" && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className="bg-blue-500 hover:bg-blue-600"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onUnlock && onUnlock(driverId);
                          }}
                          title="Mở khóa"
                        >
                          <Icon path={mdiLockOpenVariantOutline} size={0.8} />
                        </Button>
                      </motion.div>
                    )}

                    {role !== "DISPATCHER" && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className="bg-red-500 hover:bg-red-600"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(driverId);
                          }}
                          title="Xóa"
                        >
                          <Icon path={mdiTrashCanOutline} size={0.8} />
                        </Button>
                      </motion.div>
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
