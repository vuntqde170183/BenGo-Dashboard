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
} from "@mdi/js";
import { formatCurrency } from "@/lib/formatters";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  color: string;
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
        <Card className="h-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <h3 className="text-2xl font-bold mt-2">{value}</h3>
                {subtitle && (
                  <p className="text-sm text-neutral-200 mt-1">{subtitle}</p>
                )}
                {trend && (
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function StatisticsPage() {
  const { data: overview, isLoading } = useDashboardOverview();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 bg-darkCardV1 p-4 rounded-lg border border-darkBorderV1">
      <div>
        <h1 className="text-3xl font-bold text-neutral-200">Dashboard</h1>
        <p className="text-neutral-400 mt-1">
          Welcome to BenGo Admin Dashboard
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Icon path={mdiAccountGroup} size={1} />}
          title="Total Users"
          value={overview?.users || 0}
          trend="+12% from last month"
          color="blue"
          href="/admin/users"
        />
        <MetricCard
          icon={<Icon path={mdiPackageVariant} size={1} />}
          title="Active Orders"
          value={overview?.activeOrders || 0}
          subtitle={`${overview?.orders || 0} total orders`}
          color="orange"
          href="/admin/orders"
        />
        <MetricCard
          icon={<Icon path={mdiCarSide} size={1} />}
          title="Drivers"
          value={overview?.drivers || 0}
          subtitle="Total registered"
          color="green"
          href="/admin/drivers"
        />
        <MetricCard
          icon={<Icon path={mdiCurrencyUsd} size={1} />}
          title="Revenue"
          value={formatCurrency(overview?.revenue || 0)}
          subtitle="Total earnings"
          color="purple"
          href="/admin/pricing"
        />
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
    </div>
  );
}
