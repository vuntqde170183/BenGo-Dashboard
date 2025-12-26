import { sendGet, sendPut } from "./axios";

export const adminTicketApi = {
  getTickets: (params: any) => sendGet("/admin/tickets", params),
  getTicketDetails: (id: string) => sendGet(`/admin/tickets/${id}`),
  assignTicket: (id: string, assignedTo: string) => sendPut(`/admin/tickets/${id}/assign`, { assignedTo }),
  updateTicketStatus: (id: string, data: { status: string; resolution: string }) => sendPut(`/admin/tickets/${id}/status`, data),
};
