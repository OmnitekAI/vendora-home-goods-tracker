
import { OrderItem, Product } from "@/types";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "@/components/ui/sonner";

interface OrderItemFormProps {
  item: OrderItem;
  products: Product[];
  onItemChange: (item: OrderItem) => void;
  onAddItem: () => void;
}

const OrderItemForm = ({ item, products, onItemChange, onAddItem }: OrderItemFormProps) => {
  const { translations, language } = useLanguage();
  const t = translations.salesOrders;

  const handleOrderProductChange = (productId: string) => {
    onItemChange({
      ...item,
      productId
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onItemChange({
      ...item,
      quantity: parseInt(e.target.value) || 0,
    });
  };

  const handleAddItem = () => {
    if (!item.productId || item.quantity <= 0) {
      toast.error(language === 'es' ? "Seleccione un producto y especifique la cantidad" : "Select a product and specify quantity");
      return;
    }
    onAddItem();
  };

  return (
    <div className="grid grid-cols-1 gap-2 mb-4">
      <div className="w-full">
        <Select
          value={item.productId}
          onValueChange={handleOrderProductChange}
        >
          <SelectTrigger>
            <SelectValue placeholder={t.selectProduct} />
          </SelectTrigger>
          <SelectContent>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 w-full">
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          placeholder={t.quantity}
          className="flex-grow min-w-[80px]"
        />
        <Button
          type="button"
          onClick={handleAddItem}
          className="bg-vendora-600 hover:bg-vendora-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OrderItemForm;
