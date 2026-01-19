import type { MenuItem } from "@/interface/types";
import {
	mdiViewDashboard,
	mdiAccountGroup,
	mdiCarSide,
	mdiPackageVariant,
	mdiCurrencyUsd,
	mdiGift,
	mdiTicket,
	mdiCog
} from "@mdi/js";

export const getDashboardMenuItems = (): MenuItem[] => [
	{
		id: "dashboard",
		name: "Bảng điều khiển",
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
		subMenu: [
			{
				id: "pricing-config",
				name: "Cấu hình",
				path: "/admin/pricing",
				icon: mdiCurrencyUsd,
			},
			{
				id: "revenue-reports",
				name: "Báo cáo doanh thu",
				path: "/admin/reports",
				icon: mdiCurrencyUsd,
			},
		],
	},
	{
		id: "promotions",
		name: "Quản lý khuyến mãi",
		path: "/admin/promotions",
		icon: mdiGift,
	},
	{
		id: "support-tickets",
		name: "Quản lý hỗ trợ",
		path: "/admin/tickets",
		icon: mdiTicket,
	},
	{
		id: "settings",
		name: "Cài đặt",
		path: "/admin/settings",
		icon: mdiCog,
	},
]; 





