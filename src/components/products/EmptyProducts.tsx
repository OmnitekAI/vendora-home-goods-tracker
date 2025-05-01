
import { Button } from "@/components/ui/button";
import { Package, Plus } from "lucide-react";

interface EmptyProductsProps {
  onAddNew: () => void;
}

export const EmptyProducts = ({ onAddNew }: EmptyProductsProps) => {
  return (
    <div className="text-center py-12">
      <Package className="mx-auto h-12 w-12 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-medium">No products added yet</h2>
      <p className="mt-2 text-muted-foreground">
        Add your first product to start tracking inventory and sales.
      </p>
      <Button onClick={onAddNew} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  );
};
