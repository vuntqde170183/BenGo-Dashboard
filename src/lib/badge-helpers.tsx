import { Badge } from "@/components/ui/badge";

export function getRoleBadge(role: string) {
  switch (role.toLowerCase()) {
    case "admin":
      return (
        <Badge variant="cyan" className="capitalize">
          Admin
        </Badge>
      );
    case "dispatcher":
      return (
        <Badge variant="orange" className="capitalize">
          Điều phối viên
        </Badge>
      );
    case "customer":
      return (
        <Badge variant="blue" className="capitalize">
          Khách hàng
        </Badge>
      );
    case "driver":
      return (
        <Badge variant="emerald" className="capitalize">
          Tài xế
        </Badge>
      );
    default:
      return (
        <Badge variant="slate" className="capitalize">
          {role}
        </Badge>
      );
  }
}

export function getStatusBadge(status: string) {
  switch (status) {
    case "APPROVED":
      return (
        <Badge variant="green" className="capitalize">
          Đã duyệt
        </Badge>
      );
    case "PENDING":
      return (
        <Badge variant="amber" className="capitalize">
          Chờ duyệt
        </Badge>
      );
    case "LOCKED":
      return (
        <Badge variant="gray" className="capitalize">
          Đã khóa
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="red" className="capitalize">
          Từ chối
        </Badge>
      );
    default:
      return (
        <Badge variant="slate" className="capitalize">
          {status}
        </Badge>
      );
  }
}
