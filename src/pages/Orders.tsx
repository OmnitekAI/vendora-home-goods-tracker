
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

  useEffect(() => {
    loadOrders();
    loadLocations();
    loadProducts();
  }, []);

  useEffect(() => {
    const id = params.id;
    const action = params.action;
    
    if (action === "new-order") {
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
      const order = orders.find((o) => o.id === id);
      if (order) {
        setCurrentOrder(order);
        setIsOrderDialogOpen(true);
      } else {
        navigate("/orders");
        toast.error(language === 'es' ? "Orden no encontrada" : "Order not found");
      }
    }
  }, [params, orders, locations, navigate, language]);

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

  const handleSubmitOrder = (order: Order) => {
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
    navigate("/orders/new-order");
  };

  const handleEditOrder = (order: Order) => {
    navigate(`/orders/${order.id}`);
  };

  const handleDeleteOrderFromList = (order: Order) => {
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
            isNew={!currentOrder.id || params.action === "new-order"}
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
