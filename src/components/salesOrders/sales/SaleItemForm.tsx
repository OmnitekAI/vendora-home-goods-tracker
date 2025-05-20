
import { useState } from "react";
import { SaleItem, Product } from "@/types";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/context/LanguageContext";

interface SaleItemFormProps {
  products: Product[];
  onAdd: (item: SaleItem) => void;
}

const SaleItemForm = ({ products, onAdd }: SaleItemFormProps) => {
  const { translations, language } = useLanguage();
  const t = translations.salesOrders;
  
  const [newItem, setNewItem] = useState<SaleItem>({
    productId: "",
    quantity: 1,
    pricePerUnit: 0,
  });

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setNewItem({
      productId,
      quantity: 1,
      // Use wholesalePrice as default
      pricePerUnit: product ? product.wholesalePrice : 0,
    });
  };

  const handleAdd = () => {
    if (!newItem.productId || newItem.quantity <= 0) {
      toast.error(language === 'es' ? "Seleccione un producto y especifique la cantidad" : "Select a product and specify quantity");
      return;
    }

    onAdd({ ...newItem });

    // Reset form
    setNewItem({
      productId: "",
      quantity: 1,
      pricePerUnit: 0,
    });
  };

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      <Select
        value={newItem.productId}
        onValueChange={handleProductChange}
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
      <div className="flex gap-2 col-span-2">
        <Input
          type="number"
          min="1"
          value={newItem.quantity}
          onChange={(e) =>
            setNewItem({
              ...newItem,
              quantity: parseInt(e.target.value) || 0,
            })
          }
          placeholder={t.quantity}
          className="w-20"
        />
        <Input
          type="number"
          step="0.01"
          min="0"
          value={newItem.pricePerUnit}
          onChange={(e) =>
            setNewItem({
              ...newItem,
              pricePerUnit: parseFloat(e.target.value) || 0,
            })
          }
          placeholder={t.price}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAdd}
          className="bg-vendora-600 hover:bg-vendora-700"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SaleItemForm;
