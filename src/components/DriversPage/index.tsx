import { useEffect, useState } from "react";
import { useAdminDrivers, useDeleteDriver } from "@/hooks/useAdmin";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DriverTable } from "@/components/DriversPage/DriverTable";
import { DriverDetailsDialog } from "@/components/DriversPage/DriverDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { IconSearch } from "@tabler/icons-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export default function DriversPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("APPROVED");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const statusParam =
    statusFilter && statusFilter !== "all" ? statusFilter : undefined;

  const {
    data: driversData,
    isLoading,
    refetch,
  } = useAdminDrivers({
    search: searchQuery,
    status: statusParam,
    page: currentPage,
    limit: pageSize,
  });
  const { mutate: deleteDriverMutation, isPending: isDeleting } =
    useDeleteDriver();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleEdit = (id: string) => {
    setSelectedDriverId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedDriverId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDriverId) {
      return Promise.resolve();
    }

    try {
      deleteDriverMutation(selectedDriverId);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const displayDrivers = driversData?.data?.data || [];

  return (
    <div className="space-y-6 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý tài xế</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-96">
              <Input
                placeholder="Tìm kiếm theo tên, email, biển số xe..."
                value={searchQuery}
                onChange={handleSearch}
                onClear={handleClearSearch}
                className="pl-10 pr-10 py-2 w-full"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-neutral-200 w-5 h-5" />
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                  <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                  <SelectItem value="LOCKED">Đã khóa</SelectItem>
                  <SelectItem value="REJECTED">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
              <DriverTable
                drivers={displayDrivers}
                isSearching={false}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentPage={currentPage}
                pageSize={pageSize}
              />
            )}
          </Card>
          {(driversData?.data?.meta?.total ?? 0) > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={driversData?.data?.meta?.total ?? 0}
              totalPages={Math.ceil(
                (driversData?.data?.meta?.total ?? 0) / pageSize
              )}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </motion.div>
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={`Xóa tài xế: ${
          displayDrivers.find((d: any) => d._id === selectedDriverId)?.userId
            ?.name || ""
        }`}
        description="Bạn có chắc chắn muốn xóa tài xế này không? Hành động này không thể hoàn tác."
        confirmText="Xóa tài xế"
        successMessage="Xóa tài xế thành công!"
        errorMessage="Xóa tài xế thất bại."
        warningMessage="Hành động này sẽ xóa vĩnh viễn tài xế và các dữ liệu liên quan."
      />

      {selectedDriverId && (
        <DriverDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedDriverId(null);
          }}
          driverId={selectedDriverId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
