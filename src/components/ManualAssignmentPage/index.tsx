import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatcherOrders, useAssignDriver, useDriverLocations, useDriverPerformance, useAssignmentHistory } from "@/hooks/useDispatcher";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import { getVehicleIcon } from "@/lib/vehicle-helpers";
import Icon from "@mdi/react";
import {
    mdiMagnify,
    mdiAccountHardHat,
    mdiPackageVariant, mdiStar,
    mdiInboxRemoveOutline,
    mdiClockOutline,
    mdiLocationExit,
    mdiLocationEnter,
    mdiMapMarkerDistance,
    mdiPhone,
    mdiMapMarkerRadius, mdiSelectionMarker,
    mdiCommentArrowRight,
    mdiHistory,
    mdiAccountSettingsOutline,
    mdiContentCopy
} from "@mdi/js";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { IDispatcherOrder, IDriverMapLocation } from "@/interface/dispatcher";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AssignConfirmDialog } from "./AssignConfirmDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
export default function ManualAssignmentPage() {
    const [searchParams] = useSearchParams();
    const initialOrderId = searchParams.get("orderId");

    const [activeTab, setActiveTab] = useState("assignment");
    const [selectedOrder, setSelectedOrder] = useState<IDispatcherOrder | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<IDriverMapLocation | null>(null);
    const [searchOrder, setSearchOrder] = useState("");
    const [searchDriver, setSearchDriver] = useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [historyPage, setHistoryPage] = useState(1);
    const historyLimit = 10;

    const { data: pendingOrders, isLoading: isLoadingOrders } = useDispatcherOrders({ status: "PENDING" });
    const { data: historyData, isLoading: isLoadingHistory } = useAssignmentHistory({ page: historyPage, limit: historyLimit });

    const [radius, setRadius] = useState(5); // 5km default

    const { data: nearbyDrivers, isLoading: isLoadingNearby } = useDriverLocations({
        lat: selectedOrder?.pickup?.lat || 0,
        lng: selectedOrder?.pickup?.lng || 0,
        radius: radius
    });

    const drivers = nearbyDrivers;
    const isLoadingDrivers = isLoadingNearby;

    const { data: performance } = useDriverPerformance(selectedDriver?.id || "", {});

    const assignMutation = useAssignDriver();

    useEffect(() => {
        if (initialOrderId && pendingOrders && pendingOrders.length > 0 && !selectedOrder) {
            const order = pendingOrders.find(o => o._id === initialOrderId);
            if (order) setSelectedOrder(order);
        }
    }, [initialOrderId, pendingOrders, selectedOrder]);

    useEffect(() => {
        setSelectedDriver(null);
    }, [selectedOrder]);

    const handleAssign = () => {
        if (selectedOrder && selectedDriver) {
            assignMutation.mutate({
                orderId: selectedOrder._id,
                driverId: selectedDriver.id
            }, {
                onSuccess: () => {
                    setSelectedOrder(null);
                    setSelectedDriver(null);
                    setIsConfirmDialogOpen(false);
                }
            });
        }
    };

    const filteredOrders = pendingOrders?.filter((o: IDispatcherOrder) =>
        o._id.toLowerCase().includes(searchOrder.toLowerCase()) ||
        o.customerId?.name.toLowerCase().includes(searchOrder.toLowerCase()) ||
        o.customerId?.phone.includes(searchOrder)
    );

    const filteredDrivers = drivers?.filter(d =>
        d.name.toLowerCase().includes(searchDriver.toLowerCase()) ||
        (d.userId?.phone || d.phone || "").includes(searchDriver)
    );

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    return (
        <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/">Bảng điều khiển</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Phân chuyến thủ công</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4 p-1">
                    <TabsTrigger value="assignment" className="flex flex-row gap-1">
                        <Icon path={mdiAccountSettingsOutline} size={0.8} />
                        Điều phối đơn hàng
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex flex-row gap-1">
                        <Icon path={mdiHistory} size={0.8} />
                        Lịch sử phân chuyến
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="assignment" className="m-0 border-0 p-0 focus-visible:ring-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-320px)] min-h-[500px]">
                        {/* Left: Pending Orders */}
                        <Card className="bg-darkCardV1 border-darkBorderV1 flex flex-col min-h-0 shadow-2xl">
                            <CardHeader className="border-b border-b-darkBorderV1 py-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Icon path={mdiPackageVariant} size={0.8} />
                                        <span className="font-semibold text-primary">
                                            Đơn hàng chờ gán ({pendingOrders?.length || 0})
                                        </span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Icon path={mdiMagnify} size={0.8} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-neutral-400" />
                                    <Input
                                        placeholder="Tìm mã đơn, tên khách..."
                                        className="pl-10 bg-darkBackgroundV1 border-darkBorderV1 focus:ring-1 focus:ring-primary/30"
                                        value={searchOrder}
                                        onChange={(e) => setSearchOrder(e.target.value)}
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {isLoadingOrders ? (
                                    <div className="py-20 flex justify-center"><LoadingSpinner /></div>
                                ) : filteredOrders?.length === 0 ? (
                                    <div className="text-center text-neutral-400 text-sm py-10 italic flex items-center justify-center gap-1">
                                        <Icon path={mdiInboxRemoveOutline} size={0.8} />
                                        Không có đơn hàng chờ gán
                                    </div>
                                ) : (
                                    filteredOrders?.map((order: IDispatcherOrder) => (
                                        <motion.div
                                            key={order._id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => setSelectedOrder(order)}
                                            className={cn(
                                                "rounded-2xl border flex flex-col transition-all cursor-pointer group",
                                                selectedOrder?._id === order._id
                                                    ? "bg-primary/5 border-primary"
                                                    : "bg-darkBackgroundV1 border-darkBorderV1 hover:border-primary/40 hover:bg-darkBackgroundV1"
                                            )}
                                        >
                                            <div className="flex justify-between p-3 border-b border-b-darkBorderV1">
                                                <div className="flex flex-col">
                                                    <span className="text-primary text-sm font-semibold  mb-0.5">#{order._id.slice(-8)}</span>
                                                    <p className="text-neutral-300 group-hover:text-primary transition-colors text-sm truncate">
                                                        <strong>Khách hàng:</strong> {order.customerId?.name}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {order.priority && order.priority !== 'NORMAL' && (
                                                        <Badge variant="red">{order.priority}</Badge>
                                                    )}
                                                    <Badge variant="neutral">
                                                        {getVehicleIcon(order.vehicleType)}
                                                        <span className="font-semibold">{order.vehicleType}</span>
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="p-3 space-y-1">
                                                <div className="flex items-start gap-2 text-sm">
                                                    <Icon path={mdiLocationExit} size={0.6} className="text-green-500 mt-0.5 flex-shrink-0" />
                                                    <p className="text-neutral-400" title={order.pickup?.address}>
                                                        <strong>Điểm nhận hàng:</strong> {order.pickup?.address}</p>
                                                </div>
                                                <div className="flex items-start gap-2 text-sm">
                                                    <Icon path={mdiLocationEnter} size={0.6} className="text-red-500 mt-0.5 flex-shrink-0" />
                                                    <p className="text-neutral-400" title={order.dropoff?.address}><strong>Điểm giao hàng: </strong>{order.dropoff?.address}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between p-3 border-t border-darkBorderV1">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant="neutral">
                                                        <Icon path={mdiClockOutline} size={0.6} />
                                                        {formatRelativeTime(order.createdAt)}
                                                    </Badge>
                                                    <Badge variant="neutral">
                                                        <Icon path={mdiMapMarkerDistance} size={0.6} />
                                                        {order.distanceKm?.toFixed(1)} km
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-primary font-semibold text-lg">
                                                        {formatCurrency(order.totalPrice)}
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Right: Available Drivers */}
                        <Card className="bg-darkCardV1 border-darkBorderV1 flex flex-col min-h-0 shadow-2xl">
                            <CardHeader className="border-b border-b-darkBorderV1 py-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Icon path={mdiAccountHardHat} size={0.8} />
                                        <span className="font-semibold text-primary">
                                            Tài xế đang trực tuyến ({drivers?.length || 0})
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="relative">
                                        <Icon path={mdiMagnify} size={0.8} className="absolute left-3 z-10 top-1/2 -translate-y-1/2 text-neutral-400" />
                                        <Input
                                            placeholder="Tìm tên hoặc SĐT tài xế..."
                                            className="pl-10 bg-darkBackgroundV1 border-darkBorderV1 focus:ring-1 focus:ring-primary/30"
                                            value={searchDriver}
                                            onChange={(e) => setSearchDriver(e.target.value)}
                                        />
                                    </div>
                                    {selectedOrder && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm text-neutral-400 font-semibold whitespace-nowrap px-1">Bán kính:</span>
                                            <div className="flex gap-3 flex-1">
                                                {[1, 3, 5].map(r => (
                                                    <Button
                                                        key={r}
                                                        variant={radius === r ? "default" : "outline"}
                                                        className="flex-1 rounded-full"
                                                        onClick={() => setRadius(r)}
                                                    >
                                                        <Icon path={mdiMapMarkerRadius} size={0.8} />
                                                        {r}km
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                                {!selectedOrder ? (
                                    <div className="text-center text-neutral-400 text-sm py-20 italic flex flex-col items-center justify-center gap-3">
                                        <Icon path={mdiSelectionMarker} size={0.8} className="text-neutral-400" />
                                        <p>Vui lòng chọn một đơn hàng để tìm tài xế lân cận</p>
                                    </div>
                                ) : isLoadingDrivers ? (
                                    <div className="py-20 flex justify-center"><LoadingSpinner /></div>
                                ) : filteredDrivers?.length === 0 ? (
                                    <div className="text-center text-neutral-400 text-sm py-10 italic flex items-center justify-center gap-1">
                                        <Icon path={mdiInboxRemoveOutline} size={0.8} />
                                        Không tìm thấy tài xế trong bán kính {radius}km
                                    </div>
                                ) : (
                                    filteredDrivers?.map(driver => (
                                        <motion.div
                                            key={driver.id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => setSelectedDriver(driver)}
                                            className={cn(
                                                "rounded-2xl border flex flex-col transition-all cursor-pointer group",
                                                selectedDriver?.id === driver.id
                                                    ? "bg-primary/5 border-primary"
                                                    : "bg-darkBackgroundV1 border-darkBorderV1 hover:border-primary/40 hover:bg-darkBackgroundV1"
                                            )}
                                        >
                                            {/* Header: Avatar, Name, Rating */}
                                            <div className="flex justify-between p-3 border-b border-b-darkBorderV1">
                                                <div className="flex items-center w-full justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <Avatar className="w-10 h-10 border border-darkBorderV1">
                                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${driver.name}`} />
                                                                <AvatarFallback className="bg-darkBorderV1 text-primary text-sm">
                                                                    {driver.name.charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className={cn(
                                                                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-darkCardV1",
                                                                driver.status === 'ONLINE' ? 'bg-green-500' :
                                                                    driver.status === 'BUSY' ? 'bg-red-500' : 'bg-neutral-500'
                                                            )} />
                                                        </div>
                                                        <div className="flex flex-col min-w-0">
                                                            <p className="font-semibold text-neutral-300 group-hover:text-primary transition-colors text-sm truncate tracking-tight">
                                                                {driver.name}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 text-sm text-neutral-400">
                                                                <Icon path={mdiPhone} size={0.6} className="text-neutral-400" />
                                                                <span className="tabular-nums">{driver.userId?.phone || driver.phone || "---"}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {selectedDriver?.id === driver.id && selectedOrder && (
                                                        <Button
                                                            size="icon"
                                                            className="rounded-full shadow-lg shadow-primary/20"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setIsConfirmDialogOpen(true);
                                                            }}
                                                        >
                                                            <Icon path={mdiCommentArrowRight} size={0.8} />
                                                        </Button>
                                                    )}

                                                </div>

                                            </div>

                                            {/* Body/Footer: Location info & Performance */}
                                            <div className="flex items-center justify-between p-3 bg-darkBackgroundV1/30">
                                                <div className="flex items-center gap-2">
                                                    {selectedOrder && driver.location && (
                                                        <Badge variant="neutral">
                                                            <Icon path={mdiMapMarkerDistance} size={0.6} />
                                                            {calculateDistance(
                                                                selectedOrder.pickup.lat,
                                                                selectedOrder.pickup.lng,
                                                                driver.location.lat,
                                                                driver.location.lng
                                                            ).toFixed(1)} km
                                                        </Badge>
                                                    )}
                                                    <Badge variant="neutral">
                                                        {getVehicleIcon(driver.vehicleType || "")}
                                                        <span>{driver.vehicleType || "Chưa xác định"}</span>
                                                    </Badge>
                                                    <Badge variant="yellow">
                                                        <Icon path={mdiStar} size={0.6} />
                                                        {driver.rating?.toFixed(1) || "5.0"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="history" className="m-0 border-0 p-0 focus-visible:ring-0">
                    <Card className="p-0 overflow-hidden border border-darkBorderV1 bg-transparent">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã đơn</TableHead>
                                    <TableHead>Lộ trình</TableHead>
                                    <TableHead>Tài xế</TableHead>
                                    <TableHead>Loại xe</TableHead>
                                    <TableHead>Người điều phối</TableHead>
                                    <TableHead>Quãng đường</TableHead>
                                    <TableHead>Tổng tiền</TableHead>
                                    <TableHead>Ngày thực hiện</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoadingHistory ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-64 text-center">
                                            <LoadingSpinner />
                                        </TableCell>
                                    </TableRow>
                                ) : historyData?.data?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-64">
                                            <div className="text-center text-neutral-400 text-sm py-2 italic flex items-center justify-center gap-1">
                                                <Icon path={mdiHistory} size={0.8} />
                                                Chưa có lịch sử phân chuyến nào
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    historyData?.data?.map((item) => (
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
                                                    <Badge variant="neutral">
                                                        {item.driverId?.userId?.phone}
                                                    </Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="neutral">
                                                    {getVehicleIcon(item.driverId?.vehicleType || item.orderId?.vehicleType || "")}
                                                    {item.driverId?.vehicleType || item.orderId?.vehicleType || "N/A"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-neutral-300 text-sm">{item.dispatcherId?.name}</span>
                                                    <Badge variant="neutral">
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
                                    ))
                                )}
                            </TableBody>
                        </Table>

                        {historyData && historyData.total > historyLimit && (
                            <div className="p-4 border-t border-darkBorderV1">
                                <Pagination
                                    page={historyPage}
                                    pageSize={historyLimit}
                                    total={historyData.total}
                                    totalPages={Math.ceil(historyData.total / historyLimit)}
                                    onPageChange={setHistoryPage}
                                />
                            </div>
                        )}
                    </Card>
                </TabsContent>
            </Tabs>
            <AssignConfirmDialog
                isOpen={isConfirmDialogOpen}
                onClose={() => setIsConfirmDialogOpen(false)}
                onConfirm={handleAssign}
                order={selectedOrder}
                driver={selectedDriver}
                isPending={assignMutation.isPending}
                distance={selectedOrder && selectedDriver && selectedDriver.location ? calculateDistance(
                    selectedOrder.pickup.lat,
                    selectedOrder.pickup.lng,
                    selectedDriver.location.lat,
                    selectedDriver.location.lng
                ) : undefined}
            />
        </div >
    );
}
