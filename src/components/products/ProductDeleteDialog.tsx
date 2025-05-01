
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface ProductDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const ProductDeleteDialog = ({ isOpen, onClose, onDelete }: ProductDeleteDialogProps) => {
  const { translations } = useLanguage();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            onClick={onClose}
          >
            {translations.common.cancel}
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
          >
            {translations.common.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
