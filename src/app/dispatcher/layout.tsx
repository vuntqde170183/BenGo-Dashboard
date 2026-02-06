import ProtectedRoute from "@/components/auth/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DispatcherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div suppressHydrationWarning>
            <ProtectedRoute allowedRoles={["DISPATCHER"]}>
                <DashboardLayout>{children}</DashboardLayout>
            </ProtectedRoute>
        </div>
    );
}
