import { useTicketDetails, useUpdateTicketStatus } from "@/hooks/useAdmin";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
    IconUserSquareRounded,
    IconClipboardList,
    IconMessage,
    IconPhone,
    IconMail,
    IconClock,
    IconAlertCircle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatDate, formatRelativeTime, getPriorityVariant } from "@/lib/format";
import { getStatusBadge } from "@/lib/badge-helpers";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@mdi/react";
import { mdiTicket } from "@mdi/js";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TicketDetailsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    ticketId: string;
}

export function TicketDetailsDialog({
    isOpen,
    onClose,
    ticketId,
}: TicketDetailsDialogProps) {
    const { data: ticketResponse, isLoading } = useTicketDetails(ticketId);
    const ticket = ticketResponse?.data;
    const { mutate: updateStatus, isPending: isUpdating } =
        useUpdateTicketStatus();

    const [confirmConfig, setConfirmConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
        variant?: "default" | "destructive" | "warning";
    }>({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: () => { },
    });

    const handleStatusUpdate = (status: string) => {
        setConfirmConfig({
            isOpen: true,
            title: "Xác nhận cập nhật trạng thái",
            description: `Bạn có chắc chắn muốn thay đổi trạng thái yêu cầu sang "${status === "OPEN"
                ? "Đang mở"
                : status === "IN_PROGRESS"
                    ? "Đang xử lý"
                    : status === "RESOLVED"
                        ? "Đã giải quyết"
                        : "Đã đóng"
                }"?`,
            variant: status === "CLOSED" ? "destructive" : "warning",
            onConfirm: () => {
                const resolution = status === "RESOLVED" ? "Đã xử lý xong" : "";
                updateStatus({ id: ticketId, data: { status, resolution } });
                setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                size="medium"
                className="bg-darkCardV1 border-darkBorderV1 max-h-[95vh]"
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-start w-full text-primary">
                        <div className="flex items-center gap-2">
                            <Icon path={mdiTicket} size={0.8} />
                            <span>Chi tiết yêu cầu #{ticket?._id?.slice(-8)}</span>
                        </div>
                        {ticket && getStatusBadge(ticket.status)}
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4 p-4">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <div className="grid grid-cols-2 gap-4">
                            <Skeleton className="h-40 w-full rounded-xl" />
                            <Skeleton className="h-40 w-full rounded-xl" />
                        </div>
                    </div>
                ) : !ticket ? (
                    <div className="text-center py-20 text-neutral-400 flex flex-col items-center gap-3">
                        <IconAlertCircle className="w-12 h-12 opacity-20" />
                        <p>Không tìm thấy thông tin chi tiết yêu cầu</p>
                    </div>
                ) : (
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar pb-6">
                        {/* Quick Actions / Status Updates */}
                        <div className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-darkBackgroundV1/40 border border-darkBorderV1">
                            <div className="flex-1 space-y-2">
                                <p className="text-xs font-bold text-white uppercase">
                                    Cập nhật trạng thái
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <Select
                                        value={ticket.status}
                                        onValueChange={handleStatusUpdate}
                                        disabled={isUpdating}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Chọn trạng thái" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="OPEN">Đang mở</SelectItem>
                                            <SelectItem value="IN_PROGRESS">Đang xử lý</SelectItem>
                                            <SelectItem value="RESOLVED">Đã giải quyết</SelectItem>
                                            <SelectItem value="CLOSED">Đã đóng</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="w-px bg-darkBorderV1 hidden md:block" />

                            <div className="flex-1 space-y-2">
                                <p className="text-xs font-bold text-white uppercase">
                                    Độ ưu tiên
                                </p>
                                <Badge
                                    variant={getPriorityVariant(ticket.priority || "LOW")}
                                    className="text-sm px-4 py-2"
                                >
                                    {ticket.priority === "URGENT"
                                        ? "Khẩn cấp"
                                        : ticket.priority === "HIGH"
                                            ? "Cao"
                                            : ticket.priority === "MEDIUM"
                                                ? "Trung bình"
                                                : "Thấp"}
                                </Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* User Information */}
                            <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                                <CardHeader className="border-b border-b-darkBorderV1 py-3">
                                    <div className="flex items-center gap-2">
                                        <IconUserSquareRounded className="h-5 w-5 text-primary" />
                                        <span className="font-semibold text-primary">
                                            Người dùng
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 px-4 pb-4">
                                    <div className="flex items-center gap-4">
                                        <Avatar className="w-10 h-10 ring-2 ring-primary/20 ring-offset-2 ring-offset-darkBackgroundV1">
                                            <AvatarImage
                                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.userId?.name}`}
                                            />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.userId?.name}`}
                                                    alt={ticket.userId?.name}
                                                    className="w-full h-full"
                                                />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-2">
                                            <p className="font-bold text-lg text-white leading-none">
                                                {ticket.userId?.name || "Ẩn danh"}
                                            </p>
                                            <div className="flex items-center gap-3 pt-1">
                                                <div className="flex items-center gap-1.5 text-neutral-400 group">
                                                    <IconPhone
                                                        size={16}
                                                        className="group-hover:text-primary transition-colors"
                                                    />
                                                    <span className="text-xs">
                                                        {ticket.userId?.phone || "N/A"}
                                                    </span>
                                                </div>
                                                {ticket.userId?.email && (
                                                    <div className="flex items-center gap-1.5 text-neutral-400 group">
                                                        <IconMail
                                                            size={16}
                                                            className="group-hover:text-primary transition-colors"
                                                        />
                                                        <span className="text-xs truncate max-w-[200px]">
                                                            {ticket.userId.email}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Ticket Summary */}
                            <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                                <CardHeader className="border-b border-b-darkBorderV1 py-3">
                                    <div className="flex items-center gap-2">
                                        <IconClipboardList className="h-5 w-5 text-primary" />
                                        <span className="font-semibold text-primary">
                                            Thông tin yêu cầu
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <IconClock size={16} className="text-neutral-400" />
                                            <span className="text-xs text-white uppercase font-bold tracking-wider">
                                                Ngày tạo
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-200">
                                                {formatDate(ticket.createdAt)}
                                            </p>
                                            <p className="text-xs text-neutral-400">
                                                {formatRelativeTime(ticket.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <Separator className="bg-darkBorderV1" />

                                    {ticket.assignedTo && (
                                        <div className="space-y-2">
                                            <span className="text-xs text-white uppercase font-bold tracking-wider">
                                                Người xử lý
                                            </span>
                                            <p className="text-sm font-medium text-neutral-200">
                                                {ticket.assignedTo}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Subject and Content */}
                        <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                            <CardHeader className="border-b border-b-darkBorderV1 py-3">
                                <div className="flex items-center gap-2">
                                    <IconMessage className="h-5 w-5 text-primary" />
                                    <span className="font-semibold text-primary">
                                        Nội dung yêu cầu
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-2">
                                        {ticket.subject}
                                    </h3>
                                    <div className="bg-darkBackgroundV1 px-4 py-3 rounded-lg border border-darkBorderV1/50 text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap">
                                        {ticket.content}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </DialogContent>

            <ConfirmDialog
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                description={confirmConfig.description}
                variant={confirmConfig.variant}
                isPending={isUpdating}
            />
        </Dialog>
    );
}
