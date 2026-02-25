import { useDispatcherStats } from "@/hooks/useDispatcher";
import { useAdminReports } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@mdi/react";
import {
    mdiPackageVariant,
    mdiCarSide,
    mdiTrendingUp,
    mdiPackageVariantClosed,
    mdiAccountVoice,
    mdiChartLine,
} from "@mdi/js";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/format";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

import MetricCard from "@/components/Common/MetricCard";

function DashboardSkeleton() {
    return (
        <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-8 w-16" />
                                </div>
                                <Skeleton className="h-12 w-12 rounded-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default function DispatcherDashboard() {
    const { data: stats, isLoading: isLoadingStats } = useDispatcherStats();
    const { data: reports, isLoading: isLoadingReports } = useAdminReports("ALL", "WEEK");

    const isLoading = isLoadingStats || isLoadingReports;

    if (isLoading) return <DashboardSkeleton />;

    const chartData = reports?.revenue?.chartData?.map((item) => {
        const date = new Date(item.date);
        return {
            name: date.toLocaleDateString("vi-VN", { weekday: "short" }),
            fullName: date.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
            }),
            revenue: item.value,
        };
    }) || [];

    return (
        <div className="space-y-6 bg-darkCardV1 p-6 rounded-2xl border border-darkBorderV1">
            <div className="flex justify-between items-center relative pr-24">
                <div className="z-10">
                    <h1 className="text-3xl font-bold text-neutral-300">
                        Trung tâm Điều phối
                    </h1>
                    <p className="text-neutral-400 mt-2 text-base">
                        Chào mừng, đây là những gì đang diễn ra trong mạng lưới của bạn.
                    </p>
                </div>
                <div className="absolute -top-12 -right-14 w-48 h-48 flex items-center justify-center pointer-events-none">
                    {/* Decorative Background Glows */}
                    <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-[45px] animate-pulse" />

                    <motion.img
                        initial={{ y: 0, rotate: 0 }}
                        animate={{ y: [-6, 6, -6], rotate: [-2, 2, -2] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        src="/images/supportchat.webp"
                        alt="supportchat"
                        className="w-32 h-32 relative z-10 drop-shadow-[0_12px_18px_rgba(65,198,81,0.4)]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MetricCard
                    icon={<Icon path={mdiPackageVariant} size={0.8} />}
                    title="Tổng đơn hàng"
                    value={stats?.totalOrders || 0}
                    href="/dispatcher/orders"
                />
                <MetricCard
                    icon={<Icon path={mdiPackageVariantClosed} size={0.8} />}
                    title="Đơn hàng chờ gán"
                    value={stats?.pendingOrders || 0}
                    subtitle="Cần phân chuyến ngay"
                    href="/dispatcher/orders?status=PENDING"
                />
                <MetricCard
                    icon={<Icon path={mdiTrendingUp} size={0.8} />}
                    title="Đơn hàng đang chạy"
                    value={stats?.activeOrders || 0}
                    href="/dispatcher/orders?status=ACTIVE"
                />
                <MetricCard
                    icon={<Icon path={mdiPackageVariant} size={0.8} />}
                    title="Hoàn thành hôm nay"
                    value={stats?.completedToday || 0}
                    href="/dispatcher/orders?status=COMPLETED"
                />
                <MetricCard
                    icon={<Icon path={mdiCarSide} size={0.8} />}
                    title="Tài xế Online"
                    value={stats?.onlineDrivers || 0}
                    subtitle="Sẵn sàng nhận chuyến"
                    href="/dispatcher/drivers"
                />
                <MetricCard
                    icon={<Icon path={mdiAccountVoice} size={0.8} />}
                    title="Hỗ trợ & Sự cố"
                    value={stats?.openTickets || 0}
                    subtitle="Cần xử lý gấp"
                    href="/dispatcher/support"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* System Growth Chart */}
                <Card className="lg:col-span-2 bg-darkCardV1 border-darkBorderV1">
                    <CardHeader className="border-b border-b-darkBorderV1 py-3">
                        <div className="flex items-center gap-2">
                            <Icon path={mdiChartLine} size={0.8} />
                            <span className="font-semibold">Tần suất hoạt động hệ thống (7 ngày)</span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#41C651" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#41C651" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="name"
                                        stroke="#4A5F73"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#051A1D",
                                            border: "1px solid #233738",
                                            borderRadius: "8px",
                                        }}
                                        formatter={(value: number) => [
                                            formatCurrency(value),
                                            "Doanh thu",
                                        ]}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#41C651"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorRev)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-darkBorderV1/20 border-darkBorderV1">
                    <CardHeader className="border-b border-b-darkBorderV1 py-3">
                        <div className="flex items-center gap-2">
                            <Icon path={mdiPackageVariant} size={0.8} />
                            <span className="font-semibold">Tác vụ nhanh</span>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <Link to="/dispatcher/assignment" className="block p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all">
                            <span className="block font-bold text-primary">Phân chuyến thủ công</span>
                            <span className="text-xs text-neutral-400">Gán tài xế cho đơn chờ</span>
                        </Link>
                        <Link to="/dispatcher/orders?status=SPECIAL" className="block p-4 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all">
                            <span className="block font-bold text-primary">Giám sát đơn VIP</span>
                            <span className="text-xs text-neutral-400">Theo dõi chuyến đặc biệt</span>
                        </Link>
                        <div className="pt-4 border-t border-darkBorderV1">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-neutral-400 uppercase font-bold">Hiệu suất đội ngũ</span>
                                <span className="text-primary font-bold">Tốt</span>
                            </div>
                            <div className="w-full bg-darkBackgroundV1 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-[85%]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
