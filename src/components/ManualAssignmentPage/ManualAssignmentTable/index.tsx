import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { formatCurrency } from "@/lib/format";
import { getVehicleIcon } from "@/lib/vehicle-helpers";
import Icon from "@mdi/react";
import {
    mdiHistory,
    mdiLocationExit,
    mdiLocationEnter,
    mdiContentCopy
} from "@mdi/js";
import { toast } from "react-toastify";
import { IAssignmentHistory } from "@/interface/dispatcher";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface ManualAssignmentTableProps {
    data: IAssignmentHistory[] | undefined;
    isLoading: boolean;
    total: number;
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
}

export function ManualAssignmentTable({
    data,
    isLoading,
    total,
    page,
    pageSize,
    onPageChange
}: ManualAssignmentTableProps) {
    if (isLoading) {
        return <ManualAssignmentTableSkeleton />;
    }

    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-neutral-400 text-sm italic gap-2 border border-darkBorderV1 rounded-md">
                <Icon path={mdiHistory} size={1} className="opacity-50" />
                <span>Chưa có lịch sử phân chuyến nào</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <Card className="p-0 overflow-hidden border border-lightBorderV1 dark:border-darkBackgroundV1">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Mã đơn</TableHead>
                            <TableHead>Lộ trình</TableHead>
                            <TableHead>Tài xế</TableHead>
                            <TableHead>Loại xe</TableHead>
                            <TableHead>Người điều phối</TableHead>
                            <TableHead>Quãng đường</TableHead>
                            <TableHead>Tổng tiền</TableHead>
                            <TableHead>Ngày thực hiện</TableHead>
                            <TableHead className="text-center">Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item._id} className="border-b border-darkBorderV1/50 hover:bg-white/5 transition-colors">
                                <TableCell className="font-semibold text-primary text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-1 group/copy">
                                            <span>#{item.orderId?._id?.slice(-8) || "---"}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => {
                                                    if (item.orderId?._id) {
                                                        navigator.clipboard.writeText(item.orderId._id);
                                                        toast.success("Đã sao chép mã đơn hàng");
                                                    }
                                                }}
                                            >
                                                <Icon path={mdiContentCopy} size={0.6} />
                                            </Button>
                                        </div>
                                        {item.orderId?.priority && item.orderId?.priority !== 'NORMAL' && (
                                            <Badge variant="red" className="text-xs px-1 h-3.5 leading-none">
                                                {item.orderId.priority}
                                            </Badge>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1 max-w-[300px]">
                                        <div className="flex items-start gap-1.5 text-sm">
                                            <Icon path={mdiLocationExit} size={0.6} className="text-green-500 mt-0.5" />
                                            <span className="text-neutral-300 truncate" title={item.orderId?.pickup?.address}>
                                                {item.orderId?.pickup?.address}
                                            </span>
                                        </div>
                                        <div className="flex items-start gap-1.5 text-sm">
                                            <Icon path={mdiLocationEnter} size={0.6} className="text-red-500 mt-0.5" />
                                            <span className="text-neutral-300 truncate" title={item.orderId?.dropoff?.address}>
                                                {item.orderId?.dropoff?.address}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="min-w-[150px]">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-neutral-300 text-sm">{item.driverId?.userId?.name}</span>
                                        <Badge variant="neutral" className="w-fit">
                                            {item.driverId?.userId?.phone}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="neutral" className="w-fit">
                                        {getVehicleIcon(item.driverId?.vehicleType || item.orderId?.vehicleType || "")}
                                        {item.driverId?.vehicleType || item.orderId?.vehicleType || "N/A"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-neutral-300 text-sm">{item.dispatcherId?.name}</span>
                                        <Badge variant="neutral" className="w-fit">
                                            {item.dispatcherId?.phone}
                                        </Badge>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="neutral">
                                        {item.orderId?.distanceKm?.toFixed(1)} km
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-semibold text-primary text-sm">
                                    {formatCurrency(item.orderId?.totalPrice || 0)}
                                </TableCell>
                                <TableCell className="text-neutral-400">
                                    <Badge variant="neutral">
                                        <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                                        <span>{new Date(item.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={item.status === "SUCCESS" ? "green" : "neutral"}>
                                        {item.status === "SUCCESS" ? "Thành công" : item.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {total > pageSize && (
                <div className="mt-2">
                    <Pagination
                        page={page}
                        pageSize={pageSize}
                        total={total}
                        totalPages={Math.ceil(total / pageSize)}
                        onPageChange={onPageChange}
                    />
                </div>
            )}
        </div>
    );
}

export function ManualAssignmentTableSkeleton() {
    return (
        <Card className="p-0 overflow-hidden border border-lightBorderV1 dark:border-darkBackgroundV1">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Mã đơn</TableHead>
                        <TableHead>Lộ trình</TableHead>
                        <TableHead>Tài xế</TableHead>
                        <TableHead>Loại xe</TableHead>
                        <TableHead>Người điều phối</TableHead>
                        <TableHead>Quãng đường</TableHead>
                        <TableHead>Tổng tiền</TableHead>
                        <TableHead>Ngày thực hiện</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="text-center"><Skeleton className="h-4 w-20 mx-auto" /></TableCell>
                            <TableCell>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-40" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-32 rounded-full" />
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                            <TableCell>
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-32 rounded-full" />
                                </div>
                            </TableCell>
                            <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                            <TableCell><Skeleton className="h-8 w-24 rounded-full" /></TableCell>
                            <TableCell className="text-center"><Skeleton className="h-6 w-20 rounded-full mx-auto" /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}
