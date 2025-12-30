import { useState } from "react";
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
import { IUser } from "@/interface/auth";
import { motion } from "framer-motion";
import { IconTrash, IconMenu3 } from "@tabler/icons-react";
import { Activity } from "lucide-react";
import { getRoleBadge } from "@/lib/badge-helpers";
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
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getStatusBadge = (active: boolean) => {
    return active ? (
      <Badge variant="green">
        <Activity className="h-3 w-3" />
        Active
      </Badge>
    ) : (
      <Badge variant="red">Inactive</Badge>
    );
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No.</TableHead>
            <TableHead>User Information</TableHead>
            <TableHead className="w-[180px]">Email</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>
                {isSearching ? "No user found" : "No user found"}
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => {
              const rowNumber = (currentPage - 1) * pageSize + index + 1;
              return (
                <TableRow
                  key={user._id}
                  onMouseEnter={() => setHoveredRow(user._id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell>{rowNumber}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-darkBorderV1 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullName || user.name}
                          className="w-full h-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <img
                          src={`/images/${user.gender ? user.gender : "male"}-${
                            user.role
                          }.webp`}
                          alt={"default-avatar"}
                          className="w-full h-full object-cover flex-shrink-0"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold dark:text-neutral-200">
                        {user.fullName || user.name}
                      </p>
                      {user.phoneNumber && (
                        <p className="text-sm dark:text-neutral-200">
                          {user.phoneNumber}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-[180px]">{user.email}</TableCell>
                  <TableCell>
                    {user.studentId ? (
                      <Badge variant="orange">{user.studentId}</Badge>
                    ) : (
                      ""
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {user.department ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold dark:text-neutral-200 text-nowrap">
                            {user.department.name}
                          </span>
                          <span className="text-sm font-semibold dark:text-neutral-200 text-nowrap">
                            Code: {user.department.code}
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.active ?? false)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(user._id)}
                        >
                          <IconMenu3 className="h-5 w-5" />
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDelete(user._id)}
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
