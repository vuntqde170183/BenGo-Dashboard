import { useState, useEffect } from "react";
import { useDispatcherOrders, useAssignDriver, useDriverLocations, useDriverPerformance, useAssignmentHistory } from "@/hooks/useDispatcher";
import {
    mdiHistory,
    mdiAccountSettingsOutline,
} from "@mdi/js";
import Icon from "@mdi/react";
import { useSearchParams } from "react-router-dom";
import { IDispatcherOrder, IDriverMapLocation } from "@/interface/dispatcher";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { AssignConfirmDialog } from "./AssignConfirmDialog";
import { ManualAssignmentTable } from "./ManualAssignmentTable";
import { AssignmentInterface } from "./AssignmentInterface";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { calculateDistance } from "@/lib/distance";

export default function ManualAssignmentPage() {
    const [searchParams] = useSearchParams();
    const initialOrderId = searchParams.get("orderId");

    const [activeTab, setActiveTab] = useState("assignment");
    const [selectedOrder, setSelectedOrder] = useState<IDispatcherOrder | null>(null);
    const [selectedDriver, setSelectedDriver] = useState<IDriverMapLocation | null>(null);
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
                    <TabsTrigger value="assignment" className="flex flex-row gap-1 bg-darkBorderV1">
                        <Icon path={mdiAccountSettingsOutline} size={0.8} />
                        Điều phối đơn hàng
                    </TabsTrigger>
                    <TabsTrigger value="history" className="flex flex-row gap-1 bg-darkBorderV1">
                        <Icon path={mdiHistory} size={0.8} />
                        Lịch sử phân chuyến
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="assignment" className="m-0 border-0 p-0 focus-visible:ring-0">
                    <AssignmentInterface
                        pendingOrders={pendingOrders}
                        isLoadingOrders={isLoadingOrders}
                        drivers={drivers}
                        isLoadingDrivers={isLoadingDrivers}
                        selectedOrder={selectedOrder}
                        setSelectedOrder={setSelectedOrder}
                        selectedDriver={selectedDriver}
                        setSelectedDriver={setSelectedDriver}
                        radius={radius}
                        setRadius={setRadius}
                        onAssign={() => setIsConfirmDialogOpen(true)}
                    />
                </TabsContent>

                <TabsContent value="history" className="m-0 border-0 p-0 focus-visible:ring-0">
                    <ManualAssignmentTable
                        data={historyData?.data}
                        isLoading={isLoadingHistory}
                        total={historyData?.total || 0}
                        page={historyPage}
                        pageSize={historyLimit}
                        onPageChange={setHistoryPage}
                    />
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
        </div>
    );
}
