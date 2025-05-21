
import { useState, useEffect } from "react";
import { Delivery, DeliveryItem, Location, Product } from "@/types";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { getProductName } from "@/utils/storage"; // Updated import path
import { useLanguage } from "@/context/LanguageContext";

interface DeliveryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentDelivery: Delivery;
  locations: Location[];
  products: Product[];
  isNew: boolean;
  onSave: (delivery: Delivery) => void;
  onDelete: () => void;
  formatCurrency: (amount: number) => string;
}

export const DeliveryDialog = ({
  isOpen,
  onOpenChange,
  currentDelivery,
  locations,
  products,
  isNew,
  onSave,
  onDelete,
  formatCurrency,
}: DeliveryDialogProps) => {
  const { translations, language } = useLanguage();
  const [delivery, setDelivery] = useState<Delivery>(currentDelivery);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<DeliveryItem>({
    productId: "",
    quantity: 1,
    pricePerUnit: 0,
  });

  // Update internal state when the prop changes
  useEffect(() => {
    setDelivery(currentDelivery);
  }, [currentDelivery]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDelivery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!delivery.locationId) {
      toast.error(language === 'es' ? "La ubicación es obligatoria" : "Location is required");
      return;
    }
    
    if (delivery.items.length === 0) {
      toast.error(language === 'es' ? "Se requiere al menos un producto" : "At least one product is required");
      return;
    }
    
    onSave(delivery);
  };

  const handleAddItem = () => {
    if (!newItem.productId || newItem.quantity <= 0) {
      toast.error(language === 'es' ? "Seleccione un producto y especifique la cantidad" : "Select a product and specify quantity");
      return;
    }

    // Set the price automatically from the selected product
    const selectedProduct = products.find(p => p.id === newItem.productId);
    const pricePerUnit = selectedProduct ? selectedProduct.wholesalePrice : 0;

    // Check if item already exists
    const existingItemIndex = delivery.items.findIndex(
      item => item.productId === newItem.productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...delivery.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
      };
      
      setDelivery(prev => ({
        ...prev,
        items: updatedItems,
      }));
    } else {
      // Add new item with automatically set price
      setDelivery(prev => ({
        ...prev,
        items: [...prev.items, { 
          ...newItem,
          pricePerUnit
        }],
      }));
    }

    // Reset new item form
    setNewItem({
      productId: "",
      quantity: 1,
      pricePerUnit: 0,
    });
  };

  const handleRemoveItem = (index: number) => {
    setDelivery(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId);
    setNewItem({
      productId,
      quantity: 1,
      pricePerUnit: product ? product.wholesalePrice : 0,
    });
  };

  const calculateTotal = (items: DeliveryItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
  };

  // Fix: Ensure we have valid locations and products before rendering
  const hasValidLocations = locations && locations.length > 0;
  const hasValidProducts = products && products.length > 0;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {isNew ? translations.deliveries.addDelivery : translations.deliveries.editDelivery}
              </DialogTitle>
              <DialogDescription>
                {isNew
                  ? translations.deliveries.addDeliveryDescription
                  : translations.deliveries.editDeliveryDescription}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="locationId">{translations.locations.title}</Label>
                  <Select
                    value={delivery.locationId || undefined}
                    onValueChange={(value) =>
                      setDelivery({ ...delivery, locationId: value })
                    }
                  >
                    <SelectTrigger id="locationId">
                      <SelectValue placeholder={translations.common.selectLocation} />
                    </SelectTrigger>
                    <SelectContent>
                      {hasValidLocations ? (
                        locations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no_locations_available">{translations.common.noData}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">{translations.deliveries.date}</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={delivery.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{translations.products.title}</Label>
                <Card>
                  <CardContent className="p-4">
                    {/* Add new item form - Modified for better mobile experience */}
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <div className="flex-grow">
                        <Select
                          value={newItem.productId || undefined}
                          onValueChange={handleProductChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={translations.deliveries.product} />
                          </SelectTrigger>
                          <SelectContent>
                            {hasValidProducts ? (
                              products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no_products_available">{translations.common.noData}</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 min-w-[120px]">
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
                          placeholder={translations.deliveries.quantity}
                          className="flex-grow"
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

                    {/* Items list */}
                    {delivery.items.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        {translations.common.noData}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {delivery.items.map((item, index) => (
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
                              onClick={() => handleRemoveItem(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex justify-between font-medium pt-2">
                          <div>{translations.deliveries.total}:</div>
                          <div>{formatCurrency(calculateTotal(delivery.items))}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">{translations.locations.notes}</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={delivery.notes || ""}
                  onChange={handleChange}
                  placeholder="Any additional information..."
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPaid"
                  checked={delivery.isPaid}
                  onCheckedChange={(checked) =>
                    setDelivery({
                      ...delivery,
                      isPaid: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="isPaid">{translations.deliveries.isPaid}</Label>
              </div>
            </div>
            <DialogFooter className="flex items-center justify-between">
              <div>
                {!isNew && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    {translations.common.delete}
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  {translations.common.cancel}
                </Button>
                <Button type="submit" className="bg-vendora-600 hover:bg-vendora-700">
                  {isNew ? translations.deliveries.recordDelivery : translations.common.save}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{translations.common.confirmDelete}</DialogTitle>
            <DialogDescription>
              {translations.common.confirmDelete}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {translations.common.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                setIsDeleteDialogOpen(false);
              }}
            >
              {translations.common.delete}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
