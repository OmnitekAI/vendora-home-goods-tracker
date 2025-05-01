
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EmptyProductsProps {
  onAddNew: () => void;
}

export const EmptyProducts = ({ onAddNew }: EmptyProductsProps) => {
  const { translations } = useLanguage();
  
  return (
    <div className="text-center py-12">
      <Package className="mx-auto h-12 w-12 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-medium">{translations.products.noProducts}</h2>
      <p className="mt-2 text-muted-foreground">
        {translations.products.noProductsSubtext}
      </p>
      <Button onClick={onAddNew} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
        <Plus className="mr-2 h-4 w-4" />
        {translations.products.addProduct}
      </Button>
    </div>
  );
};
