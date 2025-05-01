
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Truck, Plus, Edit, X, ArrowRight, Store, Calendar } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Delivery, DeliveryItem, Location, Product } from "@/types";
import {
  getDeliveries,
  saveDelivery,
  deleteDelivery,
  generateId,
  getLocations,
  getProducts,
  getLocationName,
  getProductName,
  getProductById,
} from "@/utils/dataStorage";

const Deliveries = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState<Delivery>({
    id: "",
    locationId: "",
    date: new Date().toISOString().split("T")[0],
    items: [],
    notes: "",
    isPaid: false,
  });
  const [newItem, setNewItem] = useState<DeliveryItem>({
    productId: "",
    quantity: 1,
    pricePerUnit: 0,
  });

  useEffect(() => {
    loadDeliveries();
    loadLocations();
    loadProducts();
  }, []);

  useEffect(() => {
    if (id === "new") {
      setCurrentDelivery({
        id: generateId(),
        locationId: locations.length > 0 ? locations[0].id : "",
        date: new Date().toISOString().split("T")[0],
        items: [],
        notes: "",
        isPaid: false,
      });
      setIsDialogOpen(true);
    } else if (id) {
      const delivery = deliveries.find((del) => del.id === id);
      if (delivery) {
        setCurrentDelivery(delivery);
        setIsDialogOpen(true);
      } else {
        navigate("/deliveries");
        toast.error("Delivery not found");
      }
    }
  }, [id, deliveries, locations, navigate]);

  const loadDeliveries = () => {
    const loadedDeliveries = getDeliveries();
    setDeliveries(loadedDeliveries);
  };

  const loadLocations = () => {
    const loadedLocations = getLocations();
    setLocations(loadedLocations);
  };

  const loadProducts = () => {
    const loadedProducts = getProducts();
    setProducts(loadedProducts);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentDelivery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentDelivery.locationId) {
      toast.error("Location is required");
      return;
    }
    
    if (currentDelivery.items.length === 0) {
      toast.error("At least one product is required");
      return;
    }
    
    saveDelivery(currentDelivery);
    loadDeliveries();
    setIsDialogOpen(false);
    navigate("/deliveries");
  };

  const handleDelete = () => {
    deleteDelivery(currentDelivery.id);
    loadDeliveries();
    setIsDeleteDialogOpen(false);
    setIsDialogOpen(false);
    navigate("/deliveries");
  };

  const handleAddNew = () => {
    navigate("/deliveries/new");
  };

  const handleEdit = (delivery: Delivery) => {
    navigate(`/deliveries/${delivery.id}`);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    navigate("/deliveries");
  };

  const handleAddItem = () => {
    if (!newItem.productId || newItem.quantity <= 0) {
      toast.error("Select a product and specify quantity");
      return;
    }

    // Check if item already exists
    const existingItemIndex = currentDelivery.items.findIndex(
      item => item.productId === newItem.productId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...currentDelivery.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
      };
      
      setCurrentDelivery(prev => ({
        ...prev,
        items: updatedItems,
      }));
    } else {
      // Add new item
      setCurrentDelivery(prev => ({
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
    setCurrentDelivery(prev => ({
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const calculateTotal = (items: DeliveryItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 vendora-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-vendora-800">Deliveries</h1>
          <Button onClick={handleAddNew} className="bg-vendora-600 hover:bg-vendora-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Delivery
          </Button>
        </div>

        {deliveries.length === 0 ? (
          <div className="text-center py-12">
            <Truck className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium">No deliveries recorded yet</h2>
            <p className="mt-2 text-muted-foreground">
              Record your first delivery to start tracking your inventory.
            </p>
            <Button onClick={handleAddNew} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
              <Plus className="mr-2 h-4 w-4" />
              Record Delivery
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveries.map((delivery) => (
              <Card key={delivery.id} className={delivery.isPaid ? "border-sage-200" : "border-vendora-200"}>
                <CardHeader className={`pb-2 ${delivery.isPaid ? "bg-sage-50" : "bg-vendora-50"}`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-vendora-600" />
                      <CardTitle className="truncate text-base">{getLocationName(delivery.locationId)}</CardTitle>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(delivery)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(delivery.date)}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-1">
                    {delivery.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <div>{item.quantity}x {getProductName(item.productId)}</div>
                        <div>{formatCurrency(item.pricePerUnit * item.quantity)}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-2 border-t border-border flex justify-between font-medium">
                    <div>Total:</div>
                    <div>{formatCurrency(calculateTotal(delivery.items))}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-0">
                  <div>
                    {delivery.isPaid ? (
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                        Paid
                      </span>
                    ) : (
                      <span className="text-sm text-amber-600 font-medium flex items-center gap-1">
                        <span className="h-2 w-2 bg-amber-600 rounded-full"></span>
                        Unpaid
                      </span>
                    )}
                  </div>
                  {delivery.notes && (
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {delivery.notes}
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Delivery Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {id === "new" ? "Record New Delivery" : "Edit Delivery"}
                </DialogTitle>
                <DialogDescription>
                  {id === "new"
                    ? "Record a new delivery to a point of sale location."
                    : "Update the details for this delivery."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="locationId">Location</Label>
                    <Select
                      value={currentDelivery.locationId}
                      onValueChange={(value) =>
                        setCurrentDelivery({ ...currentDelivery, locationId: value })
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
                      value={currentDelivery.date}
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
                      {currentDelivery.items.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          No products added yet
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {currentDelivery.items.map((item, index) => (
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
                            <div>{formatCurrency(calculateTotal(currentDelivery.items))}</div>
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
                    value={currentDelivery.notes || ""}
                    onChange={handleChange}
                    placeholder="Any additional information..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPaid"
                    checked={currentDelivery.isPaid}
                    onCheckedChange={(checked) =>
                      setCurrentDelivery({
                        ...currentDelivery,
                        isPaid: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="isPaid">Mark as paid</Label>
                </div>
              </div>
              <DialogFooter className="flex items-center justify-between">
                <div>
                  {id !== "new" && (
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
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-vendora-600 hover:bg-vendora-700">
                    {id === "new" ? "Record Delivery" : "Update Delivery"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
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
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Deliveries;
