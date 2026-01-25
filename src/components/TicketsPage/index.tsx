import { useState } from "react";
import { useAdminTickets, useUpdateTicketStatus } from "@/hooks/useAdmin";
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
import { TicketsTable } from "@/components/TicketsPage/TicketsTable";
import { TicketDetailsDialog } from "@/components/TicketsPage/TicketDetailsDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { motion } from "framer-motion";
import { IconSearch, IconX } from "@tabler/icons-react";

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const statusParam =
    statusFilter && statusFilter !== "ALL" ? statusFilter : undefined;

  const {
    data: ticketsData,
    isLoading,
    refetch,
  } = useAdminTickets({
    status: statusParam,
    page: currentPage,
    limit: pageSize,
  });

  const { mutate: updateStatusMutation } = useUpdateTicketStatus();

  const handleViewDetails = (id: string) => {
    setSelectedTicketId(id);
    setIsDetailsDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const displayTickets = ticketsData?.data || [];

  return (
    <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Bảng điều khiển</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Quản lý ticket</BreadcrumbPage>
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
                placeholder="Tìm kiếm theo mã yêu cầu, người dùng..."
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
                <TabsTrigger value="OPEN">Đang mở</TabsTrigger>
                <TabsTrigger value="IN_PROGRESS">Đang xử lý</TabsTrigger>
                <TabsTrigger value="RESOLVED">Đã giải quyết</TabsTrigger>
                <TabsTrigger value="CLOSED">Đã đóng</TabsTrigger>
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
              <TicketsTable
                tickets={displayTickets}
                isSearching={false}
                onViewDetails={handleViewDetails}
                currentPage={currentPage}
                pageSize={pageSize}
              />
            )}
          </Card>

          {(ticketsData?.pagination?.total ?? 0) > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={ticketsData?.pagination?.total ?? 0}
              totalPages={
                ticketsData?.pagination?.total_pages ||
                Math.ceil((ticketsData?.pagination?.total ?? 0) / pageSize)
              }
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </motion.div>

      {selectedTicketId && (
        <TicketDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => {
            setIsDetailsDialogOpen(false);
            setSelectedTicketId(null);
          }}
          ticketId={selectedTicketId}
        />
      )}
    </div>
  );
}
