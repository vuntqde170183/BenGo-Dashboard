import { useTicketDetails, useUpdateTicketStatus, useAssignTicket, useAdminUsers } from "@/hooks/useAdmin";
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
import { Input } from "@/components/ui/input";
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
    const { mutate: assignTicket, isPending: isAssigning } = useAssignTicket();

    // Fetch dispatchers list
    const { data: dispatchersResponse } = useAdminUsers({
        role: "DISPATCHER",
        per_page: 100
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
        const selectedDispatcher = dispatchers.find((d: any) => d.id === assignedTo);
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
            <DialogContent
                size="medium"
                className="bg-darkCardV1 border-darkBorderV1 max-h-[95vh]"
            >
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-start w-full text-primary">
                        <div className="flex items-center gap-2">
                            <Icon path={mdiTicket} size={0.8} />
                            <span>Chi tiết ticket #{ticket?._id?.slice(-8)}</span>
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
                        <p>Không tìm thấy thông tin chi tiết ticket</p>
                    </div>
                ) : (
                    <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar pb-6">
                        {/* Status Progress Bar */}
                        <div className="px-4 py-8">
                            {ticket.status === "CLOSED" ? (
                                <div className="flex flex-col items-center justify-center py-4 bg-slate-500/10 rounded-2xl border border-slate-500/20">
                                    <IconAlertCircle className="w-10 h-10 text-slate-500 mb-2" />
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
                                                width: `${(
                                                    ["OPEN", "IN_PROGRESS", "RESOLVED"].findIndex(
                                                        (s) => s === ticket.status,
                                                    ) / 2
                                                ) * 100}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="relative flex justify-between">
                                        {[
                                            {
                                                key: "OPEN",
                                                label: "Đang mở",
                                                icon: IconClock,
                                            },
                                            {
                                                key: "IN_PROGRESS",
                                                label: "Đang xử lý",
                                                icon: IconClipboardList,
                                            },
                                            {
                                                key: "RESOLVED",
                                                label: "Đã giải quyết",
                                                icon: IconAlertCircle,
                                            },
                                        ].map((step, index) => {
                                            const statusOrder = ["OPEN", "IN_PROGRESS", "RESOLVED"];
                                            const currentIndex = statusOrder.findIndex(
                                                (s) => s === ticket.status,
                                            );
                                            const isActive = currentIndex >= index;
                                            const isCurrent = ticket.status === step.key;
                                            const StepIcon = step.icon;

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
                                                        <StepIcon size={20} />
                                                    </div>
                                                    <span
                                                        className={cn(
                                                            "text-[10px] md:text-xs font-bold mt-2 uppercase tracking-tight transition-colors duration-300",
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* User Information Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <IconUserSquareRounded className="h-5 w-5 text-primary" />
                                            <span className="font-semibold text-primary">
                                                Người dùng
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-12 h-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-darkBackgroundV1">
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
                                                <div className="flex flex-col gap-2 pt-1">
                                                    <div className="flex items-center gap-1.5 text-neutral-400 group">
                                                        <IconPhone
                                                            size={16}
                                                            className="group-hover:text-primary transition-colors"
                                                        />
                                                        <span className="text-sm">
                                                            {ticket.userId?.phone || "N/A"}
                                                        </span>
                                                    </div>
                                                    {ticket.userId?.email && (
                                                        <div className="flex items-center gap-1.5 text-neutral-400 group">
                                                            <IconMail
                                                                size={16}
                                                                className="group-hover:text-primary transition-colors"
                                                            />
                                                            <span className="text-sm truncate max-w-[200px]">
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
                                            <IconClipboardList className="h-5 w-5 text-primary" />
                                            <span className="font-semibold text-primary">
                                                Thông tin ticket
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <p className="text-neutral-400 text-sm font-semibold">
                                                    Ngày tạo
                                                </p>
                                                <p className="text-sm font-medium text-neutral-200">
                                                    {formatDate(ticket.createdAt)} ({formatRelativeTime(ticket.createdAt)})
                                                </p>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-neutral-400 text-sm font-semibold">
                                                    Độ ưu tiên
                                                </p>
                                                <Badge variant={getPriorityVariant(ticket.priority || "LOW")}>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex-1 space-y-2">
                                        <p className="text-xs text-white uppercase font-bold tracking-wider">
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
                                    {/* Assign Ticket Section */}
                                    <div className="space-y-2">
                                        <p className="text-xs text-white uppercase font-bold tracking-wider">
                                            {ticket.assignedTo ? "Người xử lý" : "Phân công xử lý"}
                                        </p>
                                        {ticket.assignedTo ? (
                                            <div className="space-y-2">
                                                <p className="text-sm font-medium text-neutral-200">
                                                    {ticket.assignedTo}
                                                </p>
                                                <div className="flex gap-2">
                                                    <Select
                                                        value={assignedTo}
                                                        onValueChange={setAssignedTo}
                                                        disabled={isAssigning}
                                                    >
                                                        <SelectTrigger className="flex-1">
                                                            <SelectValue placeholder="Chọn người xử lý mới" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {dispatchers.map((dispatcher: any) => (
                                                                <SelectItem key={dispatcher.id} value={dispatcher.id}>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{dispatcher.name}</span>
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
                                                        Cập nhật
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex gap-2">
                                                <Select
                                                    value={assignedTo}
                                                    onValueChange={setAssignedTo}
                                                    disabled={isAssigning}
                                                >
                                                    <SelectTrigger className="flex-1 text-left">
                                                        <SelectValue placeholder="Chọn người xử lý" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {dispatchers.map((dispatcher: any) => (
                                                            <SelectItem key={dispatcher.id} value={dispatcher.id}>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{dispatcher.name}</span>
                                                                    <span className="text-xs text-neutral-400">
                                                                        {dispatcher.email}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    onClick={handleAssignTicket}
                                                    disabled={isAssigning || !assignedTo.trim()}
                                                >
                                                    Phân công
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator className="bg-darkBorderV1" />

                                {/* Content Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <IconMessage className="h-5 w-5 text-primary" />
                                        <span className="font-semibold text-primary">
                                            Nội dung yêu cầu
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-lg font-bold text-white">
                                            {ticket.subject}
                                        </h3>
                                        <div className="bg-darkBackgroundV1 px-4 py-3 rounded-lg border border-darkBorderV1/50 text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap">
                                            {ticket.content}
                                        </div>
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
                isPending={isUpdating || isAssigning}
            />
        </Dialog>
    );
}
