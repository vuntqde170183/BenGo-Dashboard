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
import { formatRelativeTime, getPriorityVariant } from "@/lib/format";
import { getStatusBadge } from "@/lib/badge-helpers";
import { Input } from "@/components/ui/input";
import { IconSearch, IconX } from "@tabler/icons-react";

export default function TicketsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("OPEN");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage] = useState(1);
  const pageSize = 10;

  const {
    data: ticketsData,
    isLoading,
    refetch,
  } = useAdminTickets({
    status: statusFilter,
    page: currentPage,
    limit: pageSize,
  });

  const { mutate: updateStatusMutation } = useUpdateTicketStatus();

  const handleResolve = (ticketId: string) => {
    const resolution = prompt("Nhập ghi chú giải quyết:");
    if (resolution) {
      updateStatusMutation(
        {
          id: ticketId,
          data: { status: "RESOLVED", resolution },
        },
        {
          onSuccess: () => {
            refetch();
          },
        },
      );
    }
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
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Yêu cầu hỗ trợ</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Input
                placeholder="Tìm kiếm yêu cầu..."
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
              <TabsList>
                <TabsTrigger value="OPEN">Đang mở</TabsTrigger>
                <TabsTrigger value="IN_PROGRESS">Đang xử lý</TabsTrigger>
                <TabsTrigger value="RESOLVED">Đã giải quyết</TabsTrigger>
                <TabsTrigger value="CLOSED">Đã đóng</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
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
          ) : displayTickets.length === 0 ? (
            <div className="text-center py-12 text-neutral-200">
              Không tìm thấy yêu cầu nào
            </div>
          ) : (
            <div className="space-y-4">
              {displayTickets.map((ticket: any) => (
                <Card
                  key={ticket._id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">
                            #{ticket._id?.slice(-6)}
                          </CardTitle>
                          <Badge
                            variant={getPriorityVariant(
                              ticket.priority || "LOW",
                            )}
                          >
                            {ticket.priority || "LOW"}
                          </Badge>
                        </div>
                        <p className="text-sm text-neutral-200">
                          bởi {ticket.userId?.name || "Ẩn danh"} •{" "}
                          {formatRelativeTime(ticket.createdAt)}
                        </p>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold mb-2">{ticket.subject}</h3>
                    <p className="text-sm text-neutral-400">{ticket.content}</p>
                    {ticket.assignedTo && (
                      <p className="text-sm text-neutral-200 mt-2">
                        Giao cho: {ticket.assignedTo}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    {!ticket.assignedTo && (
                      <Button variant="outline" size="sm">
                        Giao việc
                      </Button>
                    )}
                    {ticket.status !== "RESOLVED" &&
                      ticket.status !== "CLOSED" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleResolve(ticket._id)}
                        >
                          Đã giải quyết
                        </Button>
                      )}
                    <Button variant="ghost" size="sm">
                      Xem chi tiết
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
