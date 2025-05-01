
import { Button } from "@/components/ui/button";
import { Truck, Plus } from "lucide-react";

interface EmptyDeliveriesProps {
  onAddNew: () => void;
}

export const EmptyDeliveries = ({ onAddNew }: EmptyDeliveriesProps) => {
  return (
    <div className="text-center py-12">
      <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-medium">No deliveries recorded yet</h2>
      <p className="mt-2 text-muted-foreground">
        Record your first delivery to start tracking your inventory.
      </p>
      <Button onClick={onAddNew} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
        <Plus className="mr-2 h-4 w-4" />
        Record Delivery
      </Button>
    </div>
  );
};
