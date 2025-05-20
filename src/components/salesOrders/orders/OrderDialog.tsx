
import { useState } from "react";
import { Order, OrderItem, Location, Product } from "@/types";
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

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  locations: Location[];
  products: Product[];
  onSubmit: (order: Order) => void;
  onDelete: () => void;
  isNew: boolean;
}

const OrderDialog = ({ 
  open, 
  onOpenChange, 
  order, 
  locations, 
  products, 
  onSubmit,
  onDelete,
  isNew 
}: OrderDialogProps) => {
  const { translations, language } = useLanguage();
  const t = translations.salesOrders;
  const c = translations.common;
  
  const [currentOrder, setCurrentOrder] = useState<Order>(order);
  const [newOrderItem, setNewOrderItem] = useState<OrderItem>({
    productId: "",
    quantity: 1,
  });

  // Reset the form when the dialog opens with new data
  useState(() => {
    setCurrentOrder(order);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOrderStatusChange = (status: 'pending' | 'delivered' | 'cancelled') => {
    setCurrentOrder(prev => ({
      ...prev,
      status,
    }));
  };

  const handleOrderProductChange = (productId: string) => {
    setNewOrderItem({
      productId,
      quantity: 1,
    });
  };

  const handleAddOrderItem = () => {
    if (!newOrderItem.productId || newOrderItem.quantity <= 0) {
      toast.error(language === 'es' ? "Seleccione un producto y especifique la cantidad" : "Select a product and specify quantity");
      return;
    }

    // Check if item already exists
    const existingItemIndex = currentOrder.items.findIndex(
      item => item.productId === newOrderItem.productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...currentOrder.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + newOrderItem.quantity,
      };
      
      setCurrentOrder(prev => ({
        ...prev,
        items: updatedItems,
      }));
    } else {
      // Add new item
      setCurrentOrder(prev => ({
        ...prev,
        items: [...prev.items, { ...newOrderItem }],
      }));
    }

    // Reset new item form
    setNewOrderItem({
      productId: "",
      quantity: 1,
    });
  };

  const handleRemoveOrderItem = (index: number) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentOrder.locationId) {
      toast.error(language === 'es' ? "La ubicación es obligatoria" : "Location is required");
      return;
    }
    
    if (currentOrder.items.length === 0) {
      toast.error(language === 'es' ? "Se requiere al menos un producto" : "At least one product is required");
      return;
    }
    
    onSubmit(currentOrder);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isNew ? t.createNewOrder : t.editOrder}
            </DialogTitle>
            <DialogDescription>
              {isNew ? t.createOrderDescription : t.updateOrderDetails}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="orderLocationId">{t.location}</Label>
                <Select
                  value={currentOrder.locationId}
                  onValueChange={(value) =>
                    setCurrentOrder({ ...currentOrder, locationId: value })
                  }
                >
                  <SelectTrigger id="orderLocationId">
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
                <Label htmlFor="orderDate">{t.date}</Label>
                <Input
                  id="orderDate"
                  name="date"
                  type="date"
                  value={currentOrder.date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t.productsOrdered}</Label>
              <Card>
                <CardContent className="p-4">
                  {/* Add new item form */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <Select
                      value={newOrderItem.productId}
                      onValueChange={handleOrderProductChange}
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
                        value={newOrderItem.quantity}
                        onChange={(e) =>
                          setNewOrderItem({
                            ...newOrderItem,
                            quantity: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder={t.quantity}
                        className="w-20"
                      />
                      <Button
                        type="button"
                        onClick={handleAddOrderItem}
                        className="bg-vendora-600 hover:bg-vendora-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Items list */}
                  {currentOrder.items.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      {t.noProductsAdded}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between border-b pb-2">
                          <div className="flex-1">
                            <div className="font-medium">{getProductName(item.productId)}</div>
                            <div className="text-sm text-muted-foreground">
                              {t.quantity}: {item.quantity}
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleRemoveOrderItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">{t.status}</Label>
              <Select
                value={currentOrder.status}
                onValueChange={(value) =>
                  handleOrderStatusChange(value as 'pending' | 'delivered' | 'cancelled')
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder={t.selectStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t.pending}</SelectItem>
                  <SelectItem value="delivered">{t.delivered}</SelectItem>
                  <SelectItem value="cancelled">{t.cancelled}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="orderNotes">{t.notes}</Label>
              <Textarea
                id="orderNotes"
                name="notes"
                value={currentOrder.notes || ""}
                onChange={handleChange}
                placeholder={t.specialInstructions}
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
                {isNew ? t.newOrder : c.save}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
