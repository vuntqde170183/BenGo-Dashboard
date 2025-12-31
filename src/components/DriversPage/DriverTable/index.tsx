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
import { IconTrash, IconMenu3 } from "@tabler/icons-react";
import { Star, Car as CarIcon } from "lucide-react";
import { getStatusVariant } from "@/lib/formatters";

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
}

interface DriverTableProps {
  drivers: IDriver[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage?: number;
  pageSize?: number;
}

export const DriverTable = ({
  drivers,
  isSearching,
  onEdit,
  onDelete,
  currentPage = 1,
  pageSize = 10,
}: DriverTableProps) => {
  return (
    <div className="w-full overflow-auto border border-darkBackgroundV1 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">STT</TableHead>
            <TableHead>Thông tin tài xế</TableHead>
            <TableHead className="w-[180px]">Email</TableHead>
            <TableHead>Biển số xe</TableHead>
            <TableHead>Loại xe</TableHead>
            <TableHead>Đánh giá</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Trực tuyến</TableHead>
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
                  <TableCell className="flex items-center gap-2">
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
                      <p className="font-semibold dark:text-neutral-200">
                        {driver.userId?.name}
                      </p>
                      {driver.userId?.phone && (
                        <p className="text-sm text-neutral-400">
                          {driver.userId.phone}
                        </p>
                      )}
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
                      <CarIcon className="w-4 h-4" />
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
                  <TableCell>
                    <Badge variant={getStatusVariant(driver.status)}>
                      {driver.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={driver.isOnline ? "default" : "secondary"}>
                      {driver.isOnline ? "Trực tuyến" : "Ngoại tuyến"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button size="icon" onClick={() => onEdit(driverId)}>
                          <IconMenu3 className="h-5 w-5" />
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
                        >
                          <IconTrash className="h-5 w-5" />
                        </Button>
                      </motion.div>
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
