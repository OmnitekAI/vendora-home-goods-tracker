
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface DeliveryDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  deliveryId: string;
}

export const DeliveryDeleteDialog = ({
  isOpen,
  onClose,
  onDelete,
  deliveryId,
}: DeliveryDeleteDialogProps) => {
  const { translations, language } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{translations.common.confirmDelete}</DialogTitle>
          <DialogDescription>
            {language === 'es' 
              ? `¿Estás seguro de que quieres eliminar esta entrega? Esta acción no se puede deshacer.` 
              : `Are you sure you want to delete this delivery? This action cannot be undone.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {translations.common.cancel}
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            {translations.common.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
