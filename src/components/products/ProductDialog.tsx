
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types";
import { deleteProduct, saveProduct } from "@/utils/storage";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/context/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  
  // Sync with prop changes
  useEffect(() => {
    setCurrentProduct(product);
    // Reset the new category state when product changes
    setShowNewCategoryInput(false);
    setNewCategory("");
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: name.includes("Price") ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      // Show the new category input
      setShowNewCategoryInput(true);
      setNewCategory("");
    } else {
      // Hide the new category input and set the selected category
      setShowNewCategoryInput(false);
      setCurrentProduct((prev) => ({
        ...prev,
        category: value,
      }));
    }
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewCategory(value);
    // Update the product category with the new category value
    setCurrentProduct((prev) => ({
      ...prev,
      category: value,
    }));
  };

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
          <form onSubmit={handleSubmit}>
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
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{translations.products.productName}</Label>
                <Input
                  id="name"
                  name="name"
                  value={currentProduct.name}
                  onChange={handleChange}
                  placeholder={translations.products.productName}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">{translations.products.category}</Label>
                <div className="flex flex-col gap-2">
                  <Select
                    value={showNewCategoryInput ? "new" : (currentProduct.category || "")}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder={translations.products.selectCategory} />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">
                        {translations.products.addNewCategory}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {showNewCategoryInput && (
                    <Input
                      name="newCategory"
                      value={newCategory}
                      onChange={handleNewCategoryChange}
                      placeholder={translations.products.addNewCategory}
                      autoFocus
                    />
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="costPrice">{translations.products.costPrice}</Label>
                <Input
                  id="costPrice"
                  name="costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct.costPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="wholesalePrice">{translations.products.wholesalePrice}</Label>
                <Input
                  id="wholesalePrice"
                  name="wholesalePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct.wholesalePrice}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="suggestedRetailPrice">{translations.products.suggestedRetailPrice}</Label>
                <Input
                  id="suggestedRetailPrice"
                  name="suggestedRetailPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct.suggestedRetailPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">{translations.products.description}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentProduct.description || ""}
                  onChange={handleChange}
                  placeholder={translations.products.description}
                  rows={3}
                />
              </div>
            </div>
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
                <Button type="submit" className="bg-vendora-600 hover:bg-vendora-700">
                  {isNew ? translations.products.addProduct : translations.common.save}
                </Button>
              </div>
            </DialogFooter>
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
