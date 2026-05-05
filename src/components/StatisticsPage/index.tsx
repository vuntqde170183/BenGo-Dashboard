import {
  useDashboardOverview,
  useAdminReports,
  useDashboardSummary,
  useRevenueGrowth,
  useDriversPerformance,
  useReportOrders,
  useCustomersLoyalty
} from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Icon } from "@mdi/react";
import {
  mdiAccountGroup,
  mdiPackageVariant,
  mdiCarSide,
  mdiCurrencyUsd, mdiChartLine,
  mdiShieldCheck,
  mdiMotorbike,
  mdiVanPassenger,
  mdiTruck,
  mdiStar
} from "@mdi/js";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { useState, useMemo } from "react";
import { TReportPeriod } from "@/interface/admin";
import { toast } from "react-toastify";
import { adminReportApi } from "@/api/admin-reports";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  mdiMicrosoftExcel,
  mdiFilterVariant, mdiCreditCard
} from "@mdi/js";

import MetricCard from "@/components/Common/MetricCard";

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
  const [driverPage, setDriverPage] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [activeTab, setActiveTab] = useState("drivers");

  // Filter params
  const [dateRange, setDateRange] = useState<{ startDate?: string, endDate?: string }>({});

  const { data: overview, isLoading: isLoadingOverview } = useDashboardOverview();

  // 3.1 Summary
  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary(dateRange);

  // 3.4 Revenue Growth
  const { data: revenueGrowth, isLoading: isLoadingGrowth } = useRevenueGrowth({
    period: period === 'CUSTOM' ? undefined : period as any,
    ...dateRange
  });

  // Existing reports for payment methods (3.5)
  const { data: reports, isLoading: isLoadingReports } = useAdminReports(
    "ALL",
    period,
  );

  // 3.6 Drivers Performance
  const { data: driversPerf, isLoading: isLoadingDrivers } = useDriversPerformance({
    period: period,
    page: driverPage,
    limit: 10
  });

  // 3.7 Order History
  const { data: reportOrders, isLoading: isLoadingOrderHistory } = useReportOrders({
    ...dateRange,
    limit: 10
  });

  // 3.8 Loyalty
  const { data: loyaltyData, isLoading: isLoadingLoyalty } = useCustomersLoyalty({
    limit: 10
  });

  const isLoading = isLoadingOverview || isLoadingReports || isLoadingSummary || isLoadingGrowth;

  const handleExport = (type: string) => {
    toast.info("Đang chuẩn bị tệp Excel...");
    const url = adminReportApi.getExportUrl(type, { ...dateRange, format: 'excel' });
    window.open(url, '_blank');
  };


  if (isLoading) return <DashboardSkeleton />;

  const revenueData = useMemo(() => {
    return revenueGrowth?.chartData?.map((item) => {
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
        orders: item.orderCount
      };
    }) || [];
  }, [revenueGrowth, period]);

  const paymentData = useMemo(() => {
    const methods = reports?.revenue?.byPaymentMethod || { CASH: 0, WALLET: 0, QR: 0 };
    return [
      { name: "Tiền mặt", value: methods.CASH, color: "#10B981" },
      { name: "Ví BenGo", value: methods.WALLET, color: "#3B82F6" },
      { name: "QR Code", value: methods.QR, color: "#F59E0B" },
    ];
  }, [reports]);

  return (
    <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
      <div className="flex justify-between items-center relative pr-24">
        <div className="z-10">
          <h1 className="text-3xl font-semibold text-neutral-300">
            Bảng điều khiển
          </h1>
          <p className="text-neutral-400 mt-2 text-base">
            Chào mừng quay trở lại, đây là những gì đang diễn ra hôm nay.
          </p>
        </div>
        <div className="absolute -top-12 -right-12 w-48 h-48 flex items-center justify-center pointer-events-none">
          <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-[45px] animate-pulse" />

          <motion.img
            initial={{ y: 0, rotate: 0 }}
            animate={{ y: [-6, 6, -6], rotate: [-2, 2, -2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            src="/images/onlinechart.webp"
            alt="growthchart"
            className="w-28 h-28 relative z-10 drop-shadow-[0_12px_18px_rgba(65,198,81,0.4)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Icon path={mdiCurrencyUsd} size={0.8} />}
          title="Tổng doanh thu"
          value={formatCurrency(summary?.revenue?.total || 0)}
          trend={`${summary?.revenue?.growth || 0}% so với trước`}
          href="/admin/pricing"
        />
        <MetricCard
          icon={<Icon path={mdiPackageVariant} size={0.8} />}
          title="Tổng đơn hàng"
          value={summary?.orders?.total || 0}
          subtitle={`${summary?.orders?.completed || 0} thành công`}
          href="/admin/orders"
        />
        <MetricCard
          icon={<Icon path={mdiAccountGroup} size={0.8} />}
          title="Người dùng mới"
          value={summary?.users?.new || 0}
          subtitle={`${summary?.users?.active || 0} đang hoạt động`}
          href="/admin/users"
        />
        <MetricCard
          icon={<Icon path={mdiCarSide} size={0.8} />}
          title="Tài xế Online"
          value={summary?.drivers?.online || 0}
          subtitle={`${summary?.drivers?.active || 0} đang chạy`}
          href="/admin/drivers"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b border-b-darkBorderV1 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon path={mdiChartLine} size={0.8} />
                <span className="font-semibold">Tăng trưởng doanh thu & Đơn hàng</span>
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
                  Tăng trưởng: {revenueGrowth?.summary?.growthPercentage || 0}%
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
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? `Doanh thu (${props.payload.fullName})` : `Số đơn hàng`
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
                  <span className="text-neutral-300 font-semibold">
                    Tổng cộng
                  </span>
                  <span className="font-semibold text-lg text-primary">
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
              <Icon path={mdiCreditCard} size={0.8} />
              <span className="font-semibold">Phương thức thanh toán</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {paymentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#051A1D",
                      border: "1px solid #233738",
                      borderRadius: "8px",
                      color: "#E5E5E5",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs mt-2">
              {paymentData.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-neutral-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b border-b-darkBorderV1 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Icon path={mdiChartLine} size={0.8} />
              <span className="font-semibold text-lg">Báo cáo chi tiết</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-darkBorderV1">
                <Icon path={mdiFilterVariant} size={0.6} />
                Bộ lọc nâng cao
              </Button>
              <Button
                className="gap-2"
                onClick={() => handleExport(activeTab)}
              >
                <Icon path={mdiMicrosoftExcel} size={0.6} />
                Tải xuống Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 border-b border-darkBorderV1">
              <TabsList className="bg-transparent border-none p-0 h-12">
                <TabsTrigger
                  value="drivers"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Hiệu suất Tài xế
                </TabsTrigger>
                <TabsTrigger
                  value="orders"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Lịch sử Đơn hàng
                </TabsTrigger>
                <TabsTrigger
                  value="customers"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  Khách hàng thân thiết
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4">
              <TabsContent value="drivers">
                <div className="rounded-md border border-darkBorderV1">
                  <Table>
                    <TableHeader className="bg-darkBorderV1/20">
                      <TableRow>
                        <TableHead>Tài xế</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                        <TableHead className="text-right">Tổng chuyến</TableHead>
                        <TableHead className="text-right">Doanh thu</TableHead>
                        <TableHead className="text-center">Đánh giá</TableHead>
                        <TableHead className="text-center">Tỷ lệ hủy</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {driversPerf?.data?.map((driver: any) => (
                        <TableRow key={driver.driverId}>
                          <TableCell className="font-medium text-neutral-300">{driver.name}</TableCell>
                          <TableCell className="text-neutral-400">{driver.phone}</TableCell>
                          <TableCell className="text-right">{driver.completedOrders}</TableCell>
                          <TableCell className="text-right text-primary font-semibold">
                            {formatCurrency(driver.revenue)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="flex items-center justify-center gap-1 text-yellow-500">
                              {driver.rating.toFixed(1)} <Icon path={mdiStar} size={0.5} />
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-red-400">{driver.cancellationRate}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={driver.status === 'ACTIVE' ? 'emerald' : 'destructive'}>
                              {driver.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="orders">
                <div className="rounded-md border border-darkBorderV1">
                  <Table>
                    <TableHeader className="bg-darkBorderV1/20">
                      <TableRow>
                        <TableHead>Mã đơn</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Tài xế</TableHead>
                        <TableHead className="text-right">Giá trị</TableHead>
                        <TableHead className="text-right">Phí nền tảng</TableHead>
                        <TableHead className="text-center">Thanh toán</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportOrders?.data?.map((order: any) => (
                        <TableRow key={order.orderId}>
                          <TableCell className="font-mono text-xs">{order.orderId}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{order.driverName || '---'}</TableCell>
                          <TableCell className="text-right font-semibold">{formatCurrency(order.totalPrice)}</TableCell>
                          <TableCell className="text-right text-neutral-400">{formatCurrency(order.platformFee)}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="neutral">{order.paymentMethod}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={order.status === 'DELIVERED' ? 'emerald' : 'secondary'}>
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="customers">
                <div className="rounded-md border border-darkBorderV1">
                  <Table>
                    <TableHeader className="bg-darkBorderV1/20">
                      <TableRow>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Số điện thoại</TableHead>
                        <TableHead className="text-right">Tổng đơn</TableHead>
                        <TableHead className="text-right">Chi tiêu</TableHead>
                        <TableHead className="text-center">Hạng</TableHead>
                        <TableHead className="text-right">Đơn cuối</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loyaltyData?.data?.map((user: any) => (
                        <TableRow key={user.customerId}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell className="text-neutral-400">{user.phone}</TableCell>
                          <TableCell className="text-right">{user.totalOrders}</TableCell>
                          <TableCell className="text-right text-primary font-semibold">
                            {formatCurrency(user.totalSpending)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="emerald">{user.rank}</Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs text-neutral-400">
                            {new Date(user.lastOrder).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  {summary?.orders?.total || 0}
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
                  {summary?.orders?.completed || 0}
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
                  {summary?.orders?.cancelled || 0}
                </span>
              </div>
              <div className="pt-4 border-t border-darkBorderV1">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-300 font-semibold">
                    Tỷ lệ hoàn thành
                  </span>
                  <span className="font-semibold text-lg text-primary">
                    {summary?.orders?.total
                      ? (
                        (summary.orders.completed /
                          summary.orders.total) *
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

        <Card>
          <CardHeader className="border-b border-b-darkBorderV1 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon path={mdiCarSide} size={0.8} />
                <span className="font-semibold">Tài xế top hiệu suất</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {driversPerf?.data?.slice(0, 5).map((driver: any, index: number) => (
                <div
                  key={driver.driverId}
                  className="flex items-center gap-4 p-3 rounded-lg bg-darkBorderV1/20 border border-darkBorderV1/40"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-semibold">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{driver.name}</p>
                    <p className="text-xs text-neutral-400">{driver.completedOrders} đơn • {driver.rating}⭐</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">{formatCurrency(driver.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
