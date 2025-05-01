
import React, { useState } from "react";
import { Location } from "@/types";
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
  const [currentLocation, setCurrentLocation] = React.useState<Location>(location);
  
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
    
    onSave(currentLocation);
  };
  
  return (
    <DialogContent className="sm:max-w-md">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>
            {isNew ? "Add New Location" : "Edit Location"}
          </DialogTitle>
          <DialogDescription>
            {isNew
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
            {!isNew && (
              <Button
                type="button"
                variant="destructive"
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-vendora-600 hover:bg-vendora-700">
              {isNew ? "Add Location" : "Update Location"}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default LocationForm;
