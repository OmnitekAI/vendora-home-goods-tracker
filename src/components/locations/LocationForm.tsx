
import React, { useState, useEffect } from "react";
import { Location } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

interface LocationFormProps {
  location: Location;
  isNew: boolean;
  onClose: () => void;
  onSave: (location: Location) => void;
  onDelete: () => void;
}

const LocationForm = ({ location, isNew, onClose, onSave, onDelete }: LocationFormProps) => {
  const { translations } = useLanguage();
  const [currentLocation, setCurrentLocation] = useState<Location>(location);
  
  // Sync with prop changes
  useEffect(() => {
    setCurrentLocation(location);
  }, [location]);
  
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
      // Fix: Use the existing 'required' property instead of 'requiredFields'
      toast.error(translations.common.required);
      return;
    }
    
    onSave(currentLocation);
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {isNew ? translations.locations.addLocation : translations.locations.editLocation}
          </DialogTitle>
          <DialogDescription>
            {isNew
              ? translations.locations.addLocationDescription
              : translations.locations.editLocationDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">{translations.locations.locationName}</Label>
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
            <Label htmlFor="address">{translations.locations.address}</Label>
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
            <Label htmlFor="contactName">{translations.locations.contactPerson}</Label>
            <Input
              id="contactName"
              name="contactName"
              value={currentLocation.contactName}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="contactPhone">{translations.locations.contactPhone}</Label>
            <Input
              id="contactPhone"
              name="contactPhone"
              value={currentLocation.contactPhone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">{translations.locations.notes}</Label>
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
            {!isNew && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
              >
                {translations.common.delete}
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              {translations.common.cancel}
            </Button>
            <Button type="submit" className="bg-vendora-600 hover:bg-vendora-700">
              {isNew ? translations.locations.addLocation : translations.common.save}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default LocationForm;
