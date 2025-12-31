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
import { Star, Car as CarIcon } from "lucide-react";
import { getStatusBadge } from "@/lib/badge-helpers";
import Icon from "@mdi/react";
import {
  mdiMotorbike,
  mdiTableEye,
  mdiTrashCanOutline,
  mdiTruck,
  mdiVanPassenger,
  mdiLockOutline,
  mdiCheckCircleOutline,
  mdiCloseCircleOutline,
  mdiLockOpenVariantOutline,
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
  currentPage = 1,
  pageSize = 10,
}: DriverTableProps) => {
  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "BIKE":
        return <Icon path={mdiMotorbike} size={0.9} />;
      case "TRUCK":
        return <Icon path={mdiTruck} size={0.9} />;
      case "VAN":
        return <Icon path={mdiVanPassenger} size={0.9} />;
      default:
        return <CarIcon className="w-4 h-4" />;
    }
  };

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
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9}>
                {isSearching
                  ? "Không tìm thấy tài xế"
                  : "Danh sách tài xế trống"}
              </TableCell>
            </TableRow>
          ) : (
            drivers.map((driver, index) => {
              const rowNumber = (currentPage - 1) * pageSize + index + 1;
              const driverId = driver._id;
              return (
                <TableRow key={driverId}>
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
                        <p className="font-semibold dark:text-neutral-200 text-nowrap">
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
                    <div className="flex items-center gap-1 dark:text-neutral-200 font-medium">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {driver.userId?.rating
                        ? driver.userId.rating.toFixed(1)
                        : "5.0"}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(driver.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {/* APPROVED: Show Lock */}
                      {driver.status === "APPROVED" && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            className="bg-orange-500 hover:bg-orange-600"
                            size="icon"
                            onClick={() => onLock && onLock(driverId)}
                            title="Khóa tài khoản"
                          >
                            <Icon path={mdiLockOutline} size={0.8} />
                          </Button>
                        </motion.div>
                      )}

                      {/* PENDING: Show Approve and Reject */}
                      {driver.status === "PENDING" && (
                        <>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              className="bg-green-500 hover:bg-green-600"
                              size="icon"
                              onClick={() => onApprove && onApprove(driverId)}
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
                              onClick={() => onReject && onReject(driverId)}
                              title="Từ chối"
                            >
                              <Icon path={mdiCloseCircleOutline} size={0.8} />
                            </Button>
                          </motion.div>
                        </>
                      )}

                      {/* LOCKED: Show Unlock and Edit/View */}
                      {driver.status === "LOCKED" && (
                        <>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              className="bg-blue-500 hover:bg-blue-600"
                              size="icon"
                              onClick={() => onUnlock && onUnlock(driverId)}
                              title="Mở khóa"
                            >
                              <Icon
                                path={mdiLockOpenVariantOutline}
                                size={0.8}
                              />
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="icon"
                              onClick={() => onEdit(driverId)}
                              title="Chi tiết"
                            >
                              <Icon path={mdiTableEye} size={0.8} />
                            </Button>
                          </motion.div>
                        </>
                      )}

                      {/* REJECTED: Show Edit/View */}
                      {driver.status === "REJECTED" && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="icon"
                            onClick={() => onEdit(driverId)}
                            title="Chi tiết"
                          >
                            <Icon path={mdiTableEye} size={0.8} />
                          </Button>
                        </motion.div>
                      )}

                      {/* Fallback for other statuses or missing status */}
                      {!["APPROVED", "PENDING", "LOCKED", "REJECTED"].includes(
                        driver.status
                      ) && (
                        <>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="icon"
                              onClick={() => onEdit(driverId)}
                              title="Chi tiết"
                            >
                              <Icon path={mdiTableEye} size={0.8} />
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              className="bg-red-500 hover:bg-red-600"
                              size="icon"
                              onClick={() => onDelete(driverId)}
                              title="Xóa"
                            >
                              <Icon path={mdiTrashCanOutline} size={0.8} />
                            </Button>
                          </motion.div>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
