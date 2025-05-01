
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationDialog = ({ onConfirm, onCancel }: DeleteConfirmationDialogProps) => {
  const { translations } = useLanguage();
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{translations.common.confirmDelete}</DialogTitle>
        <DialogDescription>
          {translations.common.confirmDelete}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
        >
          {translations.common.cancel}
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
        >
          {translations.common.delete}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteConfirmationDialog;
