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
import { getRoleBadge } from "@/lib/badge-helpers";
import { Star } from "lucide-react";

import { IUser } from "@/interface/auth";
import { mdiTableEye, mdiTrashCanOutline } from "@mdi/js";
import Icon from "@mdi/react";

interface UserTableProps {
  users: IUser[];
  isSearching: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  currentPage?: number;
  pageSize?: number;
}

export const UserTable = ({
  users,
  isSearching,
  onEdit,
  onDelete,
  currentPage = 1,
  pageSize = 10,
}: UserTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="w-full overflow-auto border border-darkBackgroundV1 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">STT</TableHead>
            <TableHead>Thông tin người dùng</TableHead>
            <TableHead className="w-[180px]">Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Đánh giá</TableHead>
            <TableHead>Số dư ví</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                {isSearching
                  ? "Không tìm thấy người dùng"
                  : "Danh sách người dùng trống"}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => {
              const rowNumber = (currentPage - 1) * pageSize + index + 1;
              return (
                <TableRow key={user.id}>
                  <TableCell>{rowNumber}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-darkBorderV1 flex items-center justify-center overflow-hidden">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold dark:text-neutral-200">
                        {user.name}
                      </p>
                      {user.phone && (
                        <p className="text-sm text-neutral-400">{user.phone}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-[180px]">{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 dark:text-neutral-200 font-medium">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {user.rating}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium text-green-500">
                      {formatCurrency(user.walletBalance)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button size="icon" onClick={() => onEdit(user.id)}>
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
                          onClick={() => onDelete(user.id)}
                        >
                          <Icon path={mdiTrashCanOutline} size={0.8} />
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
