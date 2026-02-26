import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { IDispatcherOrder, IDriverMapLocation } from "@/interface/dispatcher";
import { formatCurrency } from "@/lib/format";
import Icon from "@mdi/react";
import {
    mdiAccountHardHat,
    mdiMapMarkerDistance,
    mdiLocationExit,
    mdiLocationEnter,
    mdiClose,
    mdiCheckCircleOutline,
    mdiCommentQuestionOutline,
    mdiPhone
} from "@mdi/js";

interface AssignConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    order: IDispatcherOrder | null;
    driver: IDriverMapLocation | null;
    isPending: boolean;
    distance?: number;
}

export function AssignConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    order,
    driver,
    isPending,
    distance
}: AssignConfirmDialogProps) {
    if (!order || !driver) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent size="small">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary">
                        <Icon path={mdiCommentQuestionOutline} size={0.8} />
                        <span>Xác nhận gán chuyến</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 md:space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar p-3 md:p-4">
                    {/* Order Details Header */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <h3 className="text-primary font-semibold whitespace-nowrap">Thông tin đơn hàng</h3>
                        <div className="flex-1 border-b border-dashed border-primary mr-1" />
                    </div>

                    <Card className="p-0 overflow-hidden border border-darkBorderV1 bg-transparent">
                        <Table className="border-0">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-1/3 text-neutral-300 font-semibold">Mã đơn hàng</TableCell>
                                    <TableCell className="font-semibold text-primary">#{order._id.slice(-8)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-neutral-300 font-semibold">Khách hàng</TableCell>
                                    <TableCell className="text-neutral-400">{order.customerId?.name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-neutral-300 font-semibold">Loại xe</TableCell>
                                    <TableCell>
                                        <Badge variant="neutral">{order.vehicleType}</Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-neutral-300 font-semibold align-top">Điểm nhận</TableCell>
                                    <TableCell className="flex items-start gap-2">
                                        <Icon path={mdiLocationExit} size={0.6} className="text-green-500 mt-1 flex-shrink-0" />
                                        <span className="line-clamp-2 text-neutral-400">{order.pickup.address}</span>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-neutral-300 font-semibold align-top">Điểm giao</TableCell>
                                    <TableCell className="flex items-start gap-2">
                                        <Icon path={mdiLocationEnter} size={0.6} className="text-red-500 mt-1 flex-shrink-0" />
                                        <span className="line-clamp-2 text-neutral-400">{order.dropoff.address}</span>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-neutral-300 font-semibold">Khoảng cách</TableCell>
                                    <TableCell>
                                        <Badge variant="neutral">
                                            <Icon path={mdiMapMarkerDistance} size={0.6} />
                                            Quãng đường giao hàng: {order.distanceKm.toFixed(1)} km
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                                <TableRow className="bg-primary/5">
                                    <TableCell className="text-primary font-semibold">Tổng tiền</TableCell>
                                    <TableCell className="text-lg text-primary font-semibold">{formatCurrency(order.totalPrice)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Driver Details Header */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <h3 className="text-primary font-semibold whitespace-nowrap">Tài xế nhận chuyến</h3>
                        <div className="flex-1 border-b border-dashed border-primary mr-1" />
                    </div>

                    <Card className="p-0 overflow-hidden border border-darkBorderV1 bg-transparent">
                        <Table className="border-0">
                            <TableBody>
                                <TableRow>
                                    <TableCell className="w-1/3 text-neutral-300 font-semibold">Tên tài xế</TableCell>
                                    <TableCell className="font-semibold flex items-center gap-2 text-primary">
                                        <Icon path={mdiAccountHardHat} size={0.6} />
                                        {driver.name}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-neutral-300 font-semibold">Số điện thoại</TableCell>
                                    <TableCell className="tabular-nums">
                                        <Icon path={mdiPhone} size={0.6} className="text-neutral-400 inline mr-2" />
                                        {driver.userId?.phone || driver.phone || "---"}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="text-neutral-300 font-semibold">Phương tiện</TableCell>
                                    <TableCell>
                                        <Badge variant="neutral">{driver.vehicleType || "Chưa xác định"}</Badge>
                                    </TableCell>
                                </TableRow>
                                {distance !== undefined && (
                                    <TableRow>
                                        <TableCell className="text-neutral-300 font-semibold">Khoảng cách</TableCell>
                                        <TableCell>
                                            <Badge variant="neutral">
                                                <Icon path={mdiMapMarkerDistance} size={0.6} />
                                                Cách điểm nhận {distance.toFixed(1)} km
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isPending}>
                        <Icon path={mdiClose} size={0.8} />
                        Hủy bỏ
                    </Button>
                    <Button
                        disabled={isPending}
                        onClick={onConfirm}
                    >
                        <Icon path={mdiCheckCircleOutline} size={0.8} />
                        {isPending ? "Đang gán..." : "Xác nhận gán"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
