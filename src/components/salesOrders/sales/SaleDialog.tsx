
import { useState } from "react";
import { Sale, SaleItem, Location, Product } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/context/LanguageContext";

import SaleDetailsForm from "./SaleDetailsForm";
import SaleItemForm from "./SaleItemForm";
import SaleItemsList from "./SaleItemsList";

interface SaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale;
  locations: Location[];
  products: Product[];
  onSubmit: (sale: Sale) => void;
  onDelete: () => void;
  isNew: boolean;
}

const SaleDialog = ({ 
  open, 
  onOpenChange, 
  sale, 
  locations, 
  products, 
  onSubmit,
  onDelete,
  isNew 
}: SaleDialogProps) => {
  const { translations, language } = useLanguage();
  const t = translations.salesOrders;
  const c = translations.common;
  
  const [currentSale, setCurrentSale] = useState<Sale>(sale);

  // Reset the form when the dialog opens with new data
  useState(() => {
    setCurrentSale(sale);
  });

  const handleAddSaleItem = (newItem: SaleItem) => {
    // Check if item already exists
    const existingItemIndex = currentSale.items.findIndex(
      item => item.productId === newItem.productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...currentSale.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
      };
      
      setCurrentSale(prev => ({
        ...prev,
        items: updatedItems,
      }));
    } else {
      // Add new item
      setCurrentSale(prev => ({
        ...prev,
        items: [...prev.items, newItem],
      }));
    }
  };

  const handleRemoveSaleItem = (index: number) => {
    setCurrentSale(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSale.locationId) {
      toast.error(language === 'es' ? "La ubicación es obligatoria" : "Location is required");
      return;
    }
    
    if (currentSale.items.length === 0) {
      toast.error(language === 'es' ? "Se requiere al menos un producto" : "At least one product is required");
      return;
    }
    
    onSubmit(currentSale);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isNew ? t.recordNewSale : t.editSale}
            </DialogTitle>
            <DialogDescription>
              {isNew ? t.recordSaleDescription : t.updateSaleDetails}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Sale Details Form */}
            <SaleDetailsForm 
              sale={currentSale} 
              locations={locations} 
              onChange={setCurrentSale} 
            />

            {/* Products Section */}
            <div className="space-y-2">
              <Label>{t.productsSold}</Label>
              <Card>
                <CardContent className="p-4">
                  {/* Add new item form */}
                  <SaleItemForm 
                    products={products} 
                    onAdd={handleAddSaleItem} 
                  />

                  {/* Items list */}
                  <SaleItemsList 
                    items={currentSale.items} 
                    onRemove={handleRemoveSaleItem} 
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between">
            <div>
              {!isNew && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                >
                  {c.delete}
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {c.cancel}
              </Button>
              <Button type="submit" className="bg-vendora-600 hover:bg-vendora-700">
                {isNew ? t.recordSale : c.save}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SaleDialog;
