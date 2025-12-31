import { Badge } from "@/components/ui/badge";

export function getRoleBadge(role: string) {
  switch (role.toLowerCase()) {
    case "admin":
      return (
        <Badge variant="cyan" className="uppercase">
          Admin
        </Badge>
      );
    case "dispatcher":
      return (
        <Badge variant="orange" className="uppercase">
          Điều phối viên
        </Badge>
      );
    case "customer":
      return (
        <Badge variant="blue" className="uppercase">
          Khách hàng
        </Badge>
      );
    case "driver":
      return (
        <Badge variant="emerald" className="uppercase">
          Tài xế
        </Badge>
      );
    default:
      return (
        <Badge variant="slate" className="uppercase">
          {role}
        </Badge>
      );
  }
}
