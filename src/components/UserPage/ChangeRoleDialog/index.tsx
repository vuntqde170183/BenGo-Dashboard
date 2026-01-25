import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUserRole } from "@/hooks/useAdmin";
import {
    IconUserCog,
    IconAlertTriangle,
    IconUser,
    IconSteeringWheel,
    IconHeadset,
    IconShieldLock,
} from "@tabler/icons-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChangeRoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        id: string;
        name: string;
        role: string;
    };
    onSuccess?: () => void;
}

const ROLES = [
    { value: "CUSTOMER", label: "Khách hàng", description: "Sử dụng dịch vụ vận chuyển", icon: IconUser },
    { value: "DRIVER", label: "Tài xế", description: "Cung cấp dịch vụ vận chuyển", icon: IconSteeringWheel },
    { value: "DISPATCHER", label: "Điều phối viên", description: "Hỗ trợ và giám sát", icon: IconHeadset },
    { value: "ADMIN", label: "Quản trị viên", description: "Quản lý hệ thống", icon: IconShieldLock },
];

const VEHICLE_TYPES = [
    { value: "BIKE", label: "Xe máy" },
    { value: "VAN", label: "Xe tải nhỏ" },
    { value: "TRUCK", label: "Xe tải lớn" },
];

export function ChangeRoleDialog({
    isOpen,
    onClose,
    user,
    onSuccess,
}: ChangeRoleDialogProps) {
    const [newRole, setNewRole] = useState(user.role);
    const [reason, setReason] = useState("");
    const [vehicleType, setVehicleType] = useState("BIKE");
    const [plateNumber, setPlateNumber] = useState("");

    const { mutate: updateRole, isPending } = useUpdateUserRole();

    const handleSubmit = () => {
        const data: any = {
            role: newRole,
            reason: reason.trim() || undefined,
        };

        // Nếu chuyển sang DRIVER, cần thông tin xe
        if (newRole === "DRIVER") {
            if (!plateNumber.trim()) {
                return;
            }
            data.driverProfile = {
                vehicleType,
                plateNumber: plateNumber.trim(),
                rating: 5,
            };
        }

        updateRole(
            { id: user.id, data },
            {
                onSuccess: () => {
                    onSuccess?.();
                    handleClose();
                },
            }
        );
    };

    const handleClose = () => {
        setNewRole(user.role);
        setReason("");
        setVehicleType("BIKE");
        setPlateNumber("");
        onClose();
    };

    const isRoleChanged = newRole !== user.role;
    const isDriverRole = newRole === "DRIVER";
    const wasDriver = user.role === "DRIVER";

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent size="small">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary">
                        <IconUserCog className="h-5 w-5" />
                        Phân quyền người dùng
                    </DialogTitle>
                    <DialogDescription>
                        Thay đổi vai trò của <span className="font-semibold text-white">{user.name}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Current Role */}
                    <div className="space-y-2">
                        <Label>Vai trò hiện tại</Label>
                        <div className="px-3 py-2 bg-darkBackgroundV1 rounded-md border border-darkBorderV1 flex items-center gap-2">
                            {(() => {
                                const currentRole = ROLES.find(r => r.value === user.role);
                                const CurrentIcon = currentRole?.icon || IconUser;
                                return (
                                    <>
                                        <CurrentIcon className="h-4 w-4 text-primary" />
                                        <span className="text-white font-medium text-sm">
                                            {currentRole?.label || user.role}
                                        </span>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* New Role */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Vai trò mới *</Label>
                        <Select value={newRole} onValueChange={setNewRole}>
                            <SelectTrigger id="role" className="text-left">
                                <SelectValue placeholder="Chọn vai trò" />
                            </SelectTrigger>
                            <SelectContent>
                                {ROLES.map((role) => {
                                    const RoleIcon = role.icon;
                                    return (
                                        <SelectItem key={role.value} value={role.value}>
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                                    <RoleIcon size={18} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{role.label}</span>
                                                    <span className="text-[10px] text-neutral-400">
                                                        {role.description}
                                                    </span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Driver Profile (only show when changing to DRIVER) */}
                    {isDriverRole && (
                        <div className="space-y-4 p-4 bg-darkBackgroundV1/40 rounded-lg border border-darkBorderV1">
                            <h4 className="text-sm font-semibold text-primary">
                                Thông tin tài xế
                            </h4>

                            <div className="space-y-2">
                                <Label htmlFor="vehicleType">Loại xe *</Label>
                                <Select value={vehicleType} onValueChange={setVehicleType}>
                                    <SelectTrigger id="vehicleType">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VEHICLE_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="plateNumber">Biển số xe *</Label>
                                <Input
                                    id="plateNumber"
                                    placeholder="VD: 59-S2 123.45"
                                    value={plateNumber}
                                    onChange={(e) => setPlateNumber(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Warning when changing from DRIVER */}
                    {wasDriver && newRole !== "DRIVER" && (
                        <Alert variant="destructive">
                            <IconAlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                                Chuyển từ Tài xế sang vai trò khác sẽ <strong>xóa toàn bộ</strong> hồ sơ tài xế,
                                bao gồm thông tin xe và giấy tờ. Không thể khôi phục sau khi xóa.
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">Lý do thay đổi (tùy chọn)</Label>
                        <Textarea
                            id="reason"
                            placeholder="VD: Thăng chức lên điều phối viên..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={3}
                        />
                    </div>
                </div>

                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={handleClose} disabled={isPending}>
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !isRoleChanged || (isDriverRole && !plateNumber.trim())}
                    >
                        {isPending ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
