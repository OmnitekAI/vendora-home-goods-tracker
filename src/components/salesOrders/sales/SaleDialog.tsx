
import { useState } from "react";
import { Sale, SaleItem, Location, Product } from "@/types";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { useLanguage } from "@/context/LanguageContext";
import { getProductName } from "@/utils/dataStorage";

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
  const [newSaleItem, setNewSaleItem] = useState<SaleItem>({
    productId: "",
    quantity: 1,
    pricePerUnit: 0,
  });

  // Reset the form when the dialog opens with new data
  useState(() => {
    setCurrentSale(sale);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentSale((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setNewSaleItem({
      productId,
      quantity: 1,
      pricePerUnit: product ? product.suggestedRetailPrice : 0,
    });
  };

  const handleAddSaleItem = () => {
    if (!newSaleItem.productId || newSaleItem.quantity <= 0) {
      toast.error(language === 'es' ? "Seleccione un producto y especifique la cantidad" : "Select a product and specify quantity");
      return;
    }

    // Check if item already exists
    const existingItemIndex = currentSale.items.findIndex(
      item => item.productId === newSaleItem.productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...currentSale.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + newSaleItem.quantity,
      };
      
      setCurrentSale(prev => ({
        ...prev,
        items: updatedItems,
      }));
    } else {
      // Add new item
      setCurrentSale(prev => ({
        ...prev,
        items: [...prev.items, { ...newSaleItem }],
      }));
    }

    // Reset new item form
    setNewSaleItem({
      productId: "",
      quantity: 1,
      pricePerUnit: 0,
    });
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateSaleTotal = (items: SaleItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
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
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="locationId">{t.location}</Label>
                <Select
                  value={currentSale.locationId}
                  onValueChange={(value) =>
                    setCurrentSale({ ...currentSale, locationId: value })
                  }
                >
                  <SelectTrigger id="locationId">
                    <SelectValue placeholder={t.selectLocation} />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="saleDate">{t.date}</Label>
                <Input
                  id="saleDate"
                  name="date"
                  type="date"
                  value={currentSale.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.productsSold}</Label>
              <Card>
                <CardContent className="p-4">
                  {/* Add new item form */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <Select
                      value={newSaleItem.productId}
                      onValueChange={handleSaleProductChange}
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
                        value={newSaleItem.quantity}
                        onChange={(e) =>
                          setNewSaleItem({
                            ...newSaleItem,
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
                        value={newSaleItem.pricePerUnit}
                        onChange={(e) =>
                          setNewSaleItem({
                            ...newSaleItem,
                            pricePerUnit: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder={t.price}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleAddSaleItem}
                        className="bg-vendora-600 hover:bg-vendora-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Items list */}
                  {currentSale.items.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      {t.noProductsAdded}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentSale.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-2">
                          <div className="flex-1">
                            <div className="font-medium">{getProductName(item.productId)}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.quantity} × {formatCurrency(item.pricePerUnit)}
                            </div>
                          </div>
                          <div className="text-right mr-2">
                            {formatCurrency(item.quantity * item.pricePerUnit)}
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveSaleItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex justify-between font-medium pt-2">
                        <div>{t.total}:</div>
                        <div>{formatCurrency(calculateSaleTotal(currentSale.items))}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="saleNotes">{t.notes}</Label>
              <Textarea
                id="saleNotes"
                name="notes"
                value={currentSale.notes || ""}
                onChange={handleChange}
                placeholder={t.additionalInfo}
                rows={2}
              />
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
