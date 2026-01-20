import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IconAlertTriangle,
  IconCheck,
  IconX,
  IconLoader2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  variant?: "default" | "destructive" | "warning";
}

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  isPending = false,
  variant = "default",
}: ConfirmDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconAlertTriangle
              className={cn(
                "h-5 w-5",
                variant === "destructive"
                  ? "text-red-500"
                  : variant === "warning"
                    ? "text-yellow-500"
                    : "text-primary",
              )}
            />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-neutral-400">{description}</p>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="flex-1"
          >
            <IconX className="h-4 w-4" />
            {cancelText}
          </Button>
          <Button className="flex-1" onClick={onConfirm} disabled={isPending}>
            {isPending ? (
              <IconLoader2 className="h-4 w-4 animate-spin" />
            ) : (
              <IconCheck className="h-4 w-4" />
            )}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
