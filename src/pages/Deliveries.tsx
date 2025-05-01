
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Delivery, DeliveryItem, Location, Product } from "@/types";
import {
  getDeliveries,
  saveDelivery,
  deleteDelivery,
  generateId,
  getLocations,
  getProducts,
} from "@/utils/dataStorage";
import { EmptyDeliveries } from "@/components/deliveries/EmptyDeliveries";
import { DeliveryCard } from "@/components/deliveries/DeliveryCard";
import { DeliveryDialog } from "@/components/deliveries/DeliveryDialog";
import { useLanguage } from "@/context/LanguageContext";

const Deliveries = () => {
  const { translations } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDelivery, setCurrentDelivery] = useState<Delivery>({
    id: "",
    locationId: "",
    date: new Date().toISOString().split("T")[0],
    items: [],
    notes: "",
    isPaid: false,
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

  const handleSaveDelivery = (delivery: Delivery) => {
    saveDelivery(delivery);
    loadDeliveries();
    setIsDialogOpen(false);
    navigate("/deliveries");
  };

  const handleDeleteDelivery = () => {
    deleteDelivery(currentDelivery.id);
    loadDeliveries();
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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 vendora-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-vendora-800">{translations.deliveries.title}</h1>
          <Button onClick={handleAddNew} className="bg-vendora-600 hover:bg-vendora-700">
            <Plus className="mr-2 h-4 w-4" />
            {translations.deliveries.addDelivery}
          </Button>
        </div>

        {deliveries.length === 0 ? (
          <EmptyDeliveries onAddNew={handleAddNew} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deliveries.map((delivery) => (
              <DeliveryCard
                key={delivery.id}
                delivery={delivery}
                onEdit={handleEdit}
                formatCurrency={formatCurrency}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        <DeliveryDialog
          isOpen={isDialogOpen}
          onOpenChange={handleCloseDialog}
          currentDelivery={currentDelivery}
          locations={locations}
          products={products}
          isNew={id === "new"}
          onSave={handleSaveDelivery}
          onDelete={handleDeleteDelivery}
          formatCurrency={formatCurrency}
        />
      </main>
    </div>
  );
};

export default Deliveries;
