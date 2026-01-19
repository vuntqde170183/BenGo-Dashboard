import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@mdi/react";
import { mdiInformationOutline, mdiAlertCircleOutline } from "@mdi/js";
import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";

interface ViewReasonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  adminNote?: string;
  rejectionReason?: string;
}

export const ViewReasonDialog = ({
  isOpen,
  onClose,
  adminNote,
  rejectionReason,
}: ViewReasonDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon path={mdiInformationOutline} size={0.8} />
            Thông tin chi tiết
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {adminNote && (
            <div className="space-y-1">
              <span className="text-sm font-semibold">Ghi chú của Admin:</span>
              <div className="p-3 bg-neutral-100 dark:bg-neutral-800 rounded-md text-sm">
                {adminNote}
              </div>
            </div>
          )}
          {rejectionReason && (
            <div className="space-y-1">
              <span className="text-sm font-semibold">Lý do từ chối:</span>
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md text-sm text-red-600 dark:text-red-400">
                {rejectionReason}
              </div>
            </div>
          )}
          {!adminNote && !rejectionReason && (
            <div className="text-sm text-neutral-400 italic text-center">
              Không có thông tin ghi chú
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface UpdateStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, note?: string) => Promise<void>;
  title: string;
  description?: string;
  isReasonRequired?: boolean;
  isLoading?: boolean;
  confirmText?: string;
  confirmButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export const UpdateStatusDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isReasonRequired = false,
  isLoading = false,
  confirmText = "Xác nhận",
  confirmButtonVariant = "default",
}: UpdateStatusDialogProps) => {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const handleConfirm = async () => {
    if (isReasonRequired && !reason.trim()) return;
    await onConfirm(reason, note);
    setReason("");
    setNote("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(_) => !isLoading && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon path={mdiAlertCircleOutline} size={0.8} />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {description && (
            <p className="text-sm text-neutral-400">{description}</p>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {isReasonRequired ? "Lý do (Bắt buộc)" : "Lý do (Tùy chọn)"}
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do..."
                className="resize-none h-24"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ghi chú (Tùy chọn)</label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú..."
                className="resize-none h-24"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={handleConfirm}
            disabled={isLoading || (isReasonRequired && !reason.trim())}
            className="flex-1"
          >
            {isLoading ? (
              <>
                <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
