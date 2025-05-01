
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Store, Plus, Edit, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Location } from "@/types";
import { getLocations, saveLocation, deleteLocation, generateId } from "@/utils/dataStorage";

const Locations = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
        toast.error("Location not found");
      }
    }
  }, [id, locations, navigate]);

  const loadLocations = () => {
    const loadedLocations = getLocations();
    setLocations(loadedLocations);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentLocation.name || !currentLocation.address) {
      toast.error("Name and address are required");
      return;
    }
    
    saveLocation(currentLocation);
    loadLocations();
    setIsDialogOpen(false);
    navigate("/locations");
  };

  const handleDelete = () => {
    deleteLocation(currentLocation.id);
    loadLocations();
    setIsDeleteDialogOpen(false);
    setIsDialogOpen(false);
    navigate("/locations");
  };

  const handleAddNew = () => {
    navigate("/locations/new");
  };

  const handleEdit = (location: Location) => {
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
          <h1 className="text-3xl font-bold text-vendora-800">Locations</h1>
          <Button onClick={handleAddNew} className="bg-vendora-600 hover:bg-vendora-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </div>

        {locations.length === 0 ? (
          <div className="text-center py-12">
            <Store className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium">No locations added yet</h2>
            <p className="mt-2 text-muted-foreground">
              Add your first location to start tracking your point of sales.
            </p>
            <Button onClick={handleAddNew} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locations.map((location) => (
              <Card key={location.id} className="overflow-hidden">
                <CardHeader className="pb-2 bg-vendora-50">
                  <CardTitle className="flex justify-between items-center">
                    <div className="truncate">{location.name}</div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(location)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Address</div>
                      <div>{location.address}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Contact</div>
                      <div>{location.contactName}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Phone</div>
                      <div>{location.contactPhone}</div>
                    </div>
                    {location.notes && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Notes</div>
                        <div className="text-sm">{location.notes}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add/Edit Location Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {id === "new" ? "Add New Location" : "Edit Location"}
                </DialogTitle>
                <DialogDescription>
                  {id === "new"
                    ? "Enter the details for the new point of sale location."
                    : "Update the details for this point of sale location."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Location Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentLocation.name}
                    onChange={handleChange}
                    placeholder="Cafe Sweet Home"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={currentLocation.address}
                    onChange={handleChange}
                    placeholder="123 Main Street, City"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactName">Contact Person</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={currentLocation.contactName}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={currentLocation.contactPhone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={currentLocation.notes || ""}
                    onChange={handleChange}
                    placeholder="Additional information about this location..."
                    rows={3}
                  />
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
                    {id === "new" ? "Add Location" : "Update Location"}
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
                Are you sure you want to delete this location? This action cannot be undone.
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

export default Locations;
