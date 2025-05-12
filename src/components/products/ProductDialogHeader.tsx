
import { useLanguage } from "@/context/LanguageContext";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProductDialogHeaderProps {
  isNew: boolean;
}

export const ProductDialogHeader = ({ isNew }: ProductDialogHeaderProps) => {
  const { translations } = useLanguage();
  
  return (
    <DialogHeader>
      <DialogTitle>
        {isNew ? translations.products.addProduct : translations.products.editProduct}
      </DialogTitle>
      <DialogDescription>
        {isNew
          ? translations.products.addProductDescription
          : translations.products.editProductDescription}
      </DialogDescription>
    </DialogHeader>
  );
};
