
import { SaleItem } from "@/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { getProductName } from "@/utils/dataStorage";

interface SaleItemsListProps {
  items: SaleItem[];
  onRemove: (index: number) => void;
}

const SaleItemsList = ({ items, onRemove }: SaleItemsListProps) => {
  const { translations, language } = useLanguage();
  const t = translations.salesOrders;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateSaleTotal = (items: SaleItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        {t.noProductsAdded}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center justify-between border-b pb-2">
          <div className="flex-1">
            <div className="font-medium">{getProductName(item.productId)}</div>
            <div className="text-sm text-muted-foreground">
              {item.quantity} × {formatCurrency(item.pricePerUnit)}
            </div>
          </div>
          <div className="text-right mr-2">
            {formatCurrency(item.quantity * item.pricePerUnit)}
          </div>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div className="flex justify-between font-medium pt-2">
        <div>{t.total}:</div>
        <div>{formatCurrency(calculateSaleTotal(items))}</div>
      </div>
    </div>
  );
};

export default SaleItemsList;
