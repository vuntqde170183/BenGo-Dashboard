import { sendGet } from "./axios";
import { IDashboardOverview } from "@/interface/admin";

export const adminReportApi = {
  getReports: (type: string) => sendGet("/admin/reports", { type }),
  getDashboard: (): Promise<IDashboardOverview> => sendGet("/admin/dashboard"),
};
