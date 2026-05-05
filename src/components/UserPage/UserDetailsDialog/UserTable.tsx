import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  IconActivity,
  IconStar,
  IconTruck,
  IconBuildingBank,
  IconFileCheck
} from "@tabler/icons-react";
import { formatDate, formatCurrency } from "@/lib/format";
import { getRoleBadge, getStatusBadge } from "@/lib/badge-helpers";
import { Badge } from "@/components/ui/badge";

interface UserTableProps {
  user: any; // Using any to access extended fields not in IUser yet
}

export const UserTable = ({ user }: UserTableProps) => {
  const renderTableRow = (label: string, value: React.ReactNode) => (
    <TableRow className="transition-colors border-b-darkBorderV1">
      <TableCell className="text-neutral-300 w-1/3 border-none font-semibold">
        {label}
      </TableCell>
      <TableCell>
        {value}
      </TableCell>
    </TableRow>
  );

  const profile = user.driverProfile || {};

  return (
    <div className="space-y-4">
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
          <div className="flex items-center gap-4">
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
              {renderTableRow("Họ tên", <Badge variant="neutral">
                {user.name}</Badge>)}
              {renderTableRow("Số điện thoại", <Badge variant="neutral">
                {user.phone}</Badge>)}
              {renderTableRow(
                "Số dư ví",
                <Badge variant="neutral">
                  {formatCurrency(user.walletBalance || 0)}
                </Badge>,
              )}
              {(user.role === "DRIVER" || user.driverProfile) &&
                renderTableRow(
                  "Đánh giá",
                  <Badge variant="amber">
                    {profile?.rating || user.rating || 5} <IconStar className="w-3 h-3 text-yellow-400 fill-yellow-400" /></Badge>
                )}
              {renderTableRow(
                "Trạng thái hoạt động",
                <Badge variant={user.active ? "green" : "red"}>
                  {user.active ? "Hoạt động" : "Bị khóa"}
                </Badge>
              )}
              {renderTableRow(
                "Tham gia",
                <Badge variant="neutral">
                  {formatDate(user.createdAt || "")}
                </Badge>,
              )}
              {renderTableRow(
                "Cập nhật",
                <Badge variant="neutral">
                  {formatDate(user.updatedAt || "")}
                </Badge>,
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {user.driverProfile && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="border-b border-b-primary/20 py-3 bg-primary/10">
            <div className="flex items-center gap-2">
              <IconFileCheck className="h-5 w-5 text-primary" />
              <span className="font-semibold text-primary">
                Yêu cầu hồ sơ duyệt tài xế
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <Table>
              <TableBody>
                {renderTableRow(
                  "Trạng thái hồ sơ",
                  getStatusBadge(profile?.status),
                )}
                {renderTableRow(
                  "Loại xe",
                  <Badge variant="neutral">
                    {profile?.vehicleType}
                  </Badge>
                )}
                {renderTableRow(
                  "Biển số xe",
                  <Badge variant="neutral">
                    {profile?.plateNumber}
                  </Badge>
                )}
                {renderTableRow(
                  "Số CCCD",
                  <Badge variant="neutral">
                    {profile?.identityNumber || "Chưa cập nhật"}
                  </Badge>
                )}
                {renderTableRow(
                  "Số bằng lái",
                  <Badge variant="neutral">
                    {profile?.drivingLicenseNumber || "Chưa cập nhật"}
                  </Badge>
                )}
                {profile?.rejectionReason && renderTableRow(
                  "Lý do từ chối",
                  <span className="text-red-500 font-semibold bg-red-500/10 px-2 py-1 rounded">
                    {profile.rejectionReason}
                  </span>
                )}
              </TableBody>
            </Table>

            {/* Bank Info Summary */}
            <div className="bg-darkBackgroundV1/40 p-4 rounded-lg border border-darkBorderV1 space-y-3">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <IconBuildingBank className="h-4 w-4" />
                Thông tin ngân hàng
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-neutral-400 uppercase font-bold">Ngân hàng</p>
                  <p className="text-sm font-medium">{profile?.bankInfo?.bankName || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-neutral-400 uppercase font-bold">Số tài khoản</p>
                  <p className="text-sm font-medium">{profile?.bankInfo?.accountNumber || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-neutral-400 uppercase font-bold">Chủ tài khoản</p>
                  <p className="text-sm font-medium">{profile?.bankInfo?.accountHolder || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Document Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2">
                <p className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-1">
                  <span>Ảnh CCCD mặt trước</span>
                </p>
                <div className="aspect-video rounded-xl overflow-hidden border-2 border-darkBorderV1 bg-darkBackgroundV1/50 group cursor-pointer hover:border-primary/50 transition-all">
                  {profile?.identityFrontImage ? (
                    <img
                      src={profile.identityFrontImage}
                      alt="CCCD Front"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs italic">
                      Trống
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-1">
                  <span>Ảnh CCCD mặt sau</span>
                </p>
                <div className="aspect-video rounded-xl overflow-hidden border-2 border-darkBorderV1 bg-darkBackgroundV1/50 group cursor-pointer hover:border-primary/50 transition-all">
                  {profile?.identityBackImage ? (
                    <img
                      src={profile.identityBackImage}
                      alt="CCCD Back"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs italic">
                      Trống
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-1">
                  <span>Ảnh đăng ký xe (Cà vẹt)</span>
                </p>
                <div className="aspect-video rounded-xl overflow-hidden border-2 border-darkBorderV1 bg-darkBackgroundV1/50 group cursor-pointer hover:border-primary/50 transition-all">
                  {profile?.vehicleRegistrationImage ? (
                    <img
                      src={profile.vehicleRegistrationImage}
                      alt="Vehicle Registration"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs italic">
                      Trống
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                    <Badge variant="neutral">
                      {profile?.vehicleType || user.vehicleType}
                    </Badge>
                  )}
                  {renderTableRow(
                    "Trạng thái hồ sơ",
                    getStatusBadge(profile?.status || user.status),
                  )}
                  {renderTableRow(
                    "Trạng thái hoạt động",
                    <Badge variant={profile?.isOnline ? "green" : "neutral"}>
                      {profile?.isOnline ? "Trực tuyến" : "Ngoại tuyến"}
                    </Badge>
                  )}
                  {renderTableRow(
                    "Biển số xe",
                    <Badge variant="neutral">
                      {profile?.plateNumber || user.plateNumber}
                    </Badge>
                  )}
                  {renderTableRow(
                    "Số CCCD",
                    <Badge variant="neutral">
                      {profile?.identityNumber ||
                        user.identityNumber ||
                        "Chưa cập nhật"}
                    </Badge>
                  )}
                  {renderTableRow(
                    "Số bằng lái",
                    <Badge variant="neutral">
                      {profile?.drivingLicenseNumber ||
                        user.drivingLicenseNumber ||
                        "Chưa cập nhật"}
                    </Badge>
                  )}
                </TableBody>
              </Table>

              {/* Document Images */}
              <div className="mt-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-3 text-primary">
                    Ảnh CCCD
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-semibold text-neutral-400">
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
                          <div className="w-full h-full bg-neutral-100 dark:bg-darkBorderV1 flex items-center justify-center text-neutral-400 italic text-sm">
                            Chưa cập nhật
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-semibold text-neutral-400">
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
                          <div className="w-full h-full bg-neutral-100 dark:bg-darkBorderV1 flex items-center justify-center text-neutral-400 italic text-sm">
                            Chưa cập nhật
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3 text-primary">
                    Giấy tờ xe
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-semibold text-neutral-400">
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
                          <div className="w-full h-full bg-neutral-100 dark:bg-darkBorderV1  flex items-center justify-center text-neutral-400 italic text-sm">
                            Chưa cập nhật
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs uppercase font-semibold text-neutral-400">
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
                          <div className="w-full h-full bg-neutral-100 dark:bg-darkBorderV1 flex items-center justify-center text-neutral-400 italic text-sm">
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
                    <Badge variant="neutral">
                      {profile?.bankInfo?.bankName ||
                        user.bankInfo?.bankName ||
                        "Chưa cập nhật"}
                    </Badge>
                  )}
                  {renderTableRow(
                    "Số tài khoản",
                    <Badge variant="neutral">
                      {profile?.bankInfo?.accountNumber ||
                        user.bankInfo?.accountNumber ||
                        "Chưa cập nhật"}
                    </Badge>
                  )}
                  {renderTableRow(
                    "Chủ tài khoản",
                    <Badge variant="neutral">
                      {profile?.bankInfo?.accountHolder ||
                        user.bankInfo?.accountHolder ||
                        "Chưa cập nhật"}
                    </Badge>
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
