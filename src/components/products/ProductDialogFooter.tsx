
import { NavigateFunction } from "react-router-dom";
import { useState } from "react";
import { Product } from "@/types";
import { saveProduct } from "@/utils/storage";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ProductDeleteDialog } from "./ProductDeleteDialog";

interface ProductDialogFooterProps {
  isNew: boolean;
  currentProduct: Product;
  onClose: () => void;
  onSave: () => void;
  navigate: NavigateFunction;
}

export const ProductDialogFooter = ({
  isNew,
  currentProduct,
  onClose,
  onSave,
  navigate,
}: ProductDialogFooterProps) => {
  const { translations } = useLanguage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct.name) {
      toast.error(`${translations.products.productName} ${translations.common.required}`);
      return;
    }
    
    saveProduct(currentProduct);
    onSave();
    onClose();
    navigate("/products");
  };

  return (
    <>
      <DialogFooter className="flex items-center justify-between">
        <div>
          {!isNew && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              {translations.common.delete}
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {translations.common.cancel}
          </Button>
          <Button 
            type="button" 
            className="bg-vendora-600 hover:bg-vendora-700"
            onClick={handleSubmit}
          >
            {isNew ? translations.products.addProduct : translations.common.save}
          </Button>
        </div>
      </DialogFooter>

      {!isNew && (
        <ProductDeleteDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onDelete={() => {
            setIsDeleteDialogOpen(false);
            onClose();
            navigate("/products");
          }}
          productId={currentProduct.id}
          productName={currentProduct.name}
        />
      )}
    </>
  );
};
