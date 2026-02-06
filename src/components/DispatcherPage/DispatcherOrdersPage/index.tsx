import { useState, useEffect } from "react";
import { useDispatcherOrders, useSpecialOrders, useMarkOrderSpecial, useUnmarkOrderSpecial } from "@/hooks/useDispatcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@mdi/react";
import { mdiMagnify, mdiStar, mdiAlertCircleOutline, mdiPackageVariant, mdiStarOff } from "@mdi/js";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/format";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Link } from "react-router-dom";
import { IDispatcherOrder, SpecialPriority } from "@/interface/dispatcher";

export default function DispatcherOrdersPage() {
    const [activeTab, setActiveTab] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // State for Mark Special Dialog
    const [isMarkSpecialDialogOpen, setIsMarkSpecialDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [priority, setPriority] = useState<SpecialPriority>("VIP");
    const [specialNote, setSpecialNote] = useState("");

    const { data: normalOrders, isLoading: isLoadingNormal, refetch: refetchNormal } = useDispatcherOrders({
        status: (activeTab === "ALL" || activeTab === "SPECIAL") ? undefined : activeTab as any
    });

    const { data: specialOrders, isLoading: isLoadingSpecial, refetch: refetchSpecial } = useSpecialOrders();

    const markSpecialMutation = useMarkOrderSpecial();
    const unmarkSpecialMutation = useUnmarkOrderSpecial();

    // Polling every 30s
    useEffect(() => {
        const interval = setInterval(() => {
            refetchNormal();
            refetchSpecial();
        }, 30000);
        return () => clearInterval(interval);
    }, [refetchNormal, refetchSpecial]);

    const orders = activeTab === "SPECIAL" ? specialOrders : normalOrders;
    const isLoading = activeTab === "SPECIAL" ? isLoadingSpecial : isLoadingNormal;

    const filteredOrders = orders?.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerPhone.includes(searchQuery)
    );

    const handleOpenMarkSpecial = (order: IDispatcherOrder) => {
        setSelectedOrderId(order.id);
        setSpecialNote(order.specialNote || "");
        setPriority((order.priority as SpecialPriority) || "VIP");
        setIsMarkSpecialDialogOpen(true);
    };

    const handleMarkSpecial = () => {
        if (selectedOrderId) {
            markSpecialMutation.mutate({
                id: selectedOrderId,
                data: { priority, specialNote }
            }, {
                onSuccess: () => {
                    setIsMarkSpecialDialogOpen(false);
                    setSelectedOrderId(null);
                    setSpecialNote("");
                    refetchNormal();
                    refetchSpecial();
                }
            });
        }
    };

    const handleUnmarkSpecial = (id: string) => {
        unmarkSpecialMutation.mutate(id, {
            onSuccess: () => {
                refetchNormal();
                refetchSpecial();
            }
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-neutral-200">Quản lý đơn hàng</h1>
                <div className="flex items-center gap-2">
                    <Badge variant="emerald" className="py-1">
                        {specialOrders?.length || 0} Đơn VIP/Đặc biệt
                    </Badge>
                </div>
            </div>

            <Card className="bg-darkCardV1 border-darkBorderV1">
                <CardHeader className="border-b border-b-darkBorderV1 py-3 bg-darkBackgroundV1/30">
                    <div className="flex items-center gap-2 mb-3">
                        <Icon path={mdiPackageVariant} size={0.8} />
                        <span className="font-semibold">Chi tiết vận đơn & Điều phối</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                            <TabsList className="bg-darkBackgroundV1">
                                <TabsTrigger value="ALL">Tất cả</TabsTrigger>
                                <TabsTrigger value="PENDING">Chờ gán</TabsTrigger>
                                <TabsTrigger value="ACTIVE">Đang đi</TabsTrigger>
                                <TabsTrigger value="SPECIAL" className="text-yellow-500 font-bold">⭐ Đặc biệt</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <div className="relative w-full md:w-72">
                            <Icon path={mdiMagnify} size={0.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <Input
                                placeholder="Tìm mã đơn, tên, SĐT..."
                                className="pl-10 bg-darkBackgroundV1 border-darkBorderV1"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="py-20 flex justify-center"><LoadingSpinner /></div>
                    ) : (
                        <div className="rounded-md border border-darkBorderV1 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-darkBackgroundV1">
                                    <TableRow>
                                        <TableHead>Mã đơn</TableHead>
                                        <TableHead>Khách hàng</TableHead>
                                        <TableHead>Lộ trình</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Ưu tiên</TableHead>
                                        <TableHead>Ngày tạo</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders?.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-darkBorderV1/20 border-darkBorderV1">
                                            <TableCell className="font-mono text-primary font-medium">
                                                #{order.id.slice(-8)}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-neutral-200">{order.customerName}</p>
                                                    <p className="text-xs text-neutral-400">{order.customerPhone}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="max-w-[200px] truncate text-xs text-neutral-300">
                                                    <p className="truncate"><span className="text-green-500 mr-1">●</span>{order.from}</p>
                                                    <p className="truncate"><span className="text-red-500 mr-1">●</span>{order.to}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={order.status === 'PENDING' ? 'amber' : order.status === 'ACTIVE' ? 'sky' : 'secondary'}>
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {order.priority && order.priority !== 'NORMAL' ? (
                                                    <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/20">
                                                        {order.priority}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-neutral-500">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-neutral-400">
                                                {formatDate(order.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {order.status === 'PENDING' && (
                                                        <Link to={`/dispatcher/assignment?orderId=${order.id}`}>
                                                            <Button size="sm" variant="outline" className="h-8 border-primary text-primary hover:bg-primary/10">
                                                                Phân chuyến
                                                            </Button>
                                                        </Link>
                                                    )}

                                                    {order.priority && order.priority !== 'NORMAL' ? (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                                            onClick={() => handleUnmarkSpecial(order.id)}
                                                        >
                                                            <Icon path={mdiStarOff} size={0.6} className="mr-1" />
                                                            Gỡ VIP
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-8 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10"
                                                            onClick={() => handleOpenMarkSpecial(order)}
                                                        >
                                                            <Icon path={mdiStar} size={0.6} className="mr-1" />
                                                            Đánh dấu VIP
                                                        </Button>
                                                    )}

                                                    <Button size="sm" variant="ghost" className="h-8 text-neutral-400">
                                                        Chi tiết
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!filteredOrders || filteredOrders.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center text-neutral-500">
                                                Không tìm thấy đơn hàng nào.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Mark Special Dialog */}
            <Dialog open={isMarkSpecialDialogOpen} onOpenChange={setIsMarkSpecialDialogOpen}>
                <DialogContent size="small">
                    <DialogHeader>
                        <DialogTitle>Đánh dấu đơn hàng đặc biệt</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-400 uppercase">Mức độ ưu tiên</label>
                            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
                                <SelectTrigger className="bg-darkBackgroundV1 border-darkBorderV1">
                                    <SelectValue placeholder="Chọn mức độ..." />
                                </SelectTrigger>
                                <SelectContent className="bg-darkCardV1 border-darkBorderV1">
                                    <SelectItem value="VIP">VIP (Khách hàng quan trọng)</SelectItem>
                                    <SelectItem value="URGENT">Khẩn cấp (Giao ngay)</SelectItem>
                                    <SelectItem value="FRAGILE">Hàng dễ vỡ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-neutral-400 uppercase">Ghi chú đặc biệt</label>
                            <Textarea
                                placeholder="Nhập ghi chú cho tài xế hoặc điều phối viên..."
                                className="bg-darkBackgroundV1 border-darkBorderV1 min-h-[100px]"
                                value={specialNote}
                                onChange={(e) => setSpecialNote(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsMarkSpecialDialogOpen(false)}>Hủy</Button>
                        <Button
                            className="bg-primary text-black font-bold"
                            onClick={handleMarkSpecial}
                            disabled={markSpecialMutation.isPending}
                        >
                            {markSpecialMutation.isPending ? "Đang lưu..." : "Xác nhận đánh dấu"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
