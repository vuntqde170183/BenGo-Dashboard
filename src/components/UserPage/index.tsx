import { useEffect, useState } from "react";
import { useAdminUsers, useDeleteUser } from "@/hooks/useAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserTable } from "@/components/UserPage/UserTable";
import { UserCreateDialog } from "@/components/UserPage/UserCreateDialog";
import { UserDetailsDialog } from "@/components/UserPage/UserDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { IconSearch, IconUserPlus } from "@tabler/icons-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import Icon from "@mdi/react";
import { mdiAccountPlusOutline } from "@mdi/js";

export default function UserPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const roleParam = roleFilter && roleFilter !== "all" ? roleFilter : undefined;

  const {
    data: usersData,
    isLoading,
    refetch,
  } = useAdminUsers({
    search: searchQuery,
    role: roleParam,
    page: currentPage,
    limit: pageSize,
  });
  const { mutate: deleteUserMutation, isPending: isDeleting } = useDeleteUser();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
  };

  const handleEdit = (id: string) => {
    setSelectedUserId(id);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setSelectedUserId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUserId) {
      return Promise.resolve();
    }

    try {
      deleteUserMutation(selectedUserId);
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const displayUsers = usersData?.data || [];
  return (
    <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Bảng điều khiển</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý người dùng</BreadcrumbPage>
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
                placeholder="Tìm kiếm theo tên, email, sđt..."
                value={searchQuery}
                onChange={handleSearch}
                onClear={handleClearSearch}
                className="pl-10 pr-10 py-2 w-full"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-neutral-200 w-5 h-5" />
            </div>
            <div className="flex items-center gap-3">
              <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="DISPATCHER">Điều phối viên</SelectItem>
                  <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                  <SelectItem value="DRIVER">Tài xế</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Thêm người dùng
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
              <UserTable
                users={displayUsers}
                isSearching={false}
                onEdit={handleEdit}
                onDelete={handleDelete}
                currentPage={currentPage}
                pageSize={pageSize}
              />
            )}
          </Card>
          {(usersData?.pagination?.total ?? 0) > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={usersData?.pagination?.total ?? 0}
              totalPages={
                usersData?.pagination?.total_pages ||
                Math.ceil((usersData?.pagination?.total ?? 0) / pageSize)
              }
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
        title={`Xóa người dùng: ${
          displayUsers.find(
            (u: any) => u.id === selectedUserId || u._id === selectedUserId,
          )?.name || ""
        }`}
        description="Bạn có chắc chắn muốn xóa người dùng này không? Hành động này không thể hoàn tác."
        confirmText="Xóa người dùng"
        successMessage="Xóa người dùng thành công!"
        errorMessage="Xóa người dùng thất bại."
        warningMessage="Hành động này sẽ xóa vĩnh viễn người dùng và các dữ liệu liên quan."
      />

      <UserCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => refetch()}
      />

      {selectedUserId && (
        <UserDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedUserId(null);
          }}
          userId={selectedUserId}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
