
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { deleteProduct } from "@/utils/storage";
import { useLanguage } from "@/context/LanguageContext";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ProductDialogHeader } from "./ProductDialogHeader";
import { ProductForm } from "./ProductForm";
import { ProductDialogFooter } from "./ProductDialogFooter";
import { ProductDeleteDialog } from "./ProductDeleteDialog";

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  categories: string[];
  isNew: boolean;
  onSave: () => void;
}

export const ProductDialog = ({
  isOpen,
  onClose,
  product,
  categories,
  isNew,
  onSave,
}: ProductDialogProps) => {
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const navigate = useNavigate();
  
  // Sync with prop changes
  useEffect(() => {
    setCurrentProduct(product);
    // Reset the new category state when product changes
    setShowNewCategoryInput(false);
    setNewCategory("");
  }, [product]);

  const handleDelete = () => {
    deleteProduct(currentProduct.id);
    onSave();
    setIsDeleteDialogOpen(false);
    onClose();
    navigate("/products");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <form>
            <ProductDialogHeader isNew={isNew} />
            
            <ProductForm 
              currentProduct={currentProduct}
              setCurrentProduct={setCurrentProduct}
              categories={categories}
              showNewCategoryInput={showNewCategoryInput}
              setShowNewCategoryInput={setShowNewCategoryInput}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
            />
            
            <ProductDialogFooter 
              isNew={isNew}
              currentProduct={currentProduct}
              onClose={onClose}
              onSave={onSave}
              setIsDeleteDialogOpen={setIsDeleteDialogOpen}
              navigate={navigate}
            />
          </form>
        </DialogContent>
      </Dialog>

      <ProductDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
      />
    </>
  );
};
