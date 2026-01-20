import { sendGet } from "./axios";
import { IDashboardOverview, IReportResponse, TReportPeriod, TReportType } from "@/interface/admin";

export const adminReportApi = {
  getReports: (type: TReportType, period?: TReportPeriod): Promise<IReportResponse> => 
    sendGet("/admin/reports", { type, period }).then(res => res.data),
  getDashboard: (): Promise<IDashboardOverview> => 
    sendGet("/admin/dashboard").then(res => res.data),
};
