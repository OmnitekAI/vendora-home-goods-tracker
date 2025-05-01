
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  ShoppingCart,
  Plus,
  Edit,
  X,
  Store,
  Calendar,
  ArrowRight,
  Check,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Sale, SaleItem, Order, OrderItem, Location, Product } from "@/types";
import {
  getSales,
  saveSale,
  deleteSale,
  getOrders,
  saveOrder,
  deleteOrder,
  generateId,
  getLocations,
  getProducts,
  getLocationName,
  getProductName,
  getProductById,
} from "@/utils/dataStorage";

const SalesOrders = () => {
  const params = useParams();
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sales");
  
  const [sales, setSales] = useState<Sale[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [currentSale, setCurrentSale] = useState<Sale>({
    id: "",
    locationId: "",
    date: new Date().toISOString().split("T")[0],
    items: [],
    notes: "",
  });
  
  const [currentOrder, setCurrentOrder] = useState<Order>({
    id: "",
    locationId: "",
    date: new Date().toISOString().split("T")[0],
    items: [],
    status: "pending",
    notes: "",
  });
  
  const [newSaleItem, setNewSaleItem] = useState<SaleItem>({
    productId: "",
    quantity: 1,
    pricePerUnit: 0,
  });
  
  const [newOrderItem, setNewOrderItem] = useState<OrderItem>({
    productId: "",
    quantity: 1,
  });

  useEffect(() => {
    loadSales();
    loadOrders();
    loadLocations();
    loadProducts();
  }, []);

  useEffect(() => {
    // Determine which tab to show based on the path
    if (routeLocation.pathname.includes("new-sale")) {
      setActiveTab("sales");
    } else if (routeLocation.pathname.includes("new-order")) {
      setActiveTab("orders");
    }
    
    const id = params.id;
    const action = params.action;
    
    if (action === "new-sale") {
      setCurrentSale({
        id: generateId(),
        locationId: locations.length > 0 ? locations[0].id : "",
        date: new Date().toISOString().split("T")[0],
        items: [],
        notes: "",
      });
      setIsSaleDialogOpen(true);
    } else if (action === "new-order") {
      setCurrentOrder({
        id: generateId(),
        locationId: locations.length > 0 ? locations[0].id : "",
        date: new Date().toISOString().split("T")[0],
        items: [],
        status: "pending",
        notes: "",
      });
      setIsOrderDialogOpen(true);
    } else if (id) {
      // Determine if it's a sale or order
      if (routeLocation.pathname.includes("sales")) {
        const sale = sales.find((s) => s.id === id);
        if (sale) {
          setCurrentSale(sale);
          setIsSaleDialogOpen(true);
        } else {
          navigate("/sales-orders");
          toast.error("Sale not found");
        }
      } else if (routeLocation.pathname.includes("orders")) {
        const order = orders.find((o) => o.id === id);
        if (order) {
          setCurrentOrder(order);
          setIsOrderDialogOpen(true);
        } else {
          navigate("/sales-orders");
          toast.error("Order not found");
        }
      }
    }
  }, [params, sales, orders, locations, navigate, routeLocation]);

  const loadSales = () => {
    const loadedSales = getSales();
    setSales(loadedSales);
  };

  const loadOrders = () => {
    const loadedOrders = getOrders();
    setOrders(loadedOrders);
  };

  const loadLocations = () => {
    const loadedLocations = getLocations();
    setLocations(loadedLocations);
  };

  const loadProducts = () => {
    const loadedProducts = getProducts();
    setProducts(loadedProducts);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: 'sale' | 'order') => {
    const { name, value } = e.target;
    
    if (type === 'sale') {
      setCurrentSale((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setCurrentOrder((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmitSale = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentSale.locationId) {
      toast.error("Location is required");
      return;
    }
    
    if (currentSale.items.length === 0) {
      toast.error("At least one product is required");
      return;
    }
    
    saveSale(currentSale);
    loadSales();
    setIsSaleDialogOpen(false);
    navigate("/sales-orders");
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentOrder.locationId) {
      toast.error("Location is required");
      return;
    }
    
    if (currentOrder.items.length === 0) {
      toast.error("At least one product is required");
      return;
    }
    
    saveOrder(currentOrder);
    loadOrders();
    setIsOrderDialogOpen(false);
    navigate("/sales-orders");
  };

  const handleDeleteSale = () => {
    deleteSale(currentSale.id);
    loadSales();
    setIsDeleteDialogOpen(false);
    setIsSaleDialogOpen(false);
    navigate("/sales-orders");
  };

  const handleDeleteOrder = () => {
    deleteOrder(currentOrder.id);
    loadOrders();
    setIsDeleteDialogOpen(false);
    setIsOrderDialogOpen(false);
    navigate("/sales-orders");
  };

  const handleAddNewSale = () => {
    navigate("/sales-orders/new-sale");
  };

  const handleAddNewOrder = () => {
    navigate("/sales-orders/new-order");
  };

  const handleEditSale = (sale: Sale) => {
    navigate(`/sales-orders/sales/${sale.id}`);
  };

  const handleEditOrder = (order: Order) => {
    navigate(`/sales-orders/orders/${order.id}`);
  };

  const handleCloseDialog = () => {
    setIsSaleDialogOpen(false);
    setIsOrderDialogOpen(false);
    navigate("/sales-orders");
  };

  const handleAddSaleItem = () => {
    if (!newSaleItem.productId || newSaleItem.quantity <= 0) {
      toast.error("Select a product and specify quantity");
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

  const handleAddOrderItem = () => {
    if (!newOrderItem.productId || newOrderItem.quantity <= 0) {
      toast.error("Select a product and specify quantity");
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

  const handleRemoveSaleItem = (index: number) => {
    setCurrentSale(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveOrderItem = (index: number) => {
    setCurrentOrder(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
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

  const handleOrderProductChange = (productId: string) => {
    setNewOrderItem({
      productId,
      quantity: 1,
    });
  };

  const handleOrderStatusChange = (status: 'pending' | 'delivered' | 'cancelled') => {
    setCurrentOrder(prev => ({
      ...prev,
      status,
    }));
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

  const calculateSaleTotal = (items: SaleItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-amber-600";
    }
  };

  const getOrderStatusBg = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-amber-600";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 vendora-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-vendora-800">Sales & Orders</h1>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={handleAddNewSale} className="bg-vendora-600 hover:bg-vendora-700">
                <Plus className="mr-2 h-4 w-4" />
                Record Sale
              </Button>
            </div>
            
            {sales.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-medium">No sales recorded yet</h2>
                <p className="mt-2 text-muted-foreground">
                  Record your first sale from a point of sale location.
                </p>
                <Button onClick={handleAddNewSale} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Record Sale
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sales.map((sale) => (
                  <Card key={sale.id} className="border-sage-200">
                    <CardHeader className="pb-2 bg-sage-50">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-sage-600" />
                          <CardTitle className="truncate text-base">{getLocationName(sale.locationId)}</CardTitle>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditSale(sale)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(sale.date)}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-1">
                        {sale.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <div>{item.quantity}x {getProductName(item.productId)}</div>
                            <div>{formatCurrency(item.pricePerUnit * item.quantity)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-2 border-t border-border flex justify-between font-medium">
                        <div>Total:</div>
                        <div>{formatCurrency(calculateSaleTotal(sale.items))}</div>
                      </div>
                    </CardContent>
                    {sale.notes && (
                      <CardFooter className="pt-0">
                        <div className="text-xs text-muted-foreground truncate w-full">
                          {sale.notes}
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={handleAddNewOrder} className="bg-vendora-600 hover:bg-vendora-700">
                <Plus className="mr-2 h-4 w-4" />
                New Order
              </Button>
            </div>
            
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-medium">No orders placed yet</h2>
                <p className="mt-2 text-muted-foreground">
                  Create your first order from a point of sale location.
                </p>
                <Button onClick={handleAddNewOrder} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Order
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <Card key={order.id} className={`border-${order.status === 'delivered' ? 'sage' : 'vendora'}-200`}>
                    <CardHeader className={`pb-2 bg-${order.status === 'delivered' ? 'sage' : 'vendora'}-50`}>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Store className="h-4 w-4 text-vendora-600" />
                          <CardTitle className="truncate text-base">{getLocationName(order.locationId)}</CardTitle>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditOrder(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(order.date)}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <div>{item.quantity}x {getProductName(item.productId)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-2 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Status:</span>
                          <span className={`text-sm ${getOrderStatusColor(order.status)} font-medium flex items-center gap-1`}>
                            <span className={`h-2 w-2 ${getOrderStatusBg(order.status)} rounded-full`}></span>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    {order.notes && (
                      <CardFooter className="pt-0">
                        <div className="text-xs text-muted-foreground truncate w-full">
                          {order.notes}
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add/Edit Sale Dialog */}
        <Dialog open={isSaleDialogOpen} onOpenChange={setIsSaleDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleSubmitSale}>
              <DialogHeader>
                <DialogTitle>
                  {params.id ? "Edit Sale" : "Record New Sale"}
                </DialogTitle>
                <DialogDescription>
                  {params.id
                    ? "Update the details for this sale."
                    : "Record a new sale from a point of sale location."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="locationId">Location</Label>
                    <Select
                      value={currentSale.locationId}
                      onValueChange={(value) =>
                        setCurrentSale({ ...currentSale, locationId: value })
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
                    <Label htmlFor="saleDate">Date</Label>
                    <Input
                      id="saleDate"
                      name="date"
                      type="date"
                      value={currentSale.date}
                      onChange={(e) => handleChange(e, 'sale')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Products Sold</Label>
                  <Card>
                    <CardContent className="p-4">
                      {/* Add new item form */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <Select
                          value={newSaleItem.productId}
                          onValueChange={handleSaleProductChange}
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
                            value={newSaleItem.quantity}
                            onChange={(e) =>
                              setNewSaleItem({
                                ...newSaleItem,
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
                            value={newSaleItem.pricePerUnit}
                            onChange={(e) =>
                              setNewSaleItem({
                                ...newSaleItem,
                                pricePerUnit: parseFloat(e.target.value) || 0,
                              })
                            }
                            placeholder="Price"
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
                          No products added yet
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
                            <div>Total:</div>
                            <div>{formatCurrency(calculateSaleTotal(currentSale.items))}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="saleNotes">Notes</Label>
                  <Textarea
                    id="saleNotes"
                    name="notes"
                    value={currentSale.notes || ""}
                    onChange={(e) => handleChange(e, 'sale')}
                    placeholder="Any additional information..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter className="flex items-center justify-between">
                <div>
                  {params.id && (
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
                    {params.id ? "Update Sale" : "Record Sale"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Order Dialog */}
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleSubmitOrder}>
              <DialogHeader>
                <DialogTitle>
                  {params.id ? "Edit Order" : "New Order"}
                </DialogTitle>
                <DialogDescription>
                  {params.id
                    ? "Update the details for this order."
                    : "Create a new order from a point of sale location."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="orderLocationId">Location</Label>
                    <Select
                      value={currentOrder.locationId}
                      onValueChange={(value) =>
                        setCurrentOrder({ ...currentOrder, locationId: value })
                      }
                    >
                      <SelectTrigger id="orderLocationId">
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
                    <Label htmlFor="orderDate">Date</Label>
                    <Input
                      id="orderDate"
                      name="date"
                      type="date"
                      value={currentOrder.date}
                      onChange={(e) => handleChange(e, 'order')}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Products Ordered</Label>
                  <Card>
                    <CardContent className="p-4">
                      {/* Add new item form */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <Select
                          value={newOrderItem.productId}
                          onValueChange={handleOrderProductChange}
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
                            value={newOrderItem.quantity}
                            onChange={(e) =>
                              setNewOrderItem({
                                ...newOrderItem,
                                quantity: parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="Qty"
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
                          No products added yet
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {currentOrder.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between border-b pb-2">
                              <div className="flex-1">
                                <div className="font-medium">{getProductName(item.productId)}</div>
                                <div className="text-sm text-muted-foreground">
                                  Quantity: {item.quantity}
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
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={currentOrder.status}
                    onValueChange={(value) =>
                      handleOrderStatusChange(value as 'pending' | 'delivered' | 'cancelled')
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="orderNotes">Notes</Label>
                  <Textarea
                    id="orderNotes"
                    name="notes"
                    value={currentOrder.notes || ""}
                    onChange={(e) => handleChange(e, 'order')}
                    placeholder="Any special instructions..."
                    rows={2}
                  />
                </div>
              </div>
              <DialogFooter className="flex items-center justify-between">
                <div>
                  {params.id && (
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
                    {params.id ? "Update Order" : "Create Order"}
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
                Are you sure you want to delete this record? This action cannot be undone.
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
                onClick={activeTab === "sales" ? handleDeleteSale : handleDeleteOrder}
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

export default SalesOrders;
