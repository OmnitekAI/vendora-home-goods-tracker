
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Sale, Location, Product } from "@/types";
import { toast } from "@/components/ui/sonner";
import {
  getSales,
  saveSale,
  deleteSale,
  generateId,
  getLocations,
  getProducts,
} from "@/utils/dataStorage";
import { useLanguage } from "@/context/LanguageContext";
import {
  SalesList,
  SaleDialog,
  DeleteConfirmationDialog
} from "@/components/salesOrders";

const Sales = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { translations, language } = useLanguage();
  const t = translations.salesOrders;
  
  // Data states
  const [sales, setSales] = useState<Sale[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // UI states
  const [isSaleDialogOpen, setIsSaleDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Current item states
  const [currentSale, setCurrentSale] = useState<Sale>({
    id: "",
    locationId: "",
    date: new Date().toISOString().split("T")[0],
    items: [],
    notes: "",
  });

  useEffect(() => {
    loadSales();
    loadLocations();
    loadProducts();
  }, []);

  useEffect(() => {
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
    } else if (id) {
      const sale = sales.find((s) => s.id === id);
      if (sale) {
        setCurrentSale(sale);
        setIsSaleDialogOpen(true);
      } else {
        navigate("/sales");
        toast.error(language === 'es' ? "Venta no encontrada" : "Sale not found");
      }
    }
  }, [params, sales, locations, navigate, language]);

  const loadSales = () => {
    const loadedSales = getSales();
    setSales(loadedSales);
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
    navigate("/sales");
  };

  const handleDeleteSale = () => {
    deleteSale(currentSale.id);
    loadSales();
    setIsDeleteDialogOpen(false);
    setIsSaleDialogOpen(false);
    navigate("/sales");
  };

  const handleAddNewSale = () => {
    navigate("/sales/new-sale");
  };

  const handleEditSale = (sale: Sale) => {
    navigate(`/sales/sales/${sale.id}`);
  };

  const handleDeleteSaleFromList = (sale: Sale) => {
    setCurrentSale(sale);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsSaleDialogOpen(false);
    navigate("/sales");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 vendora-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-vendora-800">{t.sales}</h1>
        </div>

        <SalesList 
          sales={sales}
          onAddNew={handleAddNewSale}
          onEdit={handleEditSale}
          onDelete={handleDeleteSaleFromList}
        />

        {/* Sale Dialog */}
        <SaleDialog
          open={isSaleDialogOpen}
          onOpenChange={setIsSaleDialogOpen}
          sale={currentSale}
          locations={locations}
          products={products}
          onSubmit={handleSubmitSale}
          onDelete={() => setIsDeleteDialogOpen(true)}
          isNew={!currentSale.id || params.action === "new-sale"}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteSale}
        />
      </main>
    </div>
  );
};

export default Sales;
