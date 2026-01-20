import { useEffect, useState } from "react";
import {
  useAdminDrivers,
  useUpdateDriverStatus,
  useDeleteDriver,
} from "@/hooks/useAdmin";
import { ViewReasonDialog, UpdateStatusDialog } from "./DriverStatusDialogs";
import { DriverDetailsDialog } from "./DriverDetailsDialog";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DriverTable } from "@/components/DriversPage/DriverTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { IconSearch, IconUserPlus } from "@tabler/icons-react";
import { DriverCreateDialog } from "./DriverCreateDialog";
import { DeleteDialog } from "@/components/ui/delete-dialog";

export default function DriversPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("APPROVED");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedDriver, setSelectedDriver] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [targetStatus, setTargetStatus] = useState<
    "APPROVED" | "PENDING" | "LOCKED" | "REJECTED"
  >("APPROVED");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDriverForDelete, setSelectedDriverForDelete] =
    useState<any>(null);
  const { mutate: updateStatus, isPending: isUpdating } =
    useUpdateDriverStatus();
  const { mutate: deleteDriverMutation, isPending: isDeleting } =
    useDeleteDriver();

  const statusParam = statusFilter;

  const { data: driversData, isLoading } = useAdminDrivers({
    search: searchQuery,
    status: statusParam,
    page: currentPage,
    limit: pageSize,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleStatusUpdate = async (
    inputReason: string,
    inputNote?: string,
  ) => {
    if (!selectedDriver) return;

    const payload: any = {
      driverId: selectedDriver._id,
      status: targetStatus,
    };

    if (targetStatus === "LOCKED") {
      payload.reason = inputReason;
      payload.note = inputNote;
    } else if (targetStatus === "REJECTED") {
      payload.reason = inputReason;
      payload.note = inputNote; // Optional for rejected if needed, or omit
    }

    updateStatus(payload, {
      onSuccess: () => {
        setUpdateDialogOpen(false);
        setSelectedDriver(null);
      },
    });
  };

  const openUpdateDialog = (
    id: string,
    status: "APPROVED" | "PENDING" | "LOCKED" | "REJECTED",
  ) => {
    const driver = displayDrivers.find((d: any) => d._id === id);
    if (driver) {
      setSelectedDriver(driver);
      setTargetStatus(status);
      setUpdateDialogOpen(true);
    }
  };

  const handleEdit = (id: string) => {
    const driver = displayDrivers.find((d: any) => d._id === id);
    if (driver) {
      if (driver.status === "LOCKED" || driver.status === "REJECTED") {
        setSelectedDriver(driver);
        setViewDialogOpen(true);
      } else {
        setSelectedDriverId(driver.userId?._id || driver.userId?.id || id);
        setDetailsDialogOpen(true);
      }
    }
  };

  const handleDelete = (id: string) => {
    const driver = displayDrivers.find((d: any) => d._id === id);
    if (driver) {
      setSelectedDriverForDelete(driver);
      setIsDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!selectedDriverForDelete) return Promise.resolve();

    try {
      deleteDriverMutation(selectedDriverForDelete._id);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const displayDrivers = driversData?.data || [];

  return (
    <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Bảng điều khiển</BreadcrumbLink>
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
                  <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                  <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                  <SelectItem value="LOCKED">Đã khóa</SelectItem>
                  <SelectItem value="REJECTED">Từ chối</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setCreateDialogOpen(true)}>
                Thêm tài xế
                <IconUserPlus className="h-4 w-4" />
              </Button>
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
                isSearching={!!searchQuery}
                currentPage={currentPage}
                pageSize={pageSize}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onApprove={(id) => openUpdateDialog(id, "APPROVED")}
                onReject={(id) => openUpdateDialog(id, "REJECTED")}
                onLock={(id) => openUpdateDialog(id, "LOCKED")}
                onUnlock={(id) => openUpdateDialog(id, "APPROVED")}
              />
            )}
          </Card>
          {(driversData?.pagination?.total ?? 0) > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={driversData?.pagination?.total ?? 0}
              totalPages={
                driversData?.pagination?.total_pages ||
                Math.ceil((driversData?.pagination?.total ?? 0) / pageSize)
              }
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </motion.div>

      <ViewReasonDialog
        isOpen={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        adminNote={selectedDriver?.adminNote}
        rejectionReason={selectedDriver?.rejectionReason}
      />

      <UpdateStatusDialog
        isOpen={updateDialogOpen}
        onClose={() => setUpdateDialogOpen(false)}
        onConfirm={handleStatusUpdate}
        isLoading={isUpdating}
        title={
          targetStatus === "APPROVED"
            ? "Duyệt tài khoản"
            : targetStatus === "REJECTED"
              ? "Từ chối tài khoản"
              : targetStatus === "LOCKED"
                ? "Khóa tài khoản"
                : "Cập nhật trạng thái"
        }
        description={
          targetStatus === "APPROVED"
            ? "Bạn có chắc chắn muốn duyệt tài xế này? Tài xế sẽ có thể hoạt động ngay sau khi duyệt."
            : targetStatus === "REJECTED"
              ? "Vui lòng nhập lý do từ chối tài xế. Hành động này không thể hoàn tác."
              : targetStatus === "LOCKED"
                ? "Vui lòng nhập lý do khóa tài khoản. Tài xế sẽ không thể nhận chuyến."
                : "Xác nhận thay đổi trạng thái?"
        }
        isReasonRequired={
          targetStatus === "LOCKED" || targetStatus === "REJECTED"
        }
        confirmText={
          targetStatus === "APPROVED"
            ? "Duyệt ngay"
            : targetStatus === "REJECTED"
              ? "Từ chối"
              : targetStatus === "LOCKED"
                ? "Khóa ngay"
                : "Xác nhận"
        }
        confirmButtonVariant={
          targetStatus === "APPROVED"
            ? "default"
            : targetStatus === "REJECTED" || targetStatus === "LOCKED"
              ? "destructive"
              : "default"
        }
      />

      <DriverCreateDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={() => {
          setCreateDialogOpen(false);
        }}
      />

      {selectedDriverId && (
        <DriverDetailsDialog
          isOpen={detailsDialogOpen}
          onClose={() => {
            setDetailsDialogOpen(false);
            setSelectedDriverId("");
          }}
          driverId={selectedDriverId}
          onSuccess={() => {
            // Refetch drivers data will happen automatically via react-query
          }}
        />
      )}
      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={`Xóa tài xế: ${selectedDriverForDelete?.userId?.name || ""}`}
        description="Bạn có chắc chắn muốn xóa tài xế này không? Hành động này không thể hoàn tác."
        confirmText="Xóa tài xế"
        successMessage="Xóa tài xế thành công!"
        errorMessage="Xóa tài xế thất bại."
        warningMessage="Hành động này sẽ xóa vĩnh viễn tài xế và các dữ liệu liên quan."
      />
    </div>
  );
}
