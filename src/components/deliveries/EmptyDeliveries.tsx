
import { Button } from "@/components/ui/button";
import { Truck, Plus } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface EmptyDeliveriesProps {
  onAddNew: () => void;
}

export const EmptyDeliveries = ({ onAddNew }: EmptyDeliveriesProps) => {
  const { translations } = useLanguage();
  
  return (
    <div className="text-center py-12">
      <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-medium">{translations.deliveries.noDeliveries}</h2>
      <p className="mt-2 text-muted-foreground">
        {translations.deliveries.noDeliveriesSubtext}
      </p>
      <Button onClick={onAddNew} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
        <Plus className="mr-2 h-4 w-4" />
        {translations.deliveries.recordDelivery}
      </Button>
    </div>
  );
};
