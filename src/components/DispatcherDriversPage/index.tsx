import { useState } from "react";
import { useAllDrivers, useDriverPerformance } from "@/hooks/useDispatcher";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@mdi/react";
import { mdiMagnify, mdiCarSide, mdiStar, mdiTrendingUp, mdiMapMarker, mdiInformationOutline, mdiChartLine, mdiInboxRemoveOutline } from "@mdi/js";
import { cn } from "@/lib/utils";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { formatCurrency } from "@/lib/format";

export default function DispatcherDriversPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

    const { data: drivers, isLoading } = useAllDrivers();
    const { data: performance, isLoading: isLoadingPerf } = useDriverPerformance(selectedDriverId || "", {});

    const filteredDrivers = drivers?.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.phone.includes(searchQuery)
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-300">Quản lý & Theo dõi tài xế</h1>
                    <p className="text-sm text-neutral-400">Giám sát vị trí, trạng thái và hiệu suất làm việc của tài xế.</p>
                </div>
                <div className="flex gap-4">
                    <Card className="bg-darkBackgroundV1/50 border-darkBorderV1 px-4 py-2 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm font-bold text-neutral-300">{drivers?.length || 0} Online</span>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Driver List Sidebar */}
                <Card className="bg-darkCardV1 border-darkBorderV1 lg:col-span-1 flex flex-col h-[calc(100vh-220px)]">
                    <CardHeader className="border-b border-b-darkBorderV1 py-3 bg-darkBackgroundV1/30">
                        <div className="flex items-center gap-2">
                            <Icon path={mdiMagnify} size={0.8} className="text-neutral-400" />
                            <span className="font-semibold">Tìm kiếm tài xế</span>
                        </div>
                    </CardHeader>
                    <div className="p-3 border-b border-darkBorderV1">
                        <div className="relative">
                            <Icon path={mdiMagnify} size={0.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <Input
                                placeholder="Tên hoặc SĐT..."
                                className="pl-10 bg-darkBackgroundV1 border-darkBorderV1"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <CardContent className="flex-1 overflow-y-auto space-y-2 custom-scrollbar p-2">
                        {isLoading ? (
                            <div className="py-20 flex justify-center"><LoadingSpinner /></div>
                        ) : filteredDrivers?.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-neutral-400 italic gap-3">
                                <Icon path={mdiInboxRemoveOutline} size={1.6} className="opacity-60" />
                                <p>Không tìm thấy tài xế</p>
                            </div>
                        ) : (
                            filteredDrivers?.map(driver => (
                                <div
                                    key={driver.id}
                                    onClick={() => setSelectedDriverId(driver.id)}
                                    className={cn(
                                        "p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3",
                                        selectedDriverId === driver.id
                                            ? "bg-primary/5 border-primary"
                                            : "bg-darkBackgroundV1/30 border-darkBorderV1 hover:bg-darkBackgroundV1/60"
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-darkBorderV1 flex items-center justify-center text-primary font-bold">
                                        {driver.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-neutral-300 truncate">{driver.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-neutral-400">{driver.phone}</span>
                                            <Badge className={cn("text-[9px] px-1 py-0 border-none",
                                                driver.status === 'ONLINE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                            )}>
                                                {driver.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <Icon path={mdiMapMarker} size={0.6} className="text-neutral-400" />
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Main Content: Map Placeholder or Performance */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedDriverId ? (
                        <>
                            {/* Performance Summary Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Card className="bg-darkCardV1 border-darkBorderV1 overflow-hidden">
                                    <CardHeader className="border-b border-b-darkBorderV1 py-3 bg-primary/5">
                                        <div className="flex items-center gap-2">
                                            <Icon path={mdiTrendingUp} size={0.8} />
                                            <span className="font-semibold text-primary uppercase tracking-tighter text-sm">Hiệu suất công việc</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 px-4">
                                        {isLoadingPerf ? <LoadingSpinner /> : (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-neutral-400 uppercase font-bold">Tổng chuyến</p>
                                                    <p className="text-2xl font-bold text-neutral-300">{performance?.totalTrips || 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-400 uppercase font-bold">Hoàn thành</p>
                                                    <p className="text-2xl font-bold text-green-500">{performance?.completedTrips || 0}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-400 uppercase font-bold">Tỷ lệ chấp nhận</p>
                                                    <p className="text-2xl font-bold text-primary">{performance?.acceptanceRate || 0}%</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-neutral-400 uppercase font-bold">Đánh giá TB</p>
                                                    <p className="text-2xl font-bold text-yellow-500 flex items-center gap-1">
                                                        {performance?.rating || 0} <Icon path={mdiStar} size={0.8} />
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="bg-darkCardV1 border-darkBorderV1 overflow-hidden">
                                    <CardHeader className="border-b border-b-darkBorderV1 py-3 bg-emerald-500/5">
                                        <div className="flex items-center gap-2">
                                            <Icon path={mdiChartLine} size={0.8} className="text-emerald-500" />
                                            <span className="font-semibold text-emerald-500 uppercase tracking-tighter text-sm">Thu nhập & Tài chính</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4 px-4">
                                        {isLoadingPerf ? <LoadingSpinner /> : (
                                            <div className="flex flex-col justify-center h-full gap-1 py-2">
                                                <p className="text-xs text-neutral-400 uppercase font-bold">Tổng doanh thu</p>
                                                <p className="text-3xl font-bold text-emerald-500">{formatCurrency(performance?.totalEarnings || 0)}</p>
                                                <p className="text-xs text-neutral-400 mt-2">Dòng tiền ổn định trong 30 ngày qua</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Mock Map / Activity View */}
                            <Card className="bg-darkCardV1 border-darkBorderV1 h-[340px] relative overflow-hidden flex flex-col items-center justify-center border-dashed border-2">
                                <div className="absolute inset-0 bg-darkBackgroundV1/40 animate-pulse opacity-20" />
                                <Icon path={mdiMapMarker} size={3} className="text-primary/20 mb-4" />
                                <p className="text-neutral-400 font-bold uppercase tracking-widest text-sm">Vị trí thời gian thực</p>
                                <p className="text-xs text-neutral-600 mt-1 max-w-[300px] text-center italic">Bản đồ đang được tải ứng dụng tọa độ {drivers?.find(d => d.id === selectedDriverId)?.location.lat}, {drivers?.find(d => d.id === selectedDriverId)?.location.lng}</p>

                                <div className="absolute bottom-4 left-4 right-4 bg-darkBackgroundV1/80 border border-darkBorderV1 p-3 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                            <Icon path={mdiInformationOutline} size={0.6} />
                                        </div>
                                        <p className="text-xs font-medium text-neutral-300">Cập nhật lần cuối 12 giây trước</p>
                                    </div>
                                    <Button size="sm" className="bg-primary text-black font-bold h-8">Pings Tài xế</Button>
                                </div>
                            </Card>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-600 p-20 gap-4 opacity-30 border-2 border-dashed border-darkBorderV1 rounded-3xl">
                            <Icon path={mdiCarSide} size={4} />
                            <p className="text-xl font-bold uppercase tracking-widest">Chọn tài xế để xem chi tiết</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
