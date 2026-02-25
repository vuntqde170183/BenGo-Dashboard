import { useState, useEffect } from "react";
import { useDispatcherOrders, useAllDrivers, useAssignDriver, useDriverLocations, useDriverPerformance } from "@/hooks/useDispatcher";
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
    mdiPackageVariant,
    mdiChevronRight,
    mdiStar,
    mdiInboxRemoveOutline,
    mdiClockOutline,
    mdiLocationExit,
    mdiLocationEnter,
    mdiMapMarkerDistance,
    mdiPhone,
    mdiMapMarkerRadius, mdiCheckCircleOutline
} from "@mdi/js";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { IDispatcherOrder, IDriverMapLocation } from "@/interface/dispatcher";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
export default function ManualAssignmentPage() {
    const [searchParams] = useSearchParams();
    const initialOrderId = searchParams.get("orderId");

    const [selectedOrder, setSelectedOrder] = useState<IDispatcherOrder | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<IDriverMapLocation | null>(null);
    const [searchOrder, setSearchOrder] = useState("");
    const [searchDriver, setSearchDriver] = useState("");

    const { data: pendingOrders, isLoading: isLoadingOrders } = useDispatcherOrders({ status: "PENDING" });

    const [radius, setRadius] = useState(5000); // 5km default

    const { data: nearbyDrivers, isLoading: isLoadingNearby } = useDriverLocations({
        lat: selectedOrder?.pickup?.lat || 0,
        lng: selectedOrder?.pickup?.lng || 0,
        radius: radius
    });

    const { data: allDrivers, isLoading: isLoadingAll } = useAllDrivers();

    const drivers = selectedOrder ? nearbyDrivers : allDrivers;
    const isLoadingDrivers = selectedOrder ? isLoadingNearby : isLoadingAll;

    const { data: performance } = useDriverPerformance(selectedDriver?.id || "", {});

    const assignMutation = useAssignDriver();

    useEffect(() => {
        if (initialOrderId && pendingOrders && pendingOrders.length > 0 && !selectedOrder) {
            const order = (pendingOrders as IDispatcherOrder[]).find(o => o._id === initialOrderId);
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
                }
            });
        }
    };

    const filteredOrders = pendingOrders?.filter((o: any) =>
        o._id.toLowerCase().includes(searchOrder.toLowerCase()) ||
        o.customerId?.name.toLowerCase().includes(searchOrder.toLowerCase()) ||
        o.customerId?.phone.includes(searchOrder)
    );

    const filteredDrivers = drivers?.filter(d =>
        d.name.toLowerCase().includes(searchDriver.toLowerCase()) ||
        d.phone.includes(searchDriver)
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
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
                                            <span className="text-primary text-sm font-bold uppercase tracking-wider mb-0.5">#{order._id.slice(-8)}</span>
                                            <p className="text-neutral-300 group-hover:text-primary transition-colors text-sm truncate">
                                                <strong>Khách hàng:</strong> {order.customerId?.name}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {order.priority && order.priority !== 'NORMAL' && (
                                                <Badge variant="red">{order.priority}</Badge>
                                            )}
                                            <Badge variant="neutral" className="text-xs">
                                                {getVehicleIcon(order.vehicleType)}
                                                <span className="font-medium">{order.vehicleType}</span>
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
                                            <span className="text-primary font-bold text-lg">
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
                                    {selectedOrder ? `Tài xế lân cận` : `Tài xế sẵn sàng`} ({drivers?.length || 0})
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
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
                                    <span className="text-sm text-neutral-400 font-bold uppercase whitespace-nowrap px-1">Bán kính:</span>
                                    <div className="flex gap-1 flex-1">
                                        {[1000, 3000, 5000, 10000].map(r => (
                                            <Button
                                                key={r}
                                                variant={radius === r ? "default" : "outline"}
                                                className="flex-1"
                                                onClick={() => setRadius(r)}
                                            >
                                                <Icon path={mdiMapMarkerRadius} size={0.8} />
                                                {r / 1000}km
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {isLoadingDrivers ? (
                            <div className="py-20 flex justify-center"><LoadingSpinner /></div>
                        ) : filteredDrivers?.length === 0 ? (
                            <div className="text-center text-neutral-400 text-sm py-10 italic flex items-center justify-center gap-1">
                                <Icon path={mdiInboxRemoveOutline} size={0.8} />
                                Không tìm thấy tài xế
                            </div>
                        ) : (
                            filteredDrivers?.map(driver => (
                                <motion.div
                                    key={driver.id}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setSelectedDriver(driver)}
                                    className={cn(
                                        "p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group",
                                        selectedDriver?.id === driver.id
                                            ? "bg-primary/5 border-primary"
                                            : "bg-darkBackgroundV1/50 border-darkBorderV1 hover:border-primary/40 hover:bg-darkBackgroundV1"
                                    )}
                                >
                                    <div className="relative">
                                        <div className="w-12 h-12 rounded-2xl bg-darkBorderV1 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary/20 transition-all border border-darkBorderV1">
                                            {driver.name.charAt(0)}
                                        </div>
                                        <div className={cn(
                                            "absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-darkCardV1",
                                            driver.status === 'ONLINE' ? 'bg-green-500' :
                                                driver.status === 'BUSY' ? 'bg-red-500' : 'bg-neutral-500'
                                        )} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <p className="font-bold text-neutral-300 group-hover:text-primary transition-colors text-sm truncate uppercase tracking-tight">
                                                {driver.name}
                                            </p>
                                            {selectedOrder && driver.location && (
                                                <span className="text-sm text-neutral-400 font-bold bg-darkBorderV1/50 px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                                    <Icon path={mdiMapMarkerDistance} size={0.6} />
                                                    {calculateDistance(
                                                        selectedOrder.pickup.lat,
                                                        selectedOrder.pickup.lng,
                                                        driver.location.lat,
                                                        driver.location.lng
                                                    ).toFixed(1)} km
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1.5 text-sm text-neutral-400 mb-2">
                                            <Icon path={mdiPhone} size={0.6} className="text-neutral-400" />
                                            <span className="tabular-nums">{driver.phone}</span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={
                                                driver.status === 'ONLINE' ? 'green' :
                                                    driver.status === 'BUSY' ? 'red' : 'neutral'
                                            }>
                                                {driver.status}
                                            </Badge>

                                            {selectedDriver?.id === driver.id && performance && (
                                                <div className="flex items-center gap-3">
                                                    <span className="flex items-center text-yellow-500 text-sm font-bold gap-0.5">
                                                        <Icon path={mdiStar} size={0.6} /> {performance.rating}
                                                    </span>
                                                    <span className="text-sm text-neutral-400 font-medium">
                                                        {performance.completedTrips} chuyến
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <Icon path={mdiChevronRight} size={0.6} className={cn("text-neutral-700 group-hover:text-primary transition-colors", selectedDriver?.id === driver.id && "text-primary")} />
                                </motion.div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Footer Status Bar overlay */}
            {(selectedOrder || selectedDriver) && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-darkCardV1 border border-primary/30 p-4 rounded-2xl flex items-center justify-between gap-6 relative z-10"
                >
                    <div className="flex-1 text-center border-r border-darkBorderV1">
                        <span className="text-sm text-neutral-400 block uppercase font-bold tracking-wider mb-1">Đơn hàng đã chọn</span>
                        {selectedOrder ? (
                            <div className="flex flex-col">
                                <span className="text-primary font-bold">#{selectedOrder._id.slice(-8)} - {selectedOrder.customerId?.name}</span>
                                <span className="text-sm text-neutral-400">
                                    {selectedOrder.vehicleType} • {formatCurrency(selectedOrder.totalPrice)}
                                    {selectedOrder.priority === 'URGENT' && <span className="text-red-500 ml-1">(! Hỏa tốc)</span>}
                                </span>
                            </div>
                        ) : (
                            <span className="text-neutral-400 italic text-sm">Vui lòng chọn đơn hàng</span>
                        )}
                    </div>
                    <div className="text-primary animate-pulse bg-primary/5 p-2 rounded-full">
                        <Icon path={mdiChevronRight} size={1} />
                    </div>
                    <div className="flex-1 text-center">
                        <span className="text-sm text-neutral-400 block uppercase font-bold tracking-wider mb-1">Tài xế đã chọn</span>
                        {selectedDriver ? (
                            <div className="flex flex-col">
                                <span className="text-primary font-bold">{selectedDriver.name}</span>
                                <span className="text-sm text-neutral-400">{selectedDriver.phone}</span>
                            </div>
                        ) : (
                            <span className="text-neutral-400 italic text-sm">Vui lòng chọn tài xế</span>
                        )}
                    </div>
                    {selectedOrder && selectedDriver && (
                        <Button
                            onClick={handleAssign}
                            disabled={assignMutation.isPending}
                        >
                            <Icon path={mdiCheckCircleOutline} size={0.8} />
                            {assignMutation.isPending ? "Đang xử lý..." : "Gán chuyến ngay"}
                        </Button>
                    )}
                </motion.div>
            )}
        </div>
    );
}
