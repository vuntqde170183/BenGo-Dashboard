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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { IconPlus, IconTrash, IconEdit } from "@tabler/icons-react";
import { formatCurrency, formatDate } from "@/lib/format";
import { DeleteDialog } from "@/components/ui/delete-dialog";
import { PromotionCreateDialog } from "@/components/PromotionsPage/PromotionCreateDialog";
import { PromotionDetailsDialog } from "@/components/PromotionsPage/PromotionDetailsDialog";

export default function PromotionsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<any>(null);

  const activeParam =
    filterStatus === "ACTIVE"
      ? true
      : filterStatus === "EXPIRED"
        ? false
        : undefined;

  const {
    data: promotionsData,
    isLoading,
    refetch,
  } = useAdminPromotions({
    active: activeParam,
  });

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
    <div className="space-y-6 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
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
          <div className="flex items-center justify-between">
            <Tabs value={filterStatus} onValueChange={setFilterStatus}>
              <TabsList>
                <TabsTrigger value="ALL">Tất cả</TabsTrigger>
                <TabsTrigger value="ACTIVE">Đang hoạt động</TabsTrigger>
                <TabsTrigger value="EXPIRED">Hết hạn</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <IconPlus className="h-4 w-4 mr-2" />
              Tạo khuyến mãi
            </Button>
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
                <Card
                  key={promo._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{promo.title}</CardTitle>
                        <p className="text-sm text-neutral-200 mt-1 font-mono">
                          Mã: {promo.code}
                        </p>
                      </div>
                      <Badge variant={promo.isActive ? "default" : "secondary"}>
                        {promo.isActive ? "Đang hoạt động" : "Không hoạt động"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {promo.imageUrl && (
                      <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {promo.description}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-200">Giảm giá:</span>
                        <span className="font-medium">
                          {promo.discountType === "PERCENTAGE"
                            ? `${promo.discountValue}%`
                            : formatCurrency(promo.discountValue)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-200">Đơn tối thiểu:</span>
                        <span className="font-medium">
                          {formatCurrency(promo.minOrderValue || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-200">Lượt dùng:</span>
                        <span className="font-medium">
                          {promo.usedCount || 0} / {promo.usageLimit || "∞"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-200">Hạn dùng:</span>
                        <span className="font-medium">
                          {formatDate(promo.endDate)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      size="sm"
                      onClick={() => handleEdit(promo)}
                    >
                      <IconEdit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(promo)}
                    >
                      <IconTrash className="w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
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
