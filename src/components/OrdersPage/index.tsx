import { useState } from "react";
import { useAdminOrders, useCancelOrder } from "@/hooks/useAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersTable } from "@/components/OrdersPage/OrdersTable";
import { OrderDetailsDialog } from "@/components/OrdersPage/OrderDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { IconSearch, IconX } from "@tabler/icons-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const statusParam =
    statusFilter && statusFilter !== "ALL" ? statusFilter : undefined;

  const {
    data: ordersData,
    isLoading,
    refetch,
  } = useAdminOrders({
    status: statusParam,
    page: currentPage,
    limit: pageSize,
  });

  const { mutate: cancelOrderMutation, isPending: isCanceling } =
    useCancelOrder();

  const handleViewDetails = (id: string) => {
    setSelectedOrderId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleCancel = (id: string) => {
    setSelectedOrderId(id);
    setIsCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!selectedOrderId) {
      return Promise.resolve();
    }

    try {
      const reason = "Đã hủy bởi quản trị viên";
      cancelOrderMutation(
        { id: selectedOrderId, reason },
        {
          onSuccess: () => {
            refetch();
          },
        },
      );
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const displayOrders = ordersData?.data || [];

  return (
    <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Bảng điều khiển</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý đơn hàng</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="relative w-full md:w-96">
              <Input
                placeholder="Tìm kiếm theo mã đơn, khách hàng, tài xế..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 dark:text-neutral-200"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-neutral-200 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-neutral-200 hover:text-red-500 transition-colors"
                  type="button"
                >
                  <IconX className="w-5 h-5" />
                </button>
              )}
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="flex-wrap h-auto">
                <TabsTrigger value="ALL">Tất cả</TabsTrigger>
                <TabsTrigger value="PENDING">Đang chờ</TabsTrigger>
                <TabsTrigger value="ACCEPTED">Đã chấp nhận</TabsTrigger>
                <TabsTrigger value="PICKED_UP">Đã lấy hàng</TabsTrigger>
                <TabsTrigger value="DELIVERED">Đã giao hàng</TabsTrigger>
                <TabsTrigger value="CANCELLED">Đã hủy</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Card className="p-0 overflow-hidden border border-lightBorderV1 dark:border-darkBackgroundV1">
            {isLoading ? (
              <div className="p-4">
                <div className="flex flex-col gap-4">
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <OrdersTable
                orders={displayOrders}
                isSearching={false}
                onViewDetails={handleViewDetails}
                onCancel={handleCancel}
                currentPage={currentPage}
                pageSize={pageSize}
              />
            )}
          </Card>

          {(ordersData?.pagination?.total ?? 0) > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={ordersData?.pagination?.total ?? 0}
              totalPages={
                ordersData?.pagination?.total_pages ||
                Math.ceil((ordersData?.pagination?.total ?? 0) / pageSize)
              }
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </motion.div>

      <DeleteDialog
        isOpen={isCancelDialogOpen}
        isDeleting={isCanceling}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={confirmCancel}
        title="Hủy đơn hàng"
        description="Bạn có chắc chắn muốn hủy đơn hàng này không?"
        confirmText="Hủy đơn"
        successMessage="Hủy đơn hàng thành công!"
        errorMessage="Hủy đơn hàng thất bại."
        warningMessage="Khách hàng sẽ được thông báo về việc hủy đơn."
      />

      {selectedOrderId && (
        <OrderDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedOrderId(null);
          }}
          orderId={selectedOrderId}
        />
      )}
    </div>
  );
}
