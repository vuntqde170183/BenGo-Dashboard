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
		name: "Dashboard",
		path: "/admin",
		icon: mdiViewDashboard,
	},
	{
		id: "user-management",
		name: "User Management",
		path: "/admin/users",
		icon: mdiAccountGroup,
	},
	{
		id: "driver-management",
		name: "Driver Management",
		path: "/admin/drivers",
		icon: mdiCarSide,
		subMenu: [
			{
				id: "drivers-pending",
				name: "Pending Approval",
				path: "/admin/drivers/pending",
				icon: mdiCarSide,
			},
			{
				id: "drivers-all",
				name: "All Drivers",
				path: "/admin/drivers",
				icon: mdiCarSide,
			},
		],
	},
	{
		id: "order-management",
		name: "Orders",
		path: "/admin/orders",
		icon: mdiPackageVariant,
		subMenu: [
			{
				id: "orders-all",
				name: "All Orders",
				path: "/admin/orders",
				icon: mdiPackageVariant,
			},
			{
				id: "orders-pending",
				name: "Pending",
				path: "/admin/orders/pending",
				icon: mdiPackageVariant,
			},
			{
				id: "orders-active",
				name: "Active",
				path: "/admin/orders/active",
				icon: mdiPackageVariant,
			},
			{
				id: "orders-completed",
				name: "Completed",
				path: "/admin/orders/completed",
				icon: mdiPackageVariant,
			},
		],
	},
	{
		id: "financial",
		name: "Financial",
		path: "/admin/pricing",
		icon: mdiCurrencyUsd,
		subMenu: [
			{
				id: "pricing-config",
				name: "Pricing Config",
				path: "/admin/pricing",
				icon: mdiCurrencyUsd,
			},
			{
				id: "revenue-reports",
				name: "Revenue Reports",
				path: "/admin/reports",
				icon: mdiCurrencyUsd,
			},
		],
	},
	{
		id: "promotions",
		name: "Promotions",
		path: "/admin/promotions",
		icon: mdiGift,
	},
	{
		id: "support-tickets",
		name: "Support Tickets",
		path: "/admin/tickets",
		icon: mdiTicket,
	},
	{
		id: "settings",
		name: "Settings",
		path: "/admin/settings",
		icon: mdiCog,
	},
]; 





