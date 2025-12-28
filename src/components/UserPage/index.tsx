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
import { IconSearch, IconPlus, IconX } from "@tabler/icons-react";
import { DeleteDialog } from "@/components/ui/delete-dialog";

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
    <div className="space-y-6 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>User Management</BreadcrumbPage>
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
                placeholder="Search by name, email, role, department..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-10 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 text-gray-800"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800 w-5 h-5" />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 hover:text-red-500 transition-colors"
                  type="button"
                >
                  <IconX className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                <SelectTrigger className="w-[180px] focus:border-mainTextHoverV1">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="DRIVER">Driver</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-mainTextHoverV1 hover:bg-primary/90 text-neutral-200"
              >
                <IconPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>

          <Card className="p-0 overflow-hidden border border-lightBorderV1">
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
          {usersData?.meta?.total && usersData.meta.total > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={usersData.meta.total}
              totalPages={Math.ceil(usersData.meta.total / pageSize)}
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
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete User"
        successMessage="User deleted successfully!"
        errorMessage="Failed to delete user."
        warningMessage="This will permanently remove the user and all associated data."
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
