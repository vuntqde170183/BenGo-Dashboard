import { sendGet } from "./axios";
import {
  ICustomerLoyalty,
  IDashboardOverview,
  IDashboardSummary,
  IDriverPerformance,
  IReportOrder,
  IReportResponse,
  IRevenueGrowth,
  TReportPeriod,
  TReportType,
  IChartDataPoint
} from "@/interface/admin";

export const adminReportApi = {
  getReports: (type: TReportType, period?: TReportPeriod): Promise<IReportResponse> =>
    sendGet("/admin/reports", { type, period }).then(res => res.data),

  getDashboard: (): Promise<IDashboardOverview> =>
    sendGet("/admin/dashboard").then(res => res.data),

  getSummary: (params: { startDate?: string; endDate?: string }): Promise<IDashboardSummary> =>
    sendGet("/admin/reports/summary", params).then(res => res.data),

  getCharts: (params: { type: 'REVENUE' | 'ORDERS' | 'USERS'; groupBy: 'HOUR' | 'DAY' | 'MONTH' }): Promise<{ data: IChartDataPoint[] }> =>
    sendGet("/admin/reports/charts", params).then(res => res.data),

  getRevenueGrowth: (params: { period?: 'WEEK' | 'MONTH' | 'YEAR'; startDate?: string; endDate?: string }): Promise<IRevenueGrowth> =>
    sendGet("/admin/reports/revenue-growth", params).then(res => res.data),

  getDriversPerformance: (params: any): Promise<{ data: IDriverPerformance[]; pagination: any }> =>
    sendGet("/admin/reports/drivers-performance", params),

  getReportOrders: (params: any): Promise<{ data: IReportOrder[]; pagination: any }> =>
    sendGet("/admin/reports/orders", params),

  getCustomersLoyalty: (params: { limit?: number }): Promise<{ data: ICustomerLoyalty[]; pagination: any }> =>
    sendGet("/admin/reports/customers-loyalty", params).then(res => res.data),

  getExportUrl: (reportType: string, params: any) => {
    const query = new URLSearchParams(params).toString();
    return `${import.meta.env.VITE_API_URL}/admin/reports/export/${reportType}?${query}`;
  }
};
