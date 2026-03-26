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
import { IconStar } from "@tabler/icons-react";

import { IUser } from "@/interface/auth";
import { mdiTableEye, mdiTrashCanOutline, mdiInboxRemoveOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Skeleton } from "@/components/ui/skeleton";

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

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4 text-neutral-400 italic gap-3">
        <Icon path={mdiInboxRemoveOutline} size={1.6} className="opacity-60" />
        <p>{isSearching ? "Không tìm thấy người dùng" : "Danh sách người dùng trống"}</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto border border-darkBackgroundV1 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Thông tin người dùng</TableHead>
            <TableHead className="w-[180px]">Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Đánh giá</TableHead>
            <TableHead>Số dư ví</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user, index) => {
            const rowNumber = (currentPage - 1) * pageSize + index + 1;
            return (
              <TableRow
                key={user.id || user._id}
                className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-darkBorderV1/50 transition-colors"
                onClick={() => onEdit(user.id || user._id || "")}
              >
                <TableCell>{rowNumber}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-darkBorderV1 flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        user.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                      }
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold dark:text-neutral-300">
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
                  <div className="flex items-center gap-1 dark:text-neutral-300 font-medium">
                    <IconStar className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    {user.rating}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium text-green-500">
                    {formatCurrency(user.walletBalance)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(user.id || user._id || "");
                        }}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(user.id || user._id || "");
                        }}
                      >
                        <Icon path={mdiTrashCanOutline} size={0.8} />
                      </Button>
                    </motion.div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })
          }
        </TableBody>
      </Table>
    </div>
  );
};

export const UserTableSkeleton = () => {
  return (
    <div className="w-full overflow-auto border border-darkBackgroundV1 rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Thông tin người dùng</TableHead>
            <TableHead className="w-[180px]">Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Đánh giá</TableHead>
            <TableHead>Số dư ví</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-4" /></TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </TableCell>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
              <TableCell><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
