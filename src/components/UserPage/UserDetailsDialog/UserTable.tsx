import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  IconActivity,
  IconStar,
  IconTruck,
  IconBuildingBank,
  IconShieldCheck,
} from "@tabler/icons-react";
import { formatDate, formatCurrency } from "@/lib/format";
import { getRoleBadge } from "@/lib/badge-helpers";

interface UserTableProps {
  user: any; // Using any to access extended fields not in IUser yet
}

export const UserTable = ({ user }: UserTableProps) => {
  const renderTableRow = (label: string, value: React.ReactNode) => (
    <TableRow className="transition-colors border-b-darkBorderV1">
      <TableCell className="text-neutral-400 w-1/3 border-none">
        {label}
      </TableCell>
      <TableCell className="text-white border-none">{value}</TableCell>
    </TableRow>
  );

  const profile = user.role === "DRIVER" ? user.driverProfile : {};

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
      {/* Basic Information */}
      <Card>
        <CardHeader className="border-b border-b-darkBorderV1 py-3">
          <div className="flex items-center gap-2">
            <IconActivity className="h-5 w-5 text-primary" />
            <span className="font-semibold text-primary">Thông tin cơ bản</span>
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
              <h3 className="text-lg font-semibold text-white">{user.name}</h3>
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
                <span className="font-medium text-white">
                  {formatCurrency(user.walletBalance || 0)}
                </span>,
              )}
              {user.role === "DRIVER" &&
                renderTableRow(
                  "Đánh giá",
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {profile?.rating || user.rating || 5}
                    </span>
                    <IconStar className="w-4 h-4 text-primary fill-primary" />
                  </div>,
                )}
              {renderTableRow(
                "Ngày tham gia",
                formatDate(user.createdAt || ""),
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {user.role === "DRIVER" && (
        <>
          <Card>
            <CardHeader className="border-b border-b-darkBorderV1 py-3">
              <div className="flex items-center gap-2">
                <IconTruck className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">
                  Thông tin tài xế & Xe
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableBody>
                  {renderTableRow(
                    "Loại xe",
                    profile?.vehicleType || user.vehicleType,
                  )}
                  {renderTableRow(
                    "Biển số xe",
                    profile?.plateNumber || user.plateNumber,
                  )}
                  {renderTableRow(
                    "Số CCCD",
                    profile?.identityNumber ||
                      user.identityNumber ||
                      "Chưa cập nhật",
                  )}
                  {renderTableRow(
                    "Số bằng lái",
                    profile?.drivingLicenseNumber ||
                      user.drivingLicenseNumber ||
                      "Chưa cập nhật",
                  )}
                </TableBody>
              </Table>

              {/* Document Images */}
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                    <IconShieldCheck className="h-4 w-4 text-primary" /> Ảnh
                    CCCD
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-bold text-neutral-400">
                        Mặt trước
                      </span>
                      <div className="aspect-video rounded-lg overflow-hidden border border-darkBorderV1">
                        {profile?.identityFrontImage ||
                        user.identityFrontImage ? (
                          <img
                            src={
                              profile?.identityFrontImage ||
                              user.identityFrontImage
                            }
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
                      <span className="text-xs uppercase font-bold text-neutral-400">
                        Mặt sau
                      </span>
                      <div className="aspect-video rounded-lg overflow-hidden border border-darkBorderV1">
                        {profile?.identityBackImage ||
                        user.identityBackImage ? (
                          <img
                            src={
                              profile?.identityBackImage ||
                              user.identityBackImage
                            }
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
                  <h4 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
                    <IconShieldCheck className="h-4 w-4 text-primary" /> Giấy tờ
                    xe
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-bold text-neutral-400">
                        Ảnh bằng lái
                      </span>
                      <div className="aspect-video rounded-lg overflow-hidden border border-darkBorderV1">
                        {profile?.licenseImage || user.licenseImage ? (
                          <img
                            src={profile?.licenseImage || user.licenseImage}
                            alt="License"
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
                      <span className="text-xs uppercase font-bold text-neutral-400">
                        Ảnh đăng ký xe (Cà vẹt)
                      </span>
                      <div className="aspect-video rounded-lg overflow-hidden border border-darkBorderV1">
                        {profile?.vehicleRegistrationImage ||
                        user.vehicleRegistrationImage ? (
                          <img
                            src={
                              profile?.vehicleRegistrationImage ||
                              user.vehicleRegistrationImage
                            }
                            alt="Registration"
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
              </div>
            </CardContent>
          </Card>

          {/* Thông tin ngân hàng */}
          <Card>
            <CardHeader className="border-b border-b-darkBorderV1 py-3">
              <div className="flex items-center gap-2">
                <IconBuildingBank className="h-5 w-5 text-primary" />
                <span className="font-semibold text-primary">
                  Thông tin ngân hàng
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <Table>
                <TableBody>
                  {renderTableRow(
                    "Ngân hàng",
                    profile?.bankInfo?.bankName ||
                      user.bankInfo?.bankName ||
                      "Chưa cập nhật",
                  )}
                  {renderTableRow(
                    "Số tài khoản",
                    profile?.bankInfo?.accountNumber ||
                      user.bankInfo?.accountNumber ||
                      "Chưa cập nhật",
                  )}
                  {renderTableRow(
                    "Chủ tài khoản",
                    profile?.bankInfo?.accountHolder ||
                      user.bankInfo?.accountHolder ||
                      "Chưa cập nhật",
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
