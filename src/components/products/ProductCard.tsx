
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  formatCurrency: (amount: number) => string;
}

export const ProductCard = ({ product, onEdit, formatCurrency }: ProductCardProps) => {
  return (
    <Card key={product.id} className="overflow-hidden">
      <CardHeader className="pb-2 bg-vendora-50">
        <CardTitle className="flex justify-between items-center">
          <div className="truncate">{product.name}</div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="text-sm font-medium text-muted-foreground">Cost</div>
            <div>{formatCurrency(product.costPrice)}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm font-medium text-muted-foreground">Wholesale</div>
            <div>{formatCurrency(product.wholesalePrice)}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-sm font-medium text-muted-foreground">Retail</div>
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
  );
};
