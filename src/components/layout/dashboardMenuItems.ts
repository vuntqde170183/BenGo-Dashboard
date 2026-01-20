import type { MenuItem } from "@/interface/types";
import {
	mdiViewDashboard,
	mdiAccountGroup,
	mdiCarSide,
	mdiPackageVariant,
	mdiCurrencyUsd,
	mdiGift,
	mdiTicket,
	mdiViewQuilt
} from "@mdi/js";

export const getDashboardMenuItems = (): MenuItem[] => [
	{
		id: "dashboard",
		name: "Báo cáo và thống kê",
		path: "/admin",
		icon: mdiViewDashboard,
	},
	{
		id: "user-management",
		name: "Quản lý người dùng",
		path: "/admin/users",
		icon: mdiAccountGroup,
	},
	{
		id: "driver-management",
		name: "Quản lý tài xế",
		path: "/admin/drivers",
		icon: mdiCarSide,
	},
	{
		id: "order-management",
		name: "Quản lý đơn hàng",
		path: "/admin/orders",
		icon: mdiPackageVariant,
	},
	{
		id: "financial",
		name: "Cấu hình giá",
		path: "/admin/pricing",
		icon: mdiCurrencyUsd,
	},
	{
		id: "promotions",
		name: "Quản lý khuyến mãi",
		path: "/admin/promotions",
		icon: mdiGift,
	},
	{
		id: "support-tickets",
		name: "Quản lý Ticket",
		path: "/admin/tickets",
		icon: mdiTicket,
	},
	{
		id: "content-management",
		name: "Quản lý nội dung",
		path: "/admin/content",
		icon: mdiViewQuilt,
	},
];