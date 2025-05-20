
import { OrderItem } from "@/types";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { getProductName } from "@/utils/dataStorage";

interface OrderItemsListProps {
  items: OrderItem[];
  onRemove: (index: number) => void;
}

const OrderItemsList = ({ items, onRemove }: OrderItemsListProps) => {
  const { translations } = useLanguage();
  const t = translations.salesOrders;

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
              {t.quantity}: {item.quantity}
            </div>
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
    </div>
  );
};

export default OrderItemsList;
