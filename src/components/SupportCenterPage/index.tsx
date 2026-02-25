import { useState } from "react";
import { useSupportTickets, useUpdateSupportTicket } from "@/hooks/useDispatcher";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@mdi/react";
import { mdiTicketOutline, mdiMessageProcessing, mdiCheckDecagram, mdiAlertDecagram, mdiClockOutline, mdiPackageVariant, mdiInboxRemoveOutline } from "@mdi/js";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ISupportTicket } from "@/interface/dispatcher";
import { formatDate } from "@/lib/format";
import { motion } from "framer-motion";

export default function SupportCenterPage() {
    const [activeTab, setActiveTab] = useState<any>("OPEN");
    const [selectedTicket, setSelectedTicket] = useState<ISupportTicket | null>(null);
    const [note, setNote] = useState("");
    const [resolution, setResolution] = useState("");

    const { data: tickets, isLoading } = useSupportTickets({ status: activeTab });
    const updateMutation = useUpdateSupportTicket();

    const handleUpdate = (status: "IN_PROGRESS" | "RESOLVED" | "CLOSED") => {
        if (selectedTicket) {
            updateMutation.mutate({
                id: selectedTicket.id,
                data: {
                    status,
                    note,
                    resolution: status === 'RESOLVED' || status === 'CLOSED' ? resolution : undefined
                }
            }, {
                onSuccess: (updated) => {
                    setSelectedTicket(null);
                    setNote("");
                    setResolution("");
                }
            });
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'OPEN': return mdiAlertDecagram;
            case 'IN_PROGRESS': return mdiClockOutline;
            case 'RESOLVED': return mdiCheckDecagram;
            default: return mdiTicketOutline;
        }
    };

    return (
        <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-300">Trung tâm Hỗ trợ & Khiếu nại</h1>
                    <p className="text-sm text-neutral-400">Xử lý các yêu cầu hỗ trợ và sự cố từ khách hàng/tài xế.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
                {/* Left: Ticket List */}
                <Card className="bg-darkCardV1 border-darkBorderV1 flex flex-col min-h-0 shadow-2xl lg:col-span-1">
                    <CardHeader className="border-b border-b-darkBorderV1 py-3 bg-darkBackgroundV1/30">
                        <div className="flex items-center gap-2 mb-3">
                            <Icon path={mdiTicketOutline} size={0.8} />
                            <span className="font-semibold">Danh sách yêu cầu</span>
                        </div>
                        <div className="flex bg-darkBackgroundV1 p-1 rounded-xl gap-1">
                            {(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all uppercase tracking-wider",
                                        activeTab === tab ? "bg-primary text-black" : "text-neutral-400 hover:text-neutral-300"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
                        {isLoading ? (
                            <div className="py-20 flex justify-center"><LoadingSpinner /></div>
                        ) : tickets?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-neutral-400 italic gap-3">
                                <Icon path={mdiInboxRemoveOutline} size={1.6} className="opacity-60" />
                                <p>Không có yêu cầu nào</p>
                            </div>
                        ) : (
                            tickets?.map(ticket => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={cn(
                                        "p-3 rounded-xl border transition-all cursor-pointer",
                                        selectedTicket?.id === ticket.id
                                            ? "bg-primary/5 border-primary"
                                            : "bg-darkBackgroundV1/30 border-darkBorderV1 hover:bg-darkBackgroundV1/60"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-neutral-300 text-xs">#{ticket.id.slice(-6)}</span>
                                        <Icon path={getStatusIcon(ticket.status)} size={0.6} className={cn(
                                            ticket.status === 'OPEN' ? 'text-red-500' :
                                                ticket.status === 'IN_PROGRESS' ? 'text-yellow-500' : 'text-green-500'
                                        )} />
                                    </div>
                                    <p className="text-sm font-semibold text-neutral-300 truncate">{ticket.user}</p>
                                    <p className="text-xs text-neutral-400 mb-2">{formatDate(ticket.createdAt)}</p>
                                    <p className="text-xs text-neutral-400 line-clamp-2 italic">"{ticket.content}"</p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Right: Ticket Detail & Processing */}
                <Card className="bg-darkCardV1 border-darkBorderV1 flex flex-col min-h-0 shadow-2xl lg:col-span-2">
                    {selectedTicket ? (
                        <div className="flex flex-col h-full">
                            <CardHeader className="bg-darkBackgroundV1/30 border-b border-b-darkBorderV1 py-3 px-6">
                                <div className="flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <Badge className="mb-2 w-fit bg-primary/20 text-primary border-none">PHÂN LOẠI: PHỔ THÔNG</Badge>
                                        <div className="flex items-center gap-2">
                                            <Icon path={mdiMessageProcessing} size={0.8} />
                                            <span className="text-2xl font-bold text-neutral-300">{selectedTicket.user}</span>
                                            <span className="text-sm font-normal text-neutral-400">#{selectedTicket.id}</span>
                                        </div>
                                        <p className="text-neutral-400 font-medium mt-1">{selectedTicket.phone}</p>
                                    </div>
                                    <Badge className={cn("px-3 py-1 text-sm font-bold h-fit",
                                        selectedTicket.status === 'OPEN' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                            selectedTicket.status === 'IN_PROGRESS' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                'bg-green-500/10 text-green-500 border-green-500/20'
                                    )}>
                                        {selectedTicket.status}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                <div className="space-y-4">
                                    <div className="bg-darkBackgroundV1/50 rounded-2xl p-4 border border-darkBorderV1">
                                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Icon path={mdiMessageProcessing} size={0.6} /> Nội dung yêu cầu
                                        </h4>
                                        <p className="text-neutral-300 leading-relaxed text-lg italic">"{selectedTicket.content}"</p>
                                    </div>

                                    {selectedTicket.orderId && (
                                        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                                                    <Icon path={mdiPackageVariant} size={0.8} />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-400 font-bold uppercase">Đơn hàng liên quan</p>
                                                    <p className="text-primary font-bold">#{selectedTicket.orderId}</p>
                                                </div>
                                            </div>
                                            <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/5">
                                                Theo dõi đơn này
                                            </Button>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 block">Ghi chú diễn biến (Nội bộ)</label>
                                            <Textarea
                                                placeholder="Nhập diễn biến xử lý, thông tin từ các bên liên quan..."
                                                className="bg-darkBackgroundV1 border-darkBorderV1 min-h-[100px] focus:ring-1 focus:ring-primary/40"
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                            />
                                        </div>
                                        {(activeTab === 'IN_PROGRESS' || activeTab === 'OPEN') && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                                <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-2 block">Hướng giải quyết sau cùng</label>
                                                <Textarea
                                                    placeholder="Kết quả xử lý để phản hồi khách hàng..."
                                                    className="bg-darkBackgroundV1 border-darkBorderV1 min-h-[100px] focus:ring-1 focus:ring-primary/40 border-dashed border-primary/30"
                                                    value={resolution}
                                                    onChange={(e) => setResolution(e.target.value)}
                                                />
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>

                            <div className="p-6 border-t border-darkBorderV1 bg-darkBackgroundV1/20 flex gap-4">
                                {selectedTicket.status === 'OPEN' && (
                                    <Button
                                        onClick={() => handleUpdate('IN_PROGRESS')}
                                        className="flex-1 bg-yellow-500/80 hover:bg-yellow-500 text-black font-bold h-12"
                                        disabled={updateMutation.isPending}
                                    >
                                        Tiếp nhận xử lý
                                    </Button>
                                )}
                                {(selectedTicket.status === 'OPEN' || selectedTicket.status === 'IN_PROGRESS') && (
                                    <Button
                                        onClick={() => handleUpdate('RESOLVED')}
                                        className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold h-12"
                                        disabled={updateMutation.isPending || !resolution}
                                    >
                                        Đã giải quyết
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={() => handleUpdate('CLOSED')}
                                    className="flex-1 border-neutral-700 text-neutral-400 hover:bg-red-500/10 hover:text-red-500 h-12"
                                    disabled={updateMutation.isPending}
                                >
                                    Đóng Ticket
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 p-20 gap-4 opacity-30">
                            <Icon path={mdiTicketOutline} size={4} />
                            <p className="text-xl font-medium">Chọn một yêu cầu để xem chi tiết</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
