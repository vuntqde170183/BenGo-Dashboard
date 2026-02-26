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
import { Badge } from "@/components/ui/badge";
import Icon from "@mdi/react";
import {
    mdiClockOutline,
    mdiCheckCircleOutline,
    mdiClose, mdiHandBackRightOutline
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
                <div className="space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar p-3">
                    <div className="bg-darkBackgroundV1/50 border border-darkBorderV1 rounded-2xl p-4 mb-2">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider">Thông tin phiếu</p>
                            <Badge variant="neutral" className="text-[10px] border-primary/30 text-primary/80">
                                #{ticket._id.slice(-8)}
                            </Badge>
                        </div>
                        <p className="text-sm text-neutral-300 font-semibold mb-2">Người gửi: {ticket.userId?.name}</p>
                        <div className="bg-darkBackgroundV1/80 rounded-xl p-3 border border-darkBorderV1/50">
                            <p className="text-[13px] italic text-neutral-400 leading-relaxed">"{ticket.content}"</p>
                        </div>
                    </div>

                    {actionType === 'ACCEPT' && (
                        <div className="space-y-3 px-1">
                            <Label className="text-[13px] text-neutral-300 font-bold flex items-center gap-2">
                                <span className="w-1 h-4 bg-primary rounded-full" />
                                Ghi chú diễn biến (Nội bộ)
                            </Label>
                            <Textarea
                                placeholder="Ví dụ: Đã tiếp nhận yêu cầu, đang gọi cho tài xế Trần Văn B."
                                className="bg-darkBackgroundV1 border-darkBorderV1 min-h-[120px] focus:ring-1 focus:ring-primary/40 rounded-2xl text-sm"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                            <p className="text-[11px] text-neutral-500 italic px-1">* Thông tin này dùng để tránh Dispatcher khác xử lý trùng lặp.</p>
                        </div>
                    )}

                    {(actionType === 'RESOLVE' || actionType === 'CLOSE') && (
                        <div className="space-y-3 px-1">
                            <Label className="text-[13px] text-neutral-300 font-bold flex items-center gap-2">
                                <span className="w-1 h-4 bg-green-500 rounded-full" />
                                Hướng giải quyết sau cùng
                            </Label>
                            <Textarea
                                placeholder="Ví dụ: Đã điều phối tài xế khác đến hỗ trợ khách hàng. Khách hàng hài lòng."
                                className="bg-darkBackgroundV1 border-green-500/30 min-h-[120px] focus:ring-1 focus:ring-green-500/40 rounded-2xl text-sm"
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                            />
                            <p className="text-[11px] text-neutral-500 italic px-1">* Thông tin này sẽ được lưu lại để đối soát và phản hồi khách hàng.</p>
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
