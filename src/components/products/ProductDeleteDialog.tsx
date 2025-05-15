
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/context/LanguageContext";
import { isProductInUse } from "@/utils/storage";

interface ProductDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  productId: string;
  productName: string;
}

export const ProductDeleteDialog = ({ 
  isOpen, 
  onClose, 
  onDelete, 
  productId, 
  productName 
}: ProductDeleteDialogProps) => {
  const { translations, language } = useLanguage();
  const isInUse = isProductInUse(productId);
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {language === 'es' ? "¿Eliminar producto?" : "Delete Product?"}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              {language === 'es' 
                ? `¿Estás seguro de que deseas eliminar "${productName}"?` 
                : `Are you sure you want to delete "${productName}"?`}
            </p>
            
            {isInUse && (
              <p className="text-destructive font-medium">
                {language === 'es'
                  ? "¡Advertencia! Este producto se está utilizando en pedidos, entregas o ventas existentes. Eliminarlo puede causar problemas con esos registros."
                  : "Warning! This product is being used in existing orders, deliveries, or sales. Deleting it may cause issues with those records."}
              </p>
            )}
            
            <p>
              {language === 'es'
                ? "Esta acción no se puede deshacer."
                : "This action cannot be undone."}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {translations.common.cancel}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {translations.common.delete}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
