import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Activity, Star, Truck, Landmark, ShieldCheck } from "lucide-react";
import { formatDate } from "@/utils/dateFormat";
import { getRoleBadge } from "@/lib/badge-helpers";
import { formatCurrency } from "@/utils/currencyFormat";

interface UserTableProps {
  user: any; // Using any to access extended fields not in IUser yet
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
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      {/* Basic Information */}
      <Card>
        <CardHeader className="border-b border-b-darkBorderV1 py-3">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
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
                src={
                  user.avatar ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
                }
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold dark:text-neutral-200">
                {user.name}
              </h3>
              <p className="text-sm text-neutral-400">
                {user.email || "Chưa cập nhật email"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {getRoleBadge(user.role)}
              </div>
            </div>
          </div>

          <Table>
            <TableBody>
              {renderTableRow("Họ tên", user.name)}
              {renderTableRow("Số điện thoại", user.phone)}
              {renderTableRow(
                "Số dư ví",
                <span className="font-medium text-green-600">
                  {formatCurrency(user.walletBalance || 0)}
                </span>
              )}
              {user.role === "DRIVER" &&
                renderTableRow(
                  "Đánh giá",
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{user.rating || 5}</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                )}
              {renderTableRow(
                "Ngày tham gia",
                formatDate(user.createdAt || "")
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {user.role === "DRIVER" && (
        <>
          {/* Thông tin tài xế & Xe */}
          <Card>
            <CardHeader className="border-b border-b-darkBorderV1 py-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-500" />
                <span className="font-semibold dark:text-neutral-200">
                  Thông tin tài xế & Xe
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableBody>
                  {renderTableRow("Loại xe", user.vehicleType)}
                  {renderTableRow("Biển số xe", user.plateNumber)}
                  {renderTableRow(
                    "Số CCCD",
                    user.identityNumber || "Chưa cập nhật"
                  )}
                  {renderTableRow(
                    "Số bằng lái",
                    user.drivingLicenseNumber || "Chưa cập nhật"
                  )}
                </TableBody>
              </Table>

              {/* Document Images */}
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3 dark:text-neutral-200 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Ảnh CCCD
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-500">
                        Mặt trước
                      </span>
                      <div className="aspect-video rounded-lg overflow-hidden border border-darkBorderV1">
                        {user.identityFrontImage ? (
                          <img
                            src={user.identityFrontImage}
                            alt="CCCD Front"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 italic text-xs">
                            Chưa cập nhật
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-500">
                        Mặt sau
                      </span>
                      <div className="aspect-video rounded-lg overflow-hidden border border-darkBorderV1">
                        {user.identityBackImage ? (
                          <img
                            src={user.identityBackImage}
                            alt="CCCD Back"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 italic text-xs">
                            Chưa cập nhật
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3 dark:text-neutral-200 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Ảnh bằng lái
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {user.licenseImages?.length > 0 ? (
                      user.licenseImages.map((url: string, idx: number) => (
                        <div
                          key={idx}
                          className="aspect-video rounded-lg overflow-hidden border border-darkBorderV1"
                        >
                          <img
                            src={url}
                            alt="License"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-neutral-500 italic">
                        Chưa có ảnh bằng lái
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3 dark:text-neutral-200 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" /> Ảnh đăng ký xe (Cà vẹt)
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {user.vehicleRegistrationImages?.length > 0 ? (
                      user.vehicleRegistrationImages.map(
                        (url: string, idx: number) => (
                          <div
                            key={idx}
                            className="aspect-video rounded-lg overflow-hidden border border-darkBorderV1"
                          >
                            <img
                              src={url}
                              alt="Registration"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-sm text-neutral-500 italic">
                        Chưa có ảnh đăng ký xe
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin ngân hàng */}
          <Card>
            <CardHeader className="border-b border-b-darkBorderV1 py-3">
              <div className="flex items-center gap-2">
                <Landmark className="h-5 w-5 text-green-500" />
                <span className="font-semibold dark:text-neutral-200">
                  Thông tin ngân hàng
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableBody>
                  {renderTableRow(
                    "Ngân hàng",
                    user.bankInfo?.bankName || "Chưa cập nhật"
                  )}
                  {renderTableRow(
                    "Số tài khoản",
                    user.bankInfo?.accountNumber || "Chưa cập nhật"
                  )}
                  {renderTableRow(
                    "Chủ tài khoản",
                    user.bankInfo?.accountHolder || "Chưa cập nhật"
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
