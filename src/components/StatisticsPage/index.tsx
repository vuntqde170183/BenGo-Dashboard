import { useDashboardOverview } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@mdi/react";
import {
  mdiAccountGroup,
  mdiPackageVariant,
  mdiCarSide,
  mdiCurrencyUsd,
  mdiTrendingUp,
  mdiTicket,
  mdiChartLine,
  mdiShieldCheck,
  mdiHistory,
  mdiBellOutline,
  mdiAccountCircleOutline,
} from "@mdi/js";
import { formatCurrency } from "@/lib/formatters";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Mock data for charts
const revenueData = [
  { name: "Mon", revenue: 4000, orders: 240 },
  { name: "Tue", revenue: 3000, orders: 198 },
  { name: "Wed", revenue: 2000, orders: 300 },
  { name: "Thu", revenue: 2780, orders: 180 },
  { name: "Fri", revenue: 1890, orders: 250 },
  { name: "Sat", revenue: 2390, orders: 380 },
  { name: "Sun", revenue: 3490, orders: 430 },
];

const recentActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "completed a ride",
    time: "2 mins ago",
    icon: mdiCarSide,
    color: "text-blue-400",
  },
  {
    id: 2,
    user: "Alice Smith",
    action: "registered as a driver",
    time: "15 mins ago",
    icon: mdiAccountGroup,
    color: "text-green-400",
  },
  {
    id: 3,
    user: "System",
    action: "payout processed",
    time: "1 hour ago",
    icon: mdiCurrencyUsd,
    color: "text-purple-400",
  },
  {
    id: 4,
    user: "Tech Support",
    action: "resolved ticket #1204",
    time: "2 hours ago",
    icon: mdiTicket,
    color: "text-orange-400",
  },
];

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
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <h3 className="text-2xl font-bold mt-2">{value}</h3>
                {subtitle && (
                  <p className="text-sm text-neutral-200 mt-1">{subtitle}</p>
                )}
                {trend && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-sm text-nowrap">
                    <Icon path={mdiTrendingUp} size={0.7} />
                    <span>{trend}</span>
                  </div>
                )}
              </div>
              <div className="p-3 rounded-full bg-darkBorderV1 text-neutral-200">
                {icon}
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
    <div className="space-y-6 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Metric Cards Skeleton */}
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

      {/* Main Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart Skeleton */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        {/* Quick Stats Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>

        {/* System Status Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Activity Log Skeleton */}
      <Card>
        <CardHeader>
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
  const { data: overview, isLoading } = useDashboardOverview();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-neutral-200">Dashboard</h1>
          <p className="text-neutral-400 mt-1">
            Welcome back, here's what's happening today.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="ghost"
            className="flex items-center gap-2 py-2 px-4 bg-darkCardV1 border-darkBorderV1"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Updates
          </Badge>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Icon path={mdiAccountGroup} size={0.8} />}
          title="Total Users"
          value={overview?.users || 0}
          trend="+12% from last month"
          href="/admin/users"
        />
        <MetricCard
          icon={<Icon path={mdiPackageVariant} size={0.8} />}
          title="Active Orders"
          value={overview?.activeOrders || 0}
          subtitle={`${overview?.orders || 0} total orders`}
          href="/admin/orders"
        />
        <MetricCard
          icon={<Icon path={mdiCarSide} size={0.8} />}
          title="Drivers"
          value={overview?.drivers || 0}
          subtitle="Total registered"
          href="/admin/drivers"
        />
        <MetricCard
          icon={<Icon path={mdiCurrencyUsd} size={0.8} />}
          title="Revenue"
          value={formatCurrency(overview?.revenue || 0)}
          subtitle="Total earnings"
          href="/admin/pricing"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart - Expanded */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon path={mdiChartLine} size={0.8} />
                <span className="text-lg text-neutral-200">Revenue Growth</span>
              </div>
              <Badge variant="ghost">Weekly</Badge>
            </CardTitle>
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
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#051A1D",
                      border: "1px solid #233738",
                      borderRadius: "8px",
                      color: "#E5E5E5",
                    }}
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

        {/* Original Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon path={mdiChartLine} size={0.8} />
              <span className="text-lg">Quick Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon path={mdiTicket} size={0.7} />
                  Pending Tickets
                </span>
                <span className="font-semibold text-base">
                  {overview?.pendingTickets || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon path={mdiPackageVariant} size={0.7} />
                  Active Orders
                </span>
                <span className="font-semibold text-base">
                  {overview?.activeOrders || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon path={mdiPackageVariant} size={0.7} />
                  Total Orders
                </span>
                <span className="font-semibold text-base">
                  {overview?.orders || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Original System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Icon path={mdiShieldCheck} size={0.8} />
              <span className="text-lg">System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon path={mdiShieldCheck} size={0.7} />
                  System Health
                </span>
                <Badge variant="ghost">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon path={mdiChartLine} size={0.7} />
                  API Status
                </span>
                <Badge variant="ghost">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Icon path={mdiTrendingUp} size={0.7} />
                  Last Updated
                </span>
                <span className="text-sm text-neutral-200">Just now</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon path={mdiHistory} size={0.8} />
              <span className="text-lg text-neutral-200">Recent Activity</span>
            </div>
            <Link
              to="/admin/logs"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <Icon path={mdiTrendingUp} size={0.6} className="rotate-45" />
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-darkBorderV1/20 border border-darkBorderV1/40 hover:bg-darkBorderV1/30 transition-colors"
              >
                <div
                  className={`p-3 rounded-full bg-darkCardV1 ${activity.color}`}
                >
                  <Icon path={activity.icon} size={0.8} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-200">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-sm text-neutral-400 mt-0.5">
                    {activity.time}
                  </p>
                </div>
                <div className="p-2 rounded bg-darkCardV1 text-neutral-400">
                  <Icon path={mdiAccountCircleOutline} size={0.8} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
