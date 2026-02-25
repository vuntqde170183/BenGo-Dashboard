import { useState, useEffect } from "react";
import { useDispatcherOrders, useAllDrivers, useAssignDriver } from "@/hooks/useDispatcher";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@mdi/react";
import { mdiMagnify, mdiAccountHardHat, mdiPackageVariant, mdiChevronRight, mdiStar, mdiInboxRemoveOutline } from "@mdi/js";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { IDispatcherOrder, IDriverMapLocation } from "@/interface/dispatcher";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ManualAssignmentPage() {
    const [searchParams] = useSearchParams();
    const initialOrderId = searchParams.get("orderId");

    const [selectedOrder, setSelectedOrder] = useState<IDispatcherOrder | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<IDriverMapLocation | null>(null);
    const [searchOrder, setSearchOrder] = useState("");
    const [searchDriver, setSearchDriver] = useState("");

    const { data: pendingOrdersResponse, isLoading: isLoadingOrders } = useDispatcherOrders({ status: "PENDING" });
    const pendingOrders = pendingOrdersResponse?.data || [];
    const { data: drivers, isLoading: isLoadingDrivers } = useAllDrivers();
    const assignMutation = useAssignDriver();

    // Handle initial order from query param
    useEffect(() => {
        if (initialOrderId && pendingOrders.length > 0 && !selectedOrder) {
            const order = (pendingOrders as IDispatcherOrder[]).find(o => o._id === initialOrderId);
            if (order) setSelectedOrder(order);
        }
    }, [initialOrderId, pendingOrders, selectedOrder]);

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

    return (
        <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-300">Phân chuyến thủ công</h1>
                    <p className="text-sm text-neutral-400">Chọn một đơn hàng và một tài xế để thực hiện gán chuyến.</p>
                </div>
                <Button
                    onClick={handleAssign}
                    disabled={!selectedOrder || !selectedDriver || assignMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-black font-bold h-11 px-8 rounded-xl shadow-lg shadow-primary/20"
                >
                    {assignMutation.isPending ? "Đang xử lý..." : "Xác nhận điều phối"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
                {/* Left: Pending Orders */}
                <Card className="bg-darkCardV1 border-darkBorderV1 flex flex-col min-h-0 shadow-2xl">
                    <CardHeader className="border-b border-b-darkBorderV1 py-3 bg-darkBackgroundV1/30">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Icon path={mdiPackageVariant} size={0.8} />
                                <span className="font-semibold text-lg">Đơn hàng chờ gán ({pendingOrders?.length || 0})</span>
                            </div>
                        </div>
                        <div className="relative">
                            <Icon path={mdiMagnify} size={0.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
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
                            <div className="flex flex-col items-center justify-center py-10 text-neutral-400 italic gap-3">
                                <Icon path={mdiInboxRemoveOutline} size={1.6} className="opacity-60" />
                                <p>Không có đơn hàng chờ gán</p>
                            </div>
                        ) : (
                            filteredOrders?.map((order: any) => (
                                <motion.div
                                    key={order._id}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => setSelectedOrder(order)}
                                    className={cn(
                                        "p-4 rounded-2xl border transition-all cursor-pointer group",
                                        selectedOrder?._id === order._id
                                            ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(65,198,81,0.15)]"
                                            : "bg-darkBackgroundV1/50 border-darkBorderV1 hover:border-primary/40 hover:bg-darkBackgroundV1"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-primary text-xs font-bold bg-primary/10 px-2 py-0.5 rounded">#{order._id.slice(-8)}</span>
                                        {order.priority && order.priority !== 'NORMAL' && (
                                            <Badge className="bg-yellow-500/20 text-yellow-500 border-none text-xs">{order.priority}</Badge>
                                        )}
                                    </div>
                                    <div className="text-sm text-neutral-300 space-y-2">
                                        <p className="font-bold text-neutral-300 group-hover:text-primary transition-colors">{order.customerId?.name}</p>
                                        <div className="space-y-1">
                                            <p className="truncate flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span> {order.pickup?.address}</p>
                                            <p className="truncate flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span> {order.dropoff?.address}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Right: Available Drivers */}
                <Card className="bg-darkCardV1 border-darkBorderV1 flex flex-col min-h-0 shadow-2xl">
                    <CardHeader className="border-b border-b-darkBorderV1 py-3 bg-darkBackgroundV1/30">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Icon path={mdiAccountHardHat} size={0.8} />
                                <span className="font-semibold text-lg">Tài xế sẵn sàng ({drivers?.length || 0})</span>
                            </div>
                        </div>
                        <div className="relative">
                            <Icon path={mdiMagnify} size={0.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <Input
                                placeholder="Tìm tên hoặc SĐT tài xế..."
                                className="pl-10 bg-darkBackgroundV1 border-darkBorderV1 focus:ring-1 focus:ring-primary/30"
                                value={searchDriver}
                                onChange={(e) => setSearchDriver(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {isLoadingDrivers ? (
                            <div className="py-20 flex justify-center"><LoadingSpinner /></div>
                        ) : filteredDrivers?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-neutral-400 italic gap-3">
                                <Icon path={mdiInboxRemoveOutline} size={1.6} className="opacity-60" />
                                <p>Không tìm thấy tài xế</p>
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
                                            ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(65,198,81,0.15)]"
                                            : "bg-darkBackgroundV1/50 border-darkBorderV1 hover:border-primary/40 hover:bg-darkBackgroundV1"
                                    )}
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-darkBorderV1 flex items-center justify-center text-primary font-bold text-xl group-hover:bg-primary/20 transition-all">
                                        {driver.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-neutral-300 group-hover:text-primary transition-colors">{driver.name}</p>
                                        <p className="text-xs text-neutral-400">{driver.phone}</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge className="bg-green-500/10 text-green-500 border-none text-xs px-1.5 py-0">ONLINE</Badge>
                                            <span className="flex items-center text-yellow-500 text-xs font-bold gap-0.5">
                                                <Icon path={mdiStar} size={0.5} /> 4.9
                                            </span>
                                        </div>
                                    </div>
                                    <Icon path={mdiChevronRight} size={0.8} className={cn("text-neutral-600 group-hover:text-primary transition-colors", selectedDriver?.id === driver.id && "text-primary")} />
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
                    className="bg-darkCardV1 border border-primary/30 p-4 rounded-2xl flex items-center justify-between gap-6 shadow-2xl relative z-10"
                >
                    <div className="flex-1 text-center border-r border-darkBorderV1">
                        <span className="text-xs text-neutral-400 block uppercase font-bold tracking-wider mb-1">Đơn hàng đã chọn</span>
                        {selectedOrder ? (
                            <span className="text-primary font-bold">#{selectedOrder._id.slice(-8)} - {selectedOrder.customerId?.name}</span>
                        ) : (
                            <span className="text-neutral-400 italic text-sm">Vui lòng chọn đơn hàng</span>
                        )}
                    </div>
                    <div className="text-primary animate-pulse bg-primary/10 p-2 rounded-full">
                        <Icon path={mdiChevronRight} size={1} />
                    </div>
                    <div className="flex-1 text-center">
                        <span className="text-xs text-neutral-400 block uppercase font-bold tracking-wider mb-1">Tài xế đã chọn</span>
                        {selectedDriver ? (
                            <span className="text-primary font-bold">{selectedDriver.name} - {selectedDriver.phone}</span>
                        ) : (
                            <span className="text-neutral-400 italic text-sm">Vui lòng chọn tài xế</span>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
