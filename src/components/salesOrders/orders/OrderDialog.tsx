
import { useState, useEffect } from "react";
import { Order, OrderItem, Location, Product } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import OrderDetailsForm from "./OrderDetailsForm";
import OrderItemForm from "./OrderItemForm";
import OrderItemsList from "./OrderItemsList";

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

  // Update the current order when the prop changes
  useEffect(() => {
    console.log("OrderDialog - received order:", order);
    setCurrentOrder(order);
  }, [order]);

  // Additional effect to ensure dialog is properly opened
  useEffect(() => {
    console.log("OrderDialog - open state changed:", open);
  }, [open]);

  const handleOrderChange = (updatedOrder: Order) => {
    setCurrentOrder(updatedOrder);
  };

  const handleOrderItemChange = (item: OrderItem) => {
    setNewOrderItem(item);
  };

  const handleAddOrderItem = () => {
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
            <OrderDetailsForm 
              order={currentOrder}
              locations={locations}
              onChange={handleOrderChange}
            />

            <div className="space-y-2">
              <Label>{t.productsOrdered}</Label>
              <Card>
                <CardContent className="p-4">
                  {/* Add new item form */}
                  <OrderItemForm 
                    item={newOrderItem}
                    products={products}
                    onItemChange={handleOrderItemChange}
                    onAddItem={handleAddOrderItem}
                  />

                  {/* Items list */}
                  <OrderItemsList 
                    items={currentOrder.items}
                    onRemove={handleRemoveOrderItem}
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
                {isNew ? c.create : c.save}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
