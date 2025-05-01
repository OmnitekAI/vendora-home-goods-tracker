
import { useState } from "react";
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
import { getProductName } from "@/utils/dataStorage";

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
  const [delivery, setDelivery] = useState<Delivery>(currentDelivery);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<DeliveryItem>({
    productId: "",
    quantity: 1,
    pricePerUnit: 0,
  });

  // Update internal state when the prop changes
  useState(() => {
    setDelivery(currentDelivery);
  });

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
      toast.error("Location is required");
      return;
    }
    
    if (delivery.items.length === 0) {
      toast.error("At least one product is required");
      return;
    }
    
    onSave(delivery);
  };

  const handleAddItem = () => {
    if (!newItem.productId || newItem.quantity <= 0) {
      toast.error("Select a product and specify quantity");
      return;
    }

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
      // Add new item
      setDelivery(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem }],
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

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                {isNew ? "Record New Delivery" : "Edit Delivery"}
              </DialogTitle>
              <DialogDescription>
                {isNew
                  ? "Record a new delivery to a point of sale location."
                  : "Update the details for this delivery."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="locationId">Location</Label>
                  <Select
                    value={delivery.locationId}
                    onValueChange={(value) =>
                      setDelivery({ ...delivery, locationId: value })
                    }
                  >
                    <SelectTrigger id="locationId">
                      <SelectValue placeholder="Select a location" />
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
                  <Label htmlFor="date">Date</Label>
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
                <Label>Products</Label>
                <Card>
                  <CardContent className="p-4">
                    {/* Add new item form */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <Select
                        value={newItem.productId}
                        onValueChange={handleProductChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Product" />
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
                          value={newItem.quantity}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              quantity: parseInt(e.target.value) || 0,
                            })
                          }
                          placeholder="Qty"
                          className="w-20"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={newItem.pricePerUnit}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              pricePerUnit: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="Price"
                          className="flex-1"
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
                        No products added yet
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
                          <div>Total:</div>
                          <div>{formatCurrency(calculateTotal(delivery.items))}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
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
                <Label htmlFor="isPaid">Mark as paid</Label>
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
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-vendora-600 hover:bg-vendora-700">
                  {isNew ? "Record Delivery" : "Update Delivery"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this delivery? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onDelete();
                setIsDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
