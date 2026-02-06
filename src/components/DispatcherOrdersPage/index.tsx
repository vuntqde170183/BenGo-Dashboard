
import { useState, useEffect } from "react";
import { useDispatcherOrders, useSpecialOrders, useMarkOrderSpecial, useUnmarkOrderSpecial } from "@/hooks/useDispatcher";
import { mdiStar, mdiStarOff, mdiTableEye, mdiAccountPlus } from "@mdi/js";
import { Icon } from "@mdi/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { IconSearch, IconX } from "@tabler/icons-react";
import { motion } from "framer-motion";
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
import { Pagination } from "@/components/ui/pagination";
import { formatDate } from "@/lib/format";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Link } from "react-router-dom";
import { IDispatcherOrder, SpecialPriority } from "@/interface/dispatcher";
import { getOrderStatusBadge } from "@/lib/badge-helpers";

export default function DispatcherOrdersPage() {
    const [activeTab, setActiveTab] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // State for Mark Special Dialog
    const [isMarkSpecialDialogOpen, setIsMarkSpecialDialogOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [priority, setPriority] = useState<SpecialPriority>("VIP");
    const [specialNote, setSpecialNote] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const { data: normalOrders, isLoading: isLoadingNormal, refetch: refetchNormal } = useDispatcherOrders({
        status: (activeTab === "ALL" || activeTab === "SPECIAL") ? undefined : activeTab as any,
        page: currentPage,
        limit: pageSize,
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

    const orders = activeTab === "SPECIAL" ? specialOrders : normalOrders?.data || [];
    const isLoading = activeTab === "SPECIAL" ? isLoadingSpecial : isLoadingNormal;

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const filteredOrders = orders?.filter((o: IDispatcherOrder) =>
        o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerId?.phone.includes(searchQuery)
    );

    const handleOpenMarkSpecial = (order: IDispatcherOrder) => {
        setSelectedOrderId(order._id);
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
        <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
            <div className="flex justify-between items-center">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dispatcher">Điều phối</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Quản lý đơn hàng</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="flex items-center gap-2">
                    <Badge variant="emerald" className="py-1">
                        {specialOrders?.length || 0} Đơn VIP/Đặc biệt
                    </Badge>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4 w-full">
                        <div className="relative w-full md:w-96">
                            <Input
                                placeholder="Tìm kiếm theo mã đơn, khách hàng..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-10 py-2 w-full focus:border-mainTextHoverV1 dark:text-neutral-200 bg-darkBackgroundV1 border-darkBorderV1"
                            />
                            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-neutral-200 hover:text-red-500 transition-colors"
                                    type="button"
                                >
                                    <IconX className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="flex-wrap h-auto">
                                <TabsTrigger value="ALL">Tất cả</TabsTrigger>
                                <TabsTrigger value="PENDING">Chờ gán</TabsTrigger>
                                <TabsTrigger value="ACTIVE">Đang đi</TabsTrigger>
                                <TabsTrigger value="SPECIAL">⭐ Đặc biệt</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <Card className="p-0 overflow-hidden border border-lightBorderV1 dark:border-darkBorderV1 bg-transparent">
                        <CardContent className="p-0">
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
                                            {filteredOrders?.map((order: any) => (
                                                <TableRow key={order._id} className="hover:bg-darkBorderV1/20 border-darkBorderV1">
                                                    <TableCell className="font-mono text-primary font-medium">
                                                        #{order._id.slice(-8)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <p className="font-medium text-neutral-200">{order.customerId?.name}</p>
                                                            <p className="text-sm text-neutral-400">{order.customerId?.phone}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="max-w-[200px] truncate text-sm text-neutral-300">
                                                            <p className="truncate"><span className="text-green-500 mr-1">●</span>{order.pickup?.address}</p>
                                                            <p className="truncate"><span className="text-red-500 mr-1">●</span>{order.dropoff?.address}</p>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {getOrderStatusBadge(order.status)}
                                                    </TableCell>
                                                    <TableCell>
                                                        {order.priority && order.priority !== 'NORMAL' ? (
                                                            <Badge variant="yellow">
                                                                {order.priority}
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-neutral-500">-</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-neutral-400">
                                                        {formatDate(order.createdAt)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {order.status === 'PENDING' && (
                                                                <Link to={`/dispatcher/assignment?orderId=${order._id}`}>
                                                                    <motion.div
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                    >
                                                                        <Button
                                                                            size="icon"
                                                                            variant="outline"
                                                                            title="Phân chuyến"
                                                                        >
                                                                            <Icon path={mdiAccountPlus} size={0.8} />
                                                                        </Button>
                                                                    </motion.div>
                                                                </Link>
                                                            )}

                                                            {order.priority && order.priority !== 'NORMAL' ? (
                                                                <motion.div
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    <Button
                                                                        size="icon"
                                                                        variant="destructive"
                                                                        onClick={() => handleUnmarkSpecial(order._id)}
                                                                        title="Gỡ VIP"
                                                                    >
                                                                        <Icon path={mdiStarOff} size={0.8} />
                                                                    </Button>
                                                                </motion.div>
                                                            ) : (
                                                                <motion.div
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                >
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="bg-yellow-600 hover:bg-yellow-500 text-white"
                                                                        onClick={() => handleOpenMarkSpecial(order)}
                                                                        title="Đánh dấu VIP"
                                                                    >
                                                                        <Icon path={mdiStar} size={0.8} />
                                                                    </Button>
                                                                </motion.div>
                                                            )}

                                                            <motion.div
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <Button
                                                                    size="icon"
                                                                    title="Chi tiết"
                                                                >
                                                                    <Icon path={mdiTableEye} size={0.8} />
                                                                </Button>
                                                            </motion.div>
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

                    {(activeTab !== "SPECIAL" && normalOrders?.pagination?.total > pageSize) && (
                        <Pagination
                            page={currentPage}
                            pageSize={pageSize}
                            total={normalOrders?.pagination?.total ?? 0}
                            totalPages={
                                normalOrders?.pagination?.total_pages ||
                                Math.ceil((normalOrders?.pagination?.total ?? 0) / pageSize)
                            }
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </motion.div>

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
