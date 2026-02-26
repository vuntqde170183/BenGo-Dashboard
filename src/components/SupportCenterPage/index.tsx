import { useState, useEffect } from "react";
import { useSupportTickets, useUpdateSupportTicket } from "@/hooks/useDispatcher";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SupportTicketsTable, SupportTicketsTableSkeleton } from "./SupportTicketsTable";
import ProcessTicketDialog from "./ProcessTicketDialog";
import { ISupportTicket, TicketStatus } from "@/interface/dispatcher";
import { motion } from "framer-motion";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { IconSearch, IconX } from "@tabler/icons-react";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function SupportCenterPage() {
    const [statusFilter, setStatusFilter] = useState<TicketStatus | "ALL">("OPEN");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedTicket, setSelectedTicket] = useState<ISupportTicket | null>(null);
    const [modalAction, setModalAction] = useState<'ACCEPT' | 'RESOLVE' | 'CLOSE' | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearch, statusFilter]);

    const { data: tickets, isLoading } = useSupportTickets({
        status: statusFilter === "ALL" ? undefined : statusFilter,
        // search: debouncedSearch, // Assuming the hook supports search if needed, or filter locally if small dataset
    });

    // Local filtering if search is not supported by hook yet
    const filteredTickets = tickets?.filter(t => {
        const search = debouncedSearch.toLowerCase();
        return (
            t._id.toLowerCase().includes(search) ||
            t.userId?.name?.toLowerCase().includes(search) ||
            t.userId?.phone?.includes(search) ||
            t.subject?.toLowerCase().includes(search) ||
            t.content?.toLowerCase().includes(search)
        );
    }) || [];

    const updateMutation = useUpdateSupportTicket();

    const handleConfirmUpdate = (status: Exclude<TicketStatus, 'OPEN'>, note?: string, resolution?: string) => {
        if (selectedTicket) {
            updateMutation.mutate({
                id: selectedTicket._id,
                data: {
                    status,
                    note,
                    resolution
                }
            }, {
                onSuccess: () => {
                    setModalAction(null);
                    setSelectedTicket(null);
                }
            });
        }
    };

    const handleClearSearch = () => setSearchQuery("");

    return (
        <TooltipProvider>
            <div className="space-y-4 bg-darkCardV1 p-4 rounded-2xl border border-darkBorderV1 flex flex-col">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Bảng điều khiển</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Hỗ trợ & Khiếu nại</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col min-h-0"
                >
                    <div className="flex flex-col gap-4 h-full">
                        <div className="flex items-center justify-between w-full gap-2">
                            <div className="relative flex-1">
                                <Input
                                    placeholder="Tìm kiếm mã phiếu, tên, sđt..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-10 py-2 w-full border-lightBorderV1 focus:border-mainTextHoverV1 dark:text-neutral-300"
                                />
                                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                                {searchQuery && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-neutral-300 hover:text-red-500 transition-colors"
                                        type="button"
                                    >
                                        <IconX className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                            <Tabs value={statusFilter} onValueChange={(val) => setStatusFilter(val as any)}>
                                <TabsList className="flex-wrap h-auto">
                                    <TabsTrigger value="ALL">Tất cả</TabsTrigger>
                                    <TabsTrigger value="OPEN">Mới tiếp nhận</TabsTrigger>
                                    <TabsTrigger value="IN_PROGRESS">Đang xử lý</TabsTrigger>
                                    <TabsTrigger value="RESOLVED">Đã giải quyết</TabsTrigger>
                                    <TabsTrigger value="CLOSED">Đã đóng</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <Card className="flex-1 overflow-hidden border border-lightBorderV1 dark:border-darkBackgroundV1 bg-transparent p-0 flex flex-col min-h-0 shadow-none">
                            {isLoading ? (
                                <SupportTicketsTableSkeleton />
                            ) : (
                                <SupportTicketsTable
                                    tickets={filteredTickets}
                                    onAccept={(ticket) => {
                                        setSelectedTicket(ticket);
                                        setModalAction('ACCEPT');
                                    }}
                                    onResolve={(ticket) => {
                                        setSelectedTicket(ticket);
                                        setModalAction('RESOLVE');
                                    }}
                                    onClose={(ticket) => {
                                        setSelectedTicket(ticket);
                                        setModalAction('CLOSE');
                                    }}
                                    currentPage={currentPage}
                                    pageSize={pageSize}
                                />
                            )}
                        </Card>
                    </div>
                </motion.div>

                <ProcessTicketDialog
                    isOpen={!!modalAction}
                    onClose={() => {
                        setModalAction(null);
                        setSelectedTicket(null);
                    }}
                    ticket={selectedTicket}
                    actionType={modalAction}
                    onConfirm={handleConfirmUpdate}
                    isPending={updateMutation.isPending}
                />
            </div>
        </TooltipProvider>
    );
}
