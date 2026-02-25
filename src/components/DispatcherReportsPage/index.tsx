import { useState } from "react";
import { useAllDrivers, useDriverPerformance } from "@/hooks/useDispatcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import { Icon } from "@mdi/react";
import { mdiChartBar, mdiStar, mdiCurrencyUsd, mdiPackageVariant, mdiFilterOutline, mdiCancel, mdiCheckCircleOutline, mdiChartLine, mdiInformationOutline } from "@mdi/js";
import { formatCurrency } from "@/lib/format";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";

export default function DispatcherReportsPage() {
    const [driverId, setDriverId] = useState<string>("");
    const [dateFrom, setDateFrom] = useState<Date>();
    const [dateTo, setDateTo] = useState<Date>();

    const { data: drivers, isLoading: isLoadingDrivers } = useAllDrivers();
    const { data: performance, isLoading: isLoadingPerf } = useDriverPerformance(driverId, {
        from: dateFrom?.toISOString().split('T')[0],
        to: dateTo?.toISOString().split('T')[0]
    });

    const selectedDriver = drivers?.find(d => d.id === driverId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-300">Báo cáo & Thống kê Hiệu suất</h1>
                    <p className="text-sm text-neutral-400">Phân tích chi tiết hoạt động của từng tài xế trên hệ thống.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <Card className="bg-darkCardV1 border-darkBorderV1 shadow-xl">
                <CardContent className="p-4 flex flex-wrap items-end gap-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Chọn tài xế</label>
                        <Select value={driverId} onValueChange={setDriverId}>
                            <SelectTrigger className="w-[240px] bg-darkBackgroundV1 border-darkBorderV1 h-11 rounded-xl focus:ring-primary/20">
                                <SelectValue placeholder="Chọn tài xế hệ thống..." />
                            </SelectTrigger>
                            <SelectContent className="bg-darkCardV1 border-darkBorderV1">
                                {drivers?.map(d => (
                                    <SelectItem key={d.id} value={d.id} className="text-neutral-300 focus:bg-primary/10 focus:text-primary">{d.name} ({d.phone})</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Từ ngày</label>
                        <DatePicker date={dateFrom} onDateChange={setDateFrom} />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Đến ngày</label>
                        <DatePicker date={dateTo} onDateChange={setDateTo} />
                    </div>

                    <Button className="bg-primary hover:bg-primary/90 text-black font-bold flex items-center gap-2 px-8 h-11 rounded-xl shadow-lg shadow-primary/10">
                        <Icon path={mdiFilterOutline} size={0.8} /> Lọc kết quả
                    </Button>
                </CardContent>
            </Card>

            {driverId ? (
                <div className="space-y-6">
                    {selectedDriver && (
                        <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                                {selectedDriver.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-neutral-300">{selectedDriver.name}</h2>
                                <p className="text-sm text-neutral-400">{selectedDriver.phone} • Đối tác tài xế BenGo</p>
                            </div>
                            <Badge variant="emerald" className="ml-auto px-3 py-1">Đang hoạt động</Badge>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-darkCardV1 border-darkBorderV1 hover:border-primary/30 transition-all shadow-lg group">
                            <CardContent className="p-6 flex flex-col items-center gap-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Icon path={mdiPackageVariant} size={3} />
                                </div>
                                <Icon path={mdiPackageVariant} size={1.5} className="text-primary mb-2" />
                                {isLoadingPerf ? <LoadingSpinner /> : <p className="text-4xl font-black text-neutral-300">{performance?.totalTrips || 0}</p>}
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Tổng chuyến gán</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-darkCardV1 border-darkBorderV1 hover:border-emerald-500/30 transition-all shadow-lg group">
                            <CardContent className="p-6 flex flex-col items-center gap-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Icon path={mdiCurrencyUsd} size={3} />
                                </div>
                                <Icon path={mdiCurrencyUsd} size={1.5} className="text-emerald-500 mb-2" />
                                {isLoadingPerf ? <LoadingSpinner /> : <p className="text-4xl font-black text-emerald-500">{formatCurrency(performance?.totalEarnings || 0)}</p>}
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Thu nhập gộp</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-darkCardV1 border-darkBorderV1 hover:border-yellow-500/30 transition-all shadow-lg group">
                            <CardContent className="p-6 flex flex-col items-center gap-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Icon path={mdiStar} size={3} />
                                </div>
                                <Icon path={mdiStar} size={1.5} className="text-yellow-500 mb-2" />
                                <div className="flex items-center gap-2">
                                    {isLoadingPerf ? <LoadingSpinner /> : <p className="text-4xl font-black text-yellow-500">{performance?.rating || 0}</p>}
                                </div>
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Đánh giá sao</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-darkCardV1 border-darkBorderV1 hover:border-blue-500/30 transition-all shadow-lg group">
                            <CardContent className="p-6 flex flex-col items-center gap-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Icon path={mdiChartBar} size={3} />
                                </div>
                                <Icon path={mdiChartBar} size={1.5} className="text-blue-500 mb-2" />
                                {isLoadingPerf ? <LoadingSpinner /> : <p className="text-4xl font-black text-blue-500">{performance?.acceptanceRate || 0}%</p>}
                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Tỷ lệ hoàn thành</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-darkCardV1 border-darkBorderV1 shadow-lg">
                            <CardHeader className="border-b border-b-darkBorderV1 py-3">
                                <div className="flex items-center gap-2">
                                    <Icon path={mdiInformationOutline} size={0.8} />
                                    <span className="font-semibold text-sm">Chi tiết chuyến đi</span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-darkBackgroundV1 rounded-xl border border-darkBorderV1">
                                    <div className="flex items-center gap-3">
                                        <Icon path={mdiCheckCircleOutline} size={1} className="text-green-500" />
                                        <span className="text-neutral-300 font-medium">Chuyến hoàn thành</span>
                                    </div>
                                    <span className="text-2xl font-bold text-green-500">{performance?.completedTrips || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-darkBackgroundV1 rounded-xl border border-darkBorderV1">
                                    <div className="flex items-center gap-3">
                                        <Icon path={mdiCancel} size={1} className="text-red-500" />
                                        <span className="text-neutral-300 font-medium">Chuyến bị hủy</span>
                                    </div>
                                    <span className="text-2xl font-bold text-red-500">{performance?.cancelledTrips || 0}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-darkCardV1 border-darkBorderV1 shadow-lg flex flex-col justify-center items-center p-10 text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                <Icon path={mdiChartLine} size={1.2} />
                            </div>
                            <h3 className="text-lg font-bold text-neutral-300 mb-2">Thông tin phân tích</h3>
                            <p className="text-sm text-neutral-400 max-w-[300px]">
                                Dữ liệu thời gian thực được tổng hợp từ hệ thống điều phối BenGo.
                                Tài xế đang có mức độ tin cậy {(performance?.acceptanceRate || 0) > 90 ? 'CAO' : 'TRUNG BÌNH'}.
                            </p>
                            <Button variant="ghost" className="mt-6 text-primary hover:bg-primary/10">Xuất báo cáo PDF</Button>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="py-40 flex flex-col items-center justify-center text-neutral-600 gap-4 opacity-30 border-2 border-dashed border-darkBorderV1 rounded-3xl">
                    <Icon path={mdiChartBar} size={4} />
                    <p className="text-xl font-bold uppercase tracking-widest">Vui lòng chọn tài xế để xem báo cáo</p>
                </div>
            )}
        </div>
    );
}
