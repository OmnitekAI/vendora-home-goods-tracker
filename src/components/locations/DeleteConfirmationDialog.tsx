
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
  const { translations, language } = useLanguage();
  
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{translations.common.confirmDelete}</DialogTitle>
        <DialogDescription>
          {language === 'es' 
            ? '¿Estás seguro de que quieres eliminar este elemento? Esta acción no se puede deshacer.'
            : 'Are you sure you want to delete this item? This action cannot be undone.'}
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
