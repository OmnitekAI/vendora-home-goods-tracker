
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Order, Location, Product } from "@/types";
import { toast } from "@/components/ui/sonner";
import {
  getOrders,
  saveOrder,
  deleteOrder,
  generateId,
  getLocations,
  getProducts,
} from "@/utils/dataStorage";
import { useLanguage } from "@/context/LanguageContext";
import {
  OrdersList,
  OrderDialog,
  DeleteConfirmationDialog
} from "@/components/salesOrders";

const Orders = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { translations, language } = useLanguage();
  const t = translations.salesOrders;
  
  // Data states
  const [orders, setOrders] = useState<Order[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // UI states
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Current item states
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Load data on component mount
  useEffect(() => {
    console.log("Orders - Initial load");
    loadOrders();
    loadLocations();
    loadProducts();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    console.log("Orders - URL params updated:", params);
    
    const id = params.id || params.action;
    const action = params.action;
    
    if (action === "new-order") {
      console.log("Creating new order");
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
      console.log("Looking for order with ID:", id);
      const order = orders.find((o) => o.id === id);
      console.log("Found order:", order);
      
      if (order) {
        setCurrentOrder(order);
        setIsOrderDialogOpen(true);
      } else {
        // Only navigate away if we've already loaded orders
        if (orders.length > 0) {
          console.log("Order not found, navigating back to orders list");
          navigate("/orders");
          toast.error(language === 'es' ? "Orden no encontrada" : "Order not found");
        }
      }
    }
  }, [params, orders, locations, navigate, language]);

  const loadOrders = () => {
    const loadedOrders = getOrders();
    console.log("Orders loaded:", loadedOrders);
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

  const handleSubmitOrder = (order: Order) => {
    console.log("Submitting order:", order);
    saveOrder(order);
    loadOrders();
    setIsOrderDialogOpen(false);
    navigate("/orders");
  };

  const handleDeleteOrder = () => {
    if (currentOrder) {
      deleteOrder(currentOrder.id);
      loadOrders();
      setIsDeleteDialogOpen(false);
      setIsOrderDialogOpen(false);
      navigate("/orders");
    }
  };

  const handleAddNewOrder = () => {
    console.log("Adding new order");
    navigate("/orders/new-order");
  };

  const handleEditOrder = (order: Order) => {
    console.log("Navigating to edit order:", order.id);
    navigate(`/orders/${order.id}`);
  };

  const handleDeleteOrderFromList = (order: Order) => {
    console.log("Opening delete confirmation for order:", order.id);
    setCurrentOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsOrderDialogOpen(false);
    navigate("/orders");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 vendora-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-vendora-800">{t.orders}</h1>
        </div>

        <OrdersList 
          orders={orders}
          onAddNew={handleAddNewOrder}
          onEdit={handleEditOrder}
          onDelete={handleDeleteOrderFromList}
        />

        {/* Order Dialog */}
        {currentOrder && (
          <OrderDialog
            open={isOrderDialogOpen}
            onOpenChange={handleCloseDialog}
            order={currentOrder}
            locations={locations}
            products={products}
            onSubmit={handleSubmitOrder}
            onDelete={() => setIsDeleteDialogOpen(true)}
            isNew={params.action === "new-order"}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteOrder}
        />
      </main>
    </div>
  );
};

export default Orders;
