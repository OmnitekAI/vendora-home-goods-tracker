
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface EmptySalesProps {
  onAddNew: () => void;
}

const EmptySales = ({ onAddNew }: EmptySalesProps) => {
  const { translations } = useLanguage();
  const t = translations.salesOrders;

  return (
    <div className="text-center py-12">
      <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-medium">{t.noSales}</h2>
      <p className="mt-2 text-muted-foreground">{t.noSalesSubtext}</p>
      <Button onClick={onAddNew} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
        <Plus className="mr-2 h-4 w-4" />
        {t.recordSale}
      </Button>
    </div>
  );
};

export default EmptySales;
