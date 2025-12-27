import { useDashboardOverview } from "@/hooks/useAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, Car, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  color: string;
  href: string;
}

function MetricCard({ icon, title, value, subtitle, trend, color, href }: MetricCardProps) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-green-100 text-green-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600"
  };

  return (
    <Link to={href}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <h3 className="text-2xl font-bold mt-2">{value}</h3>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
              {trend && (
                <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>{trend}</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data: overview, isLoading } = useDashboardOverview();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to BenGo Admin Dashboard</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Users className="w-6 h-6" />}
          title="Total Users"
          value={overview?.users || 0}
          trend="+12% from last month"
          color="blue"
          href="/admin/users"
        />
        <MetricCard
          icon={<Package className="w-6 h-6" />}
          title="Active Orders"
          value={overview?.activeOrders || 0}
          subtitle={`${overview?.orders || 0} total orders`}
          color="orange"
          href="/admin/orders"
        />
        <MetricCard
          icon={<Car className="w-6 h-6" />}
          title="Drivers"
          value={overview?.drivers || 0}
          subtitle="Total registered"
          color="green"
          href="/admin/drivers"
        />
        <MetricCard
          icon={<DollarSign className="w-6 h-6" />}
          title="Revenue"
          value={formatCurrency(overview?.revenue || 0)}
          subtitle="Total earnings"
          color="purple"
          href="/admin/pricing"
        />
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Tickets</span>
                <span className="font-semibold">{overview?.pendingTickets || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Orders</span>
                <span className="font-semibold">{overview?.activeOrders || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-semibold">{overview?.orders || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">System Health</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">API Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="text-sm text-gray-500">Just now</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
