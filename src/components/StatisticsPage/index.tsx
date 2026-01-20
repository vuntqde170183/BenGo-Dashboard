import { useDashboardOverview, useAdminReports } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@mdi/react";
import {
  mdiAccountGroup,
  mdiPackageVariant,
  mdiCarSide,
  mdiCurrencyUsd,
  mdiTrendingUp,
  mdiChartLine,
  mdiShieldCheck,
  mdiMotorbike,
  mdiVanPassenger,
  mdiTruck,
  mdiStar,
  mdiArrowRightThin,
} from "@mdi/js";
import { formatCurrency } from "@/lib/format";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { TReportPeriod, TReportType } from "@/interface/admin";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  href: string;
}

function MetricCard({
  icon,
  title,
  value,
  subtitle,
  trend,
  href,
}: MetricCardProps) {
  return (
    <Link to={href} className="h-full block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="h-full"
      >
        <Card className="h-full bg-gradient-to-br from-darkCardV1 via-darkCardV1 to-primary/10 border-primary/20 transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-sm uppercase text-nowrap truncate font-medium text-neutral-400">
                  {title}
                </p>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold mt-2">{value}</h3>
                  <div className="p-3 rounded-full bg-darkBorderV1 text-neutral-200">
                    {icon}
                  </div>
                </div>
                {subtitle && <p className="text-sm text-primary">{subtitle}</p>}
                {trend && (
                  <div className="flex items-center gap-1 text-primary text-sm text-nowrap">
                    <Icon path={mdiTrendingUp} size={0.8} />
                    <span>{trend}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-b-darkBorderV1 py-3">
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-b-darkBorderV1 py-3">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-b-darkBorderV1 py-3">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-b-darkBorderV1 py-3">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-3 rounded-lg border border-darkBorderV1/40"
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function StatisticsPage() {
  const [period, setPeriod] = useState<TReportPeriod>("WEEK");

  const { data: overview, isLoading: isLoadingOverview } =
    useDashboardOverview();
  const { data: reports, isLoading: isLoadingReports } = useAdminReports(
    "ALL",
    period,
  );

  const isLoading = isLoadingOverview || isLoadingReports;

  if (isLoading) return <DashboardSkeleton />;

  const revenueData =
    reports?.revenue?.chartData?.map((item) => {
      const date = new Date(item.date);
      let label = "";
      if (period === "WEEK") {
        label = date.toLocaleDateString("vi-VN", { weekday: "short" });
      } else if (period === "MONTH") {
        label = `D${date.getDate()}`;
      } else {
        label = date.toLocaleDateString("vi-VN", { month: "short" });
      }

      return {
        name: label,
        fullName: date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        revenue: item.value,
      };
    }) || [];

  const topDrivers = reports?.topDrivers || [];

  return (
    <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-200">
            Bảng điều khiển
          </h1>
          <p className="text-neutral-400 mt-2 text-base">
            Chào mừng quay trở lại, đây là những gì đang diễn ra hôm nay.
          </p>
        </div>
        <div className="flex gap-2">
          {(overview?.pendingTickets ?? 0) > 0 && (
            <Badge variant="emerald">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              {overview?.pendingTickets} Yêu cầu trợ giúp
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Icon path={mdiAccountGroup} size={0.8} />}
          title="Tổng người dùng"
          value={overview?.users || 0}
          trend="+12% so với tháng trước"
          href="/admin/users"
        />
        <MetricCard
          icon={<Icon path={mdiPackageVariant} size={0.8} />}
          title="Đơn hàng đang hoạt động"
          value={overview?.activeOrders || 0}
          subtitle={`Tổng số ${overview?.orders || 0} đơn hàng`}
          href="/admin/orders"
        />
        <MetricCard
          icon={<Icon path={mdiCarSide} size={0.8} />}
          title="Tài xế"
          value={overview?.drivers || 0}
          subtitle="Tổng số đã đăng ký"
          href="/admin/drivers"
        />
        <MetricCard
          icon={<Icon path={mdiCurrencyUsd} size={0.8} />}
          title="Doanh thu"
          value={formatCurrency(overview?.revenue || 0)}
          subtitle="Tổng thu nhập"
          href="/admin/pricing"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-b-darkBorderV1 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon path={mdiChartLine} size={0.8} />
                <span className="font-semibold">Tăng trưởng doanh thu</span>
              </div>
              <div className="flex items-center gap-2">
                <Tabs
                  value={period}
                  onValueChange={(v) => setPeriod(v as TReportPeriod)}
                  className="w-[200px]"
                >
                  <TabsList className="p-1">
                    <TabsTrigger value="WEEK" className="text-sm">
                      Tuần
                    </TabsTrigger>
                    <TabsTrigger value="MONTH" className="text-sm">
                      Tháng
                    </TabsTrigger>
                    <TabsTrigger value="YEAR" className="text-sm">
                      Năm
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Badge variant="emerald">
                  Hôm nay: {formatCurrency(reports?.revenue?.daily || 0)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#41C651" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#41C651" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#4A5F73"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#4A5F73"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) =>
                      `${(value / 1000000).toFixed(0)}M`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#051A1D",
                      border: "1px solid #233738",
                      borderRadius: "8px",
                      color: "#E5E5E5",
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      formatCurrency(value),
                      `Doanh thu (${props.payload.fullName})`,
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

        <Card>
          <CardHeader className="border-b border-b-darkBorderV1 py-3">
            <div className="flex items-center gap-2">
              <Icon path={mdiMotorbike} size={0.8} />
              <span className="font-semibold">Doanh thu theo loại xe</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon path={mdiMotorbike} size={0.8} /> Xe máy
                </span>
                <span className="font-semibold text-base">
                  {formatCurrency(reports?.revenue?.byVehicleType?.BIKE || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon path={mdiVanPassenger} size={0.8} /> Xe Van
                </span>
                <span className="font-semibold text-base">
                  {formatCurrency(reports?.revenue?.byVehicleType?.VAN || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon path={mdiTruck} size={0.8} /> Xe tải
                </span>
                <span className="font-semibold text-base">
                  {formatCurrency(reports?.revenue?.byVehicleType?.TRUCK || 0)}
                </span>
              </div>
              <div className="pt-4 border-t border-darkBorderV1">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-200 font-semibold">
                    Tổng cộng
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(reports?.revenue?.total || 0)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-b-darkBorderV1 py-3">
            <div className="flex items-center gap-2">
              <Icon path={mdiChartLine} size={0.8} />
              <span className="font-semibold">Thống kê đơn hàng</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon path={mdiPackageVariant} size={0.8} />
                  Tổng đơn hàng
                </span>
                <span className="font-semibold text-base">
                  {reports?.orderStats?.total || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon
                    path={mdiShieldCheck}
                    size={0.8}
                    className="text-green-500"
                  />
                  Đơn hoàn thành
                </span>
                <span className="font-semibold text-base text-green-500">
                  {reports?.orderStats?.completed || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon
                    path={mdiPackageVariant}
                    size={0.8}
                    className="text-red-500"
                  />
                  Đơn đã hủy
                </span>
                <span className="font-semibold text-base text-red-500">
                  {reports?.orderStats?.cancelled || 0}
                </span>
              </div>
              <div className="pt-4 border-t border-darkBorderV1">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-200 font-semibold">
                    Tỷ lệ hoàn thành
                  </span>
                  <span className="font-bold text-lg text-primary">
                    {reports?.orderStats?.total
                      ? (
                          (reports.orderStats.completed /
                            reports.orderStats.total) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-b-darkBorderV1 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon path={mdiCarSide} size={0.8} />
              <span className="font-semibold">Tài xế xuất sắc</span>
            </div>
            <Link
              to="/admin/drivers"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Xem tất cả
              <Icon path={mdiArrowRightThin} size={0.8} />
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topDrivers.length > 0 ? (
              topDrivers.map((driver, index) => (
                <div
                  key={driver.driverId}
                  className="flex items-center gap-4 p-3 rounded-lg bg-darkBorderV1/20 border border-darkBorderV1/40 hover:bg-darkBorderV1/30 transition-colors"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary font-bold text-lg">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-200 font-semibold">
                      {driver.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-neutral-400">
                        {driver.completedOrders} chuyến
                      </span>
                      <span className="text-xs text-neutral-400">•</span>
                      <span className="text-sm text-yellow-500 flex items-center gap-1">
                        <Icon path={mdiStar} size={0.8} />{" "}
                        {driver.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">
                      {formatCurrency(driver.revenue)}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">Doanh thu</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-neutral-400">
                Chưa có dữ liệu tài xế
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
