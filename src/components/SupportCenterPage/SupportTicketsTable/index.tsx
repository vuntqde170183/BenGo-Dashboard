import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import Icon from "@mdi/react";
import {
    mdiClockOutline,
    mdiCheckCircleOutline, mdiInboxRemoveOutline
} from "@mdi/js";
import { ISupportTicket, TicketStatus } from "@/interface/dispatcher";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SupportTicketsTableProps {
    tickets: ISupportTicket[];
    onAccept: (ticket: ISupportTicket) => void;
    onResolve: (ticket: ISupportTicket) => void;
    onClose: (ticket: ISupportTicket) => void;
    currentPage: number;
    pageSize: number;
}

export function SupportTicketsTable({
    tickets,
    onAccept,
    onResolve,
    onClose,
    currentPage,
    pageSize,
}: SupportTicketsTableProps) {

    const getPriorityVariant = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'red';
            case 'HIGH': return 'orange';
            case 'MEDIUM': return 'amber';
            case 'LOW': return 'green';
            default: return 'neutral';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'URGENT': return 'Khẩn cấp';
            case 'HIGH': return 'Cao';
            case 'MEDIUM': return 'Trung bình';
            case 'LOW': return 'Thấp';
            default: return priority;
        }
    };

    const getStatusVariant = (status: TicketStatus) => {
        switch (status) {
            case 'OPEN': return 'red';
            case 'IN_PROGRESS': return 'orange';
            case 'RESOLVED': return 'green';
            case 'CLOSED': return 'neutral';
            default: return 'neutral';
        }
    };

    const getStatusLabel = (status: TicketStatus) => {
        switch (status) {
            case 'OPEN': return 'Mới tiếp nhận';
            case 'IN_PROGRESS': return 'Đang xử lý';
            case 'RESOLVED': return 'Đã giải quyết';
            case 'CLOSED': return 'Đã đóng';
            default: return status;
        }
    };

    if (tickets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400 italic gap-3">
                <Icon path={mdiInboxRemoveOutline} size={1.6} className="opacity-60" />
                <p>Không có yêu cầu hỗ trợ nào</p>
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Mã phiếu</TableHead>
                    <TableHead>Ưu tiên</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead className="max-w-[300px]">Nội dung</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tickets.map((ticket, index) => (
                    <TableRow key={ticket._id} className="hover:bg-slate-50/5 dark:hover:bg-darkBorderV1/50 transition-colors">
                        <TableCell className="font-medium">
                            {(currentPage - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell className=" text-primary">
                            #{ticket._id.slice(-8)}
                        </TableCell>
                        <TableCell>
                            <Badge variant={getPriorityVariant(ticket.priority)}>
                                {getPriorityLabel(ticket.priority)}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-1">
                                <p className="font-semibold text-neutral-400">
                                    {ticket.userId?.name || "N/A"}
                                </p>
                                <Badge variant="neutral">
                                    {ticket.userId?.phone || "N/A"}
                                </Badge>
                            </div>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                            <div className="space-y-1">
                                {ticket.subject && (
                                    <p className="text-sm font-semibold text-primary/90 truncate">
                                        {ticket.subject}
                                    </p>
                                )}
                                <p className="text-sm text-neutral-400 line-clamp-2 italic">
                                    "{ticket.content}"
                                </p>
                            </div>
                        </TableCell>
                        <TableCell className="text-sm text-neutral-400">
                            <Badge variant="neutral">
                                {formatDate(ticket.createdAt)}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(ticket.status)}>
                                {getStatusLabel(ticket.status)}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                {ticket.status === 'OPEN' && (
                                    <Button
                                        onClick={() => onAccept(ticket)}
                                    >
                                        <Icon path={mdiClockOutline} size={0.8} />
                                        Tiếp nhận xử lý
                                    </Button>

                                )}
                                {(ticket.status === 'OPEN' || ticket.status === 'IN_PROGRESS') && (

                                    <Button
                                        onClick={() => onResolve(ticket)}
                                    >
                                        <Icon path={mdiCheckCircleOutline} size={0.8} />
                                        Ghi nhận kết quả
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

export const SupportTicketsTableSkeleton = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>STT</TableHead>
                    <TableHead>Mã phiếu</TableHead>
                    <TableHead>Ưu tiên</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                        <TableCell>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-4 w-full max-w-[200px]" />
                            </div>
                        </TableCell>
                        <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-28 rounded-md" />
                                <Skeleton className="h-10 w-32 rounded-md" />
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
