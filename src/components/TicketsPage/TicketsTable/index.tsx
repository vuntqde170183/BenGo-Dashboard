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
import { mdiTableEye, mdiCheckCircle } from "@mdi/js";

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
            <div className="text-center py-12 text-neutral-200">
                {isSearching ? "Không tìm thấy yêu cầu ticket nào" : "Chưa có yêu cầu ticket"}
            </div>
        );
    }

    return (
        <div className="w-full overflow-auto border border-darkBackgroundV1 rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">STT</TableHead>
                        <TableHead>Mã yêu cầu</TableHead>
                        <TableHead>Người dùng</TableHead>
                        <TableHead>Chủ đề</TableHead>
                        <TableHead>Độ ưu tiên</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
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
                                    className="text-primary hover:underline font-mono"
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
                            <TableCell className="text-sm text-neutral-200">
                                <div>
                                    <p>{formatDate(ticket.createdAt)}</p>
                                    <p className="text-xs text-neutral-400">
                                        {formatRelativeTime(ticket.createdAt)}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end space-x-2">
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
