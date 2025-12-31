import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { IUser } from "@/interface/auth";
import { Activity, Star } from "lucide-react";
import { formatDate } from "@/utils/dateFormat";
import { getRoleBadge } from "@/lib/badge-helpers";
import { formatCurrency } from "@/utils/currencyFormat";

interface UserTableProps {
  user: IUser;
}

export const UserTable = ({ user }: UserTableProps) => {
  const renderTableRow = (label: string, value: React.ReactNode) => (
    <TableRow className="transition-colors">
      <TableCell className="font-semibold dark:text-neutral-200 w-1/3">
        {label}
      </TableCell>
      <TableCell className="dark:text-neutral-200">{value}</TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
      {/* Basic Information */}
      <Card>
        <CardHeader className="border-b border-b-darkBorderV1">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <span className="font-semibold dark:text-neutral-200">
              Thông tin cơ bản
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* User Header */}
          <div className="flex items-center gap-4 pb-4 border-b border-b-darkBorderV1">
            <div className="w-20 h-20 border border-darkBorderV1 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold dark:text-neutral-200">
                {user.name}
              </h3>
              <p className="text-sm text-neutral-200">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                {getRoleBadge(user.role)}
              </div>
            </div>
          </div>

          {/* Basic Info Table */}
          <div className="w-full overflow-auto">
            <Table className="overflow-hidden">
              <TableBody>
                {renderTableRow("Tên hiển thị", user.name)}
                {renderTableRow("Email", user.email)}
                {renderTableRow("Số điện thoại", user.phone)}
                {renderTableRow(
                  "Số dư ví",
                  <span className="font-medium text-green-600">
                    {formatCurrency(user.walletBalance)}
                  </span>
                )}
                {renderTableRow(
                  "Đánh giá",
                  <div className="flex items-center gap-1">
                    <span>{user.rating || 0}</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
                {renderTableRow(
                  "Ngày tham gia",
                  formatDate(user.createdAt || "")
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
