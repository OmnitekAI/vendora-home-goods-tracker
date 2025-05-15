
import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { ProductDeleteDialog } from "./ProductDeleteDialog";
import { deleteProduct } from "@/utils/storage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { translations, language } = useLanguage();
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
            <div className="truncate pr-2">{product.name}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">
                    {language === 'es' ? 'Menú de acciones' : 'Actions menu'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {translations.common.edit}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {translations.common.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
