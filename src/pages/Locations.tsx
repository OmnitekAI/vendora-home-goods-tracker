
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Location } from "@/types";
import { getLocations, saveLocation, deleteLocation, generateId } from "@/utils/dataStorage";

import LocationCard from "@/components/locations/LocationCard";
import LocationForm from "@/components/locations/LocationForm";
import DeleteConfirmationDialog from "@/components/locations/DeleteConfirmationDialog";
import EmptyLocations from "@/components/locations/EmptyLocations";

const Locations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { translations } = useLanguage();
  
  const [locations, setLocations] = useState<Location[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<Location>({
    id: "",
    name: "",
    address: "",
    contactName: "",
    contactPhone: "",
    notes: "",
  });

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (id === "new") {
      setCurrentLocation({
        id: generateId(),
        name: "",
        address: "",
        contactName: "",
        contactPhone: "",
        notes: "",
      });
      setIsDialogOpen(true);
    } else if (id) {
      const location = locations.find((loc) => loc.id === id);
      if (location) {
        setCurrentLocation(location);
        setIsDialogOpen(true);
      } else {
        navigate("/locations");
        toast.error(translations.common.noData);
      }
    }
  }, [id, locations, navigate, translations]);

  const loadLocations = () => {
    const loadedLocations = getLocations();
    setLocations(loadedLocations);
  };

  const handleSaveLocation = (location: Location) => {
    saveLocation(location);
    loadLocations();
    setIsDialogOpen(false);
    navigate("/locations");
  };

  const handleDeleteLocation = () => {
    deleteLocation(currentLocation.id);
    loadLocations();
    setIsDeleteDialogOpen(false);
    setIsDialogOpen(false);
    navigate("/locations");
  };

  const handleAddNew = () => {
    navigate("/locations/new");
  };

  const handleEditLocation = (location: Location) => {
    navigate(`/locations/${location.id}`);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    navigate("/locations");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 vendora-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-vendora-800">{translations.locations.title}</h1>
          <Button onClick={handleAddNew} className="bg-vendora-600 hover:bg-vendora-700">
            <Plus className="mr-2 h-4 w-4" />
            {translations.locations.addLocation}
          </Button>
        </div>

        {locations.length === 0 ? (
          <EmptyLocations onAddLocation={handleAddNew} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <LocationCard 
                key={location.id} 
                location={location} 
                onEdit={handleEditLocation} 
              />
            ))}
          </div>
        )}

        {/* Add/Edit Location Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <LocationForm
            location={currentLocation}
            isNew={id === "new"}
            onClose={handleCloseDialog}
            onSave={handleSaveLocation}
            onDelete={() => setIsDeleteDialogOpen(true)}
          />
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DeleteConfirmationDialog
            onCancel={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleDeleteLocation}
          />
        </Dialog>
      </main>
    </div>
  );
};

export default Locations;
