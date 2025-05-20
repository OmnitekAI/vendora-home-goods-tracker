
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface EmptyOrdersProps {
  onAddNew: () => void;
}

const EmptyOrders = ({ onAddNew }: EmptyOrdersProps) => {
  const { translations } = useLanguage();
  const t = translations.salesOrders;

  return (
    <div className="text-center py-12">
      <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-medium">{t.noOrders}</h2>
      <p className="mt-2 text-muted-foreground">{t.noOrdersSubtext}</p>
      <Button onClick={onAddNew} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
        <Plus className="mr-2 h-4 w-4" />
        {t.newOrder}
      </Button>
    </div>
  );
};

export default EmptyOrders;
