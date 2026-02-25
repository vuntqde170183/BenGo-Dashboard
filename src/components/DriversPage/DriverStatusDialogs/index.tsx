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
import {
  mdiInformationOutline,
  mdiAlertCircleOutline,
  mdiClose,
  mdiCheckCircleOutline,
  mdiLoading,
} from "@mdi/js";
import { useState } from "react";

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
      <DialogContent size="small">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Icon path={mdiInformationOutline} size={0.8} />
            <span>Thông tin chi tiết</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 md:space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar p-3 md:p-4">
          {adminNote && (
            <div className="space-y-1">
              <span className="text-sm font-semibold">Ghi chú của Admin:</span>
              <div className="p-3 bg-neutral-100 dark:bg-darkBorderV1 rounded-md text-sm">
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
            <div className="text-sm text-neutral-400 italic text-center py-4">
              Không có thông tin ghi chú
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <Icon path={mdiClose} size={0.8} />
            Đóng
          </Button>
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
      <DialogContent size="small">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Icon path={mdiAlertCircleOutline} size={0.8} />
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 md:space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar p-3 md:p-4">
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

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            <Icon path={mdiClose} size={0.8} />
            Hủy bỏ
          </Button>
          <Button
            variant={confirmButtonVariant}
            onClick={handleConfirm}
            disabled={isLoading || (isReasonRequired && !reason.trim())}
          >
            {isLoading ? (
              <>
                <Icon path={mdiLoading} size={0.8} className="animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Icon path={mdiCheckCircleOutline} size={0.8} />
                {confirmText}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

