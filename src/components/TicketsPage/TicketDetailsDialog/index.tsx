import {
    useTicketDetails,
    useUpdateTicketStatus,
    useAssignTicket,
    useAdminUsers,
} from "@/hooks/useAdmin";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    formatDate,
    formatRelativeTime,
    getPriorityVariant,
} from "@/lib/format";
import { getStatusBadge } from "@/lib/badge-helpers";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@mdi/react";
import {
    mdiTicket,
    mdiAlertCircle,
    mdiClockOutline,
    mdiClipboardListOutline,
    mdiAccountCircleOutline,
    mdiMessageTextOutline,
    mdiPhone,
    mdiEmail,
    mdiClose,
    mdiCheckCircleOutline,
    mdiAccountArrowRight,
} from "@mdi/js";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

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
    const { mutate: assignTicket, isPending: isAssigning } = useAssignTicket();

    // Fetch dispatchers list
    const { data: dispatchersResponse } = useAdminUsers({
        role: "DISPATCHER",
        per_page: 100,
    });
    const dispatchers = dispatchersResponse?.data || [];

    const [assignedTo, setAssignedTo] = useState("");
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

    const handleAssignTicket = () => {
        if (!assignedTo.trim()) {
            return;
        }
        const selectedDispatcher = dispatchers.find(
            (d: any) => d.id === assignedTo,
        );
        const dispatcherName = selectedDispatcher?.name || assignedTo;

        setConfirmConfig({
            isOpen: true,
            title: "Xác nhận phân công ticket",
            description: `Bạn có chắc chắn muốn phân công ticket này cho "${dispatcherName}"?`,
            variant: "warning",
            onConfirm: () => {
                assignTicket({ id: ticketId, assignedTo: assignedTo.trim() });
                setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                setAssignedTo("");
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent size="medium">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary">
                        <Icon path={mdiTicket} size={0.8} />
                        <span>Chi tiết ticket #{ticket?._id?.slice(-8)}</span>
                        {ticket && getStatusBadge(ticket.status)}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 md:space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar p-3 md:p-4">
                    {isLoading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-[200px] w-full rounded-xl" />
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-40 w-full rounded-xl" />
                                <Skeleton className="h-40 w-full rounded-xl" />
                            </div>
                        </div>
                    ) : !ticket ? (
                        <div className="text-center py-20 text-neutral-400 flex flex-col items-center gap-3">
                            <Icon path={mdiAlertCircle} size={2} className="opacity-20" />
                            <p>Không tìm thấy thông tin chi tiết ticket</p>
                        </div>
                    ) : (
                        <>
                            {/* Status Progress Bar */}
                            <div className="px-4 py-8 bg-darkBackgroundV1/40 rounded-lg border border-darkBorderV1 mb-4">
                                {ticket.status === "CLOSED" ? (
                                    <div className="flex flex-col items-center justify-center py-4 bg-slate-500/10 rounded-2xl border border-slate-500/20">
                                        <Icon
                                            path={mdiAlertCircle}
                                            size={1.5}
                                            className="text-slate-500 mb-2"
                                        />
                                        <p className="text-slate-500 font-bold">TICKET ĐÃ ĐÓNG</p>
                                        <p className="text-xs text-slate-400/80 mt-1">
                                            Ticket này đã được đóng
                                        </p>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <div className="absolute top-5 left-0 w-full h-1 bg-darkBorderV1 -translate-y-1/2 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary transition-all duration-1000 ease-out"
                                                style={{
                                                    width: `${(["OPEN", "IN_PROGRESS", "RESOLVED"].findIndex(
                                                        (s) => s === ticket.status,
                                                    ) /
                                                        2) *
                                                        100
                                                        }%`,
                                                }}
                                            />
                                        </div>

                                        <div className="relative flex justify-between">
                                            {[
                                                {
                                                    key: "OPEN",
                                                    label: "Đang mở",
                                                    icon: mdiClockOutline,
                                                },
                                                {
                                                    key: "IN_PROGRESS",
                                                    label: "Đang xử lý",
                                                    icon: mdiClipboardListOutline,
                                                },
                                                {
                                                    key: "RESOLVED",
                                                    label: "Đã giải quyết",
                                                    icon: mdiCheckCircleOutline,
                                                },
                                            ].map((step, index) => {
                                                const statusOrder = ["OPEN", "IN_PROGRESS", "RESOLVED"];
                                                const currentIndex = statusOrder.findIndex(
                                                    (s) => s === ticket.status,
                                                );
                                                const isActive = currentIndex >= index;
                                                const isCurrent = ticket.status === step.key;

                                                return (
                                                    <div
                                                        key={step.key}
                                                        className="flex flex-col items-center group"
                                                    >
                                                        <div
                                                            className={cn(
                                                                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 shadow-lg",
                                                                isActive
                                                                    ? "bg-primary text-white scale-110"
                                                                    : "bg-darkBackgroundV1 text-neutral-400 border-2 border-darkBorderV1",
                                                                isCurrent && "ring-4 ring-primary/30",
                                                            )}
                                                        >
                                                            <Icon path={step.icon} size={0.8} />
                                                        </div>
                                                        <span
                                                            className={cn(
                                                                "text-xs md:text-xs font-bold mt-2 uppercase tracking-tight transition-colors duration-300",
                                                                isActive ? "text-primary" : "text-neutral-400",
                                                            )}
                                                        >
                                                            {step.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Unified Ticket Details Card */}
                            <Card className="border-darkBorderV1 bg-darkBackgroundV1/20 overflow-hidden">
                                <CardContent className="p-4 space-y-6">
                                    {/* User and Ticket Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* User Information Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    path={mdiAccountCircleOutline}
                                                    size={0.8}
                                                    className="text-primary"
                                                />
                                                <span className="font-semibold text-primary">
                                                    Người dùng
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Avatar className="w-12 h-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-darkBackgroundV1">
                                                    <AvatarImage
                                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.userId?.name}`}
                                                    />
                                                    <AvatarFallback className="bg-primary/5 text-primary font-bold">
                                                        <img
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.userId?.name}`}
                                                            alt={ticket.userId?.name}
                                                            className="w-full h-full"
                                                        />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <p className="font-bold text-base text-white leading-none">
                                                        {ticket.userId?.name || "Ẩn danh"}
                                                    </p>
                                                    <div className="flex flex-col gap-1 pt-1">
                                                        <div className="flex items-center gap-1.5 text-neutral-400 group">
                                                            <Icon
                                                                path={mdiPhone}
                                                                size={0.6}
                                                                className="group-hover:text-primary transition-colors"
                                                            />
                                                            <span className="text-sm">
                                                                {ticket.userId?.phone || "N/A"}
                                                            </span>
                                                        </div>
                                                        {ticket.userId?.email && (
                                                            <div className="flex items-center gap-1.5 text-neutral-400 group">
                                                                <Icon
                                                                    path={mdiEmail}
                                                                    size={0.6}
                                                                    className="group-hover:text-primary transition-colors"
                                                                />
                                                                <span className="text-sm truncate max-w-[150px]">
                                                                    {ticket.userId.email}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ticket Information Section */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <Icon
                                                    path={mdiClipboardListOutline}
                                                    size={0.8}
                                                    className="text-primary"
                                                />
                                                <span className="font-semibold text-primary">
                                                    Thông tin ticket
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center bg-darkBackgroundV1/40 p-2 rounded-lg border border-darkBorderV1/50">
                                                    <p className="text-neutral-400 text-xs font-semibold">
                                                        Ngày tạo
                                                    </p>
                                                    <p className="text-xs font-medium text-neutral-300">
                                                        {formatDate(ticket.createdAt)} (
                                                        {formatRelativeTime(ticket.createdAt)})
                                                    </p>
                                                </div>
                                                <div className="flex justify-between items-center bg-darkBackgroundV1/40 p-2 rounded-lg border border-darkBorderV1/50">
                                                    <p className="text-neutral-400 text-xs font-semibold">
                                                        Độ ưu tiên
                                                    </p>
                                                    <Badge
                                                        variant={getPriorityVariant(ticket.priority || "LOW")}
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
                                        </div>
                                    </div>

                                    <Separator className="bg-darkBorderV1" />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs text-white uppercase font-bold ">
                                                Cập nhật trạng thái
                                            </Label>
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
                                                    <SelectItem value="IN_PROGRESS">
                                                        Đang xử lý
                                                    </SelectItem>
                                                    <SelectItem value="RESOLVED">
                                                        Đã giải quyết
                                                    </SelectItem>
                                                    <SelectItem value="CLOSED">Đã đóng</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        {/* Assign Ticket Section */}
                                        <div className="space-y-2">
                                            <Label className="text-xs text-white uppercase font-bold ">
                                                {ticket.assignedTo ? "Người xử lý" : "Phân công xử lý"}
                                            </Label>
                                            <div className="flex gap-2">
                                                <Select
                                                    value={assignedTo}
                                                    onValueChange={setAssignedTo}
                                                    disabled={isAssigning}
                                                >
                                                    <SelectTrigger className="flex-1">
                                                        <SelectValue
                                                            placeholder={
                                                                ticket.assignedTo || "Chọn người xử lý"
                                                            }
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {dispatchers.map((dispatcher: any) => (
                                                            <SelectItem
                                                                key={dispatcher.id}
                                                                value={dispatcher.id}
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">
                                                                        {dispatcher.name}
                                                                    </span>
                                                                    <span className="text-xs text-neutral-400">
                                                                        {dispatcher.email} • {dispatcher.phone}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    size="sm"
                                                    onClick={handleAssignTicket}
                                                    disabled={isAssigning || !assignedTo.trim()}
                                                >
                                                    <Icon path={mdiAccountArrowRight} size={0.6} />
                                                    {ticket.assignedTo ? "Cập nhật" : "Phân công"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator className="bg-darkBorderV1" />

                                    {/* Content Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <Icon
                                                path={mdiMessageTextOutline}
                                                size={0.8}
                                                className="text-primary"
                                            />
                                            <span className="font-semibold text-primary">
                                                Nội dung yêu cầu
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-base font-bold text-white">
                                                {ticket.subject}
                                            </h3>
                                            <div className="bg-darkBackgroundV1 px-4 py-3 rounded-lg border border-darkBorderV1/50 text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                                                {ticket.content}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        <Icon path={mdiClose} size={0.8} />
                        Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>

            <ConfirmDialog
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                description={confirmConfig.description}
                variant={confirmConfig.variant}
                isPending={isUpdating || isAssigning}
            />
        </Dialog>
    );
}
