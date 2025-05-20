
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sale, Order, Location, Product } from "@/types";
import { toast } from "@/components/ui/sonner";
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
} from "@/utils/dataStorage";
import { useLanguage } from "@/context/LanguageContext";
import {
  SalesList,
  OrdersList,
  SaleDialog,
  OrderDialog,
  DeleteConfirmationDialog
} from "@/components/salesOrders";

const SalesOrders = () => {
  const params = useParams();
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sales");
  const { translations, language } = useLanguage();
  const t = translations.salesOrders;
  
  // Data states
  const [sales, setSales] = useState<Sale[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // UI states
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<'sale' | 'order' | null>(null);
  
  // Current item states
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
    } else if (routeLocation.pathname.includes("sales/")) {
      setActiveTab("sales");
    } else if (routeLocation.pathname.includes("orders/")) {
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
      // Determine if it's a sale or order based on the URL path
      if (routeLocation.pathname.includes("/sales-orders/sales/")) {
        const sale = sales.find((s) => s.id === id);
        if (sale) {
          setCurrentSale(sale);
          setIsSaleDialogOpen(true);
        } else {
          navigate("/sales-orders");
          toast.error(language === 'es' ? "Venta no encontrada" : "Sale not found");
        }
      } else if (routeLocation.pathname.includes("/sales-orders/orders/")) {
        const order = orders.find((o) => o.id === id);
        if (order) {
          setCurrentOrder(order);
          setIsOrderDialogOpen(true);
        } else {
          navigate("/sales-orders");
          toast.error(language === 'es' ? "Orden no encontrada" : "Order not found");
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

  const handleSubmitSale = (sale: Sale) => {
    saveSale(sale);
    loadSales();
    setIsSaleDialogOpen(false);
    navigate("/sales-orders");
  };

  const handleSubmitOrder = (order: Order) => {
    saveOrder(order);
    loadOrders();
    setIsOrderDialogOpen(false);
    navigate("/sales-orders");
  };

  const handleDeleteSale = () => {
    deleteSale(currentSale.id);
    loadSales();
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
    setIsSaleDialogOpen(false);
    navigate("/sales-orders");
  };

  const handleDeleteOrder = () => {
    deleteOrder(currentOrder.id);
    loadOrders();
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
    setIsOrderDialogOpen(false);
    navigate("/sales-orders");
  };

  const confirmDelete = (type: 'sale' | 'order') => {
    setItemToDelete(type);
    setIsDeleteDialogOpen(true);
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

  const handleDeleteSaleFromList = (sale: Sale) => {
    setCurrentSale(sale);
    confirmDelete('sale');
  };

  const handleDeleteOrderFromList = (order: Order) => {
    setCurrentOrder(order);
    confirmDelete('order');
  };

  const handleCloseDialog = () => {
    setIsSaleDialogOpen(false);
    setIsOrderDialogOpen(false);
    navigate("/sales-orders");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 vendora-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-vendora-800">{t.title}</h1>
        </div>

        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="sales">{t.sales}</TabsTrigger>
            <TabsTrigger value="orders">{t.orders}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-6">
            <SalesList 
              sales={sales}
              onAddNew={handleAddNewSale}
              onEdit={handleEditSale}
              onDelete={handleDeleteSaleFromList}
            />
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-6">
            <OrdersList 
              orders={orders}
              onAddNew={handleAddNewOrder}
              onEdit={handleEditOrder}
              onDelete={handleDeleteOrderFromList}
            />
          </TabsContent>
        </Tabs>

        {/* Sale Dialog */}
        <SaleDialog
          open={isSaleDialogOpen}
          onOpenChange={setIsSaleDialogOpen}
          sale={currentSale}
          locations={locations}
          products={products}
          onSubmit={handleSubmitSale}
          onDelete={() => confirmDelete('sale')}
          isNew={!currentSale.id || params.action === "new-sale"}
        />

        {/* Order Dialog */}
        <OrderDialog
          open={isOrderDialogOpen}
          onOpenChange={setIsOrderDialogOpen}
          order={currentOrder}
          locations={locations}
          products={products}
          onSubmit={handleSubmitOrder}
          onDelete={() => confirmDelete('order')}
          isNew={!currentOrder.id || params.action === "new-order"}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={itemToDelete === 'sale' ? handleDeleteSale : handleDeleteOrder}
        />
      </main>
    </div>
  );
};

export default SalesOrders;
