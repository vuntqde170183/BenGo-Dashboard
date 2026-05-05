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
import { motion } from "framer-motion";
import { formatDate, formatRelativeTime, getPriorityVariant } from "@/lib/format";
import { getStatusBadge } from "@/lib/badge-helpers";
import Icon from "@mdi/react";
import { mdiTableEye, mdiInboxRemoveOutline } from "@mdi/js";
import { Skeleton } from "@/components/ui/skeleton";

interface TicketsTableProps {
    tickets: any[];
    isSearching: boolean;
    onViewDetails: (id: string) => void;
    currentPage: number;
    pageSize: number;
}

export function TicketsTable({
    tickets,
    isSearching,
    onViewDetails,
    currentPage,
    pageSize,
}: TicketsTableProps) {
    if (tickets.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-4 text-neutral-400 italic gap-3">
                <Icon path={mdiInboxRemoveOutline} size={1.6} className="opacity-60" />
                <p>{isSearching ? "Không tìm thấy yêu cầu ticket nào" : "Chưa có yêu cầu ticket"}</p>
            </div>
        );
    }

    return (
        <div className="w-full overflow-auto border border-darkBackgroundV1 rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>STT</TableHead>
                        <TableHead>Mã yêu cầu</TableHead>
                        <TableHead>Người dùng</TableHead>
                        <TableHead>Chủ đề</TableHead>
                        <TableHead>Độ ưu tiên</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tickets.map((ticket, index) => (
                        <TableRow
                            key={ticket._id}
                            className="cursor-pointer hover:bg-slate-50/50 dark:hover:bg-darkBorderV1/50 transition-colors"
                            onClick={() => onViewDetails(ticket._id)}
                        >
                            <TableCell className="font-medium">
                                {(currentPage - 1) * pageSize + index + 1}
                            </TableCell>
                            <TableCell>
                                <button
                                    onClick={() => onViewDetails(ticket._id)}
                                    className="text-primary hover:underline "
                                >
                                    #{ticket._id?.slice(-8)}
                                </button>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p className="font-medium">
                                        {ticket.userId?.name || "Ẩn danh"}
                                    </p>
                                    <p className="text-sm text-neutral-400">
                                        {ticket.userId?.phone || "N/A"}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="max-w-xs">
                                    <p className="font-medium truncate">{ticket.subject}</p>
                                    <p className="text-sm text-neutral-400 truncate">
                                        {ticket.content?.slice(0, 50)}...
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={getPriorityVariant(ticket.priority || "LOW")}>
                                    {ticket.priority === "URGENT"
                                        ? "Khẩn cấp"
                                        : ticket.priority === "HIGH"
                                            ? "Cao"
                                            : ticket.priority === "MEDIUM"
                                                ? "Trung bình"
                                                : "Thấp"}
                                </Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                            <TableCell className="text-sm text-neutral-300">
                                <div>
                                    <p>{formatDate(ticket.createdAt)}</p>
                                    <p className="text-xs text-neutral-400">
                                        {formatRelativeTime(ticket.createdAt)}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-2">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onViewDetails(ticket._id);
                                            }}
                                            title="Chi tiết"
                                        >
                                            <Icon path={mdiTableEye} size={0.8} />
                                        </Button>
                                    </motion.div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export const TicketsTableSkeleton = () => {
    return (
        <div className="w-full overflow-auto border border-darkBackgroundV1 rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>STT</TableHead>
                        <TableHead>Mã yêu cầu</TableHead>
                        <TableHead>Người dùng</TableHead>
                        <TableHead>Chủ đề</TableHead>
                        <TableHead>Độ ưu tiên</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>Thao tác</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-32" />
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell>
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
