import { useState } from "react";
import { useAdminPromotions, useDeletePromotion } from "@/hooks/useAdmin";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { IconGift, IconPlus, IconSearch, IconX } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { PromotionCreateDialog } from "@/components/PromotionsPage/PromotionCreateDialog";
import { PromotionDetailsDialog } from "@/components/PromotionsPage/PromotionDetailsDialog";
import { PromotionCard } from "@/components/PromotionsPage/PromotionCard";

export default function PromotionsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(9);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);

  const {
    data: promotionsData,
    isLoading,
    refetch,
  } = useAdminPromotions({
    status: filterStatus === "ALL" ? undefined : filterStatus,
    search: searchQuery || undefined,
    page: currentPage,
    limit: pageSize,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleStatusChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const { mutate: deletePromotionMutation, isPending: isDeleting } =
    useDeletePromotion();

  const handleDelete = (promotion: any) => {
    setSelectedPromotion(promotion);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (promotion: any) => {
    setSelectedPromotion(promotion);
    setIsDetailsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPromotion) {
      return Promise.resolve();
    }

    try {
      deletePromotionMutation(selectedPromotion._id, {
        onSuccess: () => {
          refetch();
        },
      });
      return Promise.resolve();
    } catch (error) {
      throw error;
    }
  };

  const displayPromotions = promotionsData?.data || [];

  return (
    <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">
              Bảng điều khiển
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Chương trình khuyến mãi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Input
                placeholder="Tìm kiếm mã hoặc tiêu đề..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-10 py-2 w-full border-darkBorderV1 focus:border-primary/50 bg-darkBackgroundV1/50 transition-all"
              />
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-red-500 transition-colors"
                  type="button"
                >
                  <IconX className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <Tabs value={filterStatus} onValueChange={handleStatusChange}>
                <TabsList>
                  <TabsTrigger value="ALL">Tất cả</TabsTrigger>
                  <TabsTrigger value="ACTIVE">Đang hoạt động</TabsTrigger>
                  <TabsTrigger value="INACTIVE">
                    Hết hạn hoặc hết lượt
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="whitespace-nowrap"
              >
                Thêm khuyến mãi
                <IconGift className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Skeleton className="h-6 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : displayPromotions.length === 0 ? (
            <div className="text-center py-12 text-neutral-200">
              Không tìm thấy chương trình khuyến mãi nào
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayPromotions.map((promo: any) => (
                <PromotionCard
                  key={promo._id}
                  promo={promo}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {(promotionsData?.pagination?.total ?? 0) > pageSize && (
            <div className="pt-4 border-t border-darkBorderV1">
              <Pagination
                page={currentPage}
                pageSize={pageSize}
                total={promotionsData?.pagination?.total ?? 0}
                totalPages={
                  promotionsData?.pagination?.total_pages ||
                  Math.ceil((promotionsData?.pagination?.total ?? 0) / pageSize)
                }
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </motion.div>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        isDeleting={isDeleting}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa khuyến mãi"
        description="Bạn có chắc chắn muốn xóa chương trình khuyến mãi này không?"
        confirmText="Xóa khuyến mãi"
        successMessage="Xóa chương trình khuyến mãi thành công!"
        errorMessage="Xóa chương trình khuyến mãi thất bại."
        warningMessage="Hành động này sẽ xóa vĩnh viễn mã khuyến mãi này."
      />

      <PromotionCreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSuccess={() => refetch()}
      />

      {selectedPromotion && (
        <PromotionDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedPromotion(null);
          }}
          promotion={selectedPromotion}
          onSuccess={() => refetch()}
        />
      )}
    </div>
  );
}
