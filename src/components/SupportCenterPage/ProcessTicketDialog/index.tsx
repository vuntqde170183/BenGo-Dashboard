import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table";
import Icon from "@mdi/react";
import {
    mdiClockOutline,
    mdiCheckCircleOutline,
    mdiClose,
    mdiHandBackRightOutline,
    mdiTagOutline,
    mdiAccountOutline,
    mdiCardTextOutline
} from "@mdi/js";
import { ISupportTicket, TicketStatus } from "@/interface/dispatcher";

interface ProcessTicketDialogProps {
    isOpen: boolean;
    onClose: () => void;
    ticket: ISupportTicket | null;
    actionType: 'ACCEPT' | 'RESOLVE' | 'CLOSE' | null;
    onConfirm: (status: Exclude<TicketStatus, 'OPEN'>, note?: string, resolution?: string) => void;
    isPending: boolean;
}

export default function ProcessTicketDialog({
    isOpen,
    onClose,
    ticket,
    actionType,
    onConfirm,
    isPending
}: ProcessTicketDialogProps) {
    const [note, setNote] = useState("");
    const [resolution, setResolution] = useState("");

    useEffect(() => {
        if (isOpen) {
            setNote(ticket?.note || "");
            setResolution(ticket?.resolution || "");
        }
    }, [isOpen, ticket]);

    if (!ticket || !actionType) return null;

    const getTitle = () => {
        switch (actionType) {
            case 'ACCEPT': return "Tiếp nhận xử lý";
            case 'RESOLVE': return "Giải quyết yêu cầu";
            case 'CLOSE': return "Đóng phiếu hỗ trợ";
            default: return "";
        }
    };

    const getIcon = () => {
        switch (actionType) {
            case 'ACCEPT': return mdiClockOutline;
            case 'RESOLVE': return mdiCheckCircleOutline;
            case 'CLOSE': return mdiClose;
            default: return mdiHandBackRightOutline;
        }
    };

    const handleSubmit = () => {
        const statusMap: Record<string, Exclude<TicketStatus, 'OPEN'>> = {
            'ACCEPT': 'IN_PROGRESS',
            'RESOLVE': 'RESOLVED',
            'CLOSE': 'CLOSED'
        };

        onConfirm(
            statusMap[actionType],
            note || undefined,
            actionType === 'RESOLVE' || actionType === 'CLOSE' ? resolution || undefined : undefined
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && !isPending && onClose()}>
            <DialogContent size="small">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-primary">
                        <Icon path={getIcon()} size={0.8} />
                        <span>{getTitle()}</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar p-3 md:p-4">
                    <Card className="p-0 overflow-hidden border border-darkBorderV1 bg-transparent">
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-semibold text-neutral-400 w-1/3 py-2 bg-darkBackgroundV1/30">
                                        <div className="flex items-center gap-2 font-semibold text-neutral-300">
                                            <Icon path={mdiTagOutline} size={0.6} />
                                            Chủ đề
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-neutral-400">{ticket.subject}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-semibold text-neutral-400 py-2 bg-darkBackgroundV1/30">
                                        <div className="flex items-center gap-2 font-semibold text-neutral-300">
                                            <Icon path={mdiAccountOutline} size={0.6} />
                                            Người gửi
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-neutral-400">{ticket.userId?.name}</TableCell>
                                </TableRow>
                                <TableRow className="border-b-0">
                                    <TableCell className="font-semibold text-neutral-400 py-2 bg-darkBackgroundV1/30 align-top">
                                        <div className="flex items-center gap-2 font-semibold text-neutral-300">
                                            <Icon path={mdiCardTextOutline} size={0.6} />
                                            Nội dung
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-neutral-400 italic leading-relaxed">
                                        "{ticket.content}"
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>


                    {actionType === 'ACCEPT' && (
                        <div className="space-y-3">
                            <Label>Ghi chú diễn biến (Nội bộ)</Label>
                            <Textarea
                                placeholder="Ví dụ: Đã tiếp nhận yêu cầu, đang gọi cho tài xế Trần Văn B."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={4}
                            />
                        </div>
                    )}

                    {(actionType === 'RESOLVE' || actionType === 'CLOSE') && (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Label className="text-primary font-semibold whitespace-nowrap">Hướng giải quyết sau cùng</Label>
                                <div className="flex-1 border-b border-dashed border-primary mr-1" />
                            </div>
                            <Textarea
                                placeholder="Ví dụ: Đã điều phối tài xế khác đến hỗ trợ khách hàng. Khách hàng hài lòng."
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                rows={4}
                            />
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isPending}>
                        <Icon path={mdiClose} size={0.8} />
                        Hủy bỏ
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || (actionType === 'RESOLVE' && !resolution)}
                    >
                        <Icon path={getIcon()} size={0.8} />
                        {isPending ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}
