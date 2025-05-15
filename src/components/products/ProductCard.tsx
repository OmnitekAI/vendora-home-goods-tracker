
import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ProductDeleteDialog } from "./ProductDeleteDialog";
import { deleteProduct } from "@/utils/storage";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  formatCurrency: (amount: number) => string;
  onDelete?: () => void;
}

export const ProductCard = ({ 
  product, 
  onEdit, 
  formatCurrency,
  onDelete 
}: ProductCardProps) => {
  const { translations } = useLanguage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDelete = () => {
    deleteProduct(product.id);
    setIsDeleteDialogOpen(false);
    if (onDelete) onDelete();
  };
  
  return (
    <>
      <Card key={product.id} className="overflow-hidden">
        <CardHeader className="pb-2 bg-vendora-50">
          <CardTitle className="flex justify-between items-center">
            <div className="truncate">{product.name}</div>
            <div className="flex gap-1">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                title={translations.common.delete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(product)}
                title={translations.common.edit}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-sm font-medium text-muted-foreground">{translations.products.cost}</div>
              <div>{formatCurrency(product.costPrice)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm font-medium text-muted-foreground">{translations.products.wholesale}</div>
              <div>{formatCurrency(product.wholesalePrice)}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm font-medium text-muted-foreground">{translations.products.retail}</div>
              <div>{formatCurrency(product.suggestedRetailPrice)}</div>
            </div>
            {product.description && (
              <div className="mt-3 pt-3 border-t border-border">
                <div className="text-sm">{product.description}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ProductDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
        productId={product.id}
        productName={product.name}
      />
    </>
  );
};
