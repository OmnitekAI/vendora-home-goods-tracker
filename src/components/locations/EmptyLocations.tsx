
import { Button } from "@/components/ui/button";
import { Store, Plus } from "lucide-react";

interface EmptyLocationsProps {
  onAddLocation: () => void;
}

const EmptyLocations = ({ onAddLocation }: EmptyLocationsProps) => {
  return (
    <div className="text-center py-12">
      <Store className="mx-auto h-12 w-12 text-muted-foreground" />
      <h2 className="mt-4 text-lg font-medium">No locations added yet</h2>
      <p className="mt-2 text-muted-foreground">
        Add your first location to start tracking your point of sales.
      </p>
      <Button onClick={onAddLocation} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
        <Plus className="mr-2 h-4 w-4" />
        Add Location
      </Button>
    </div>
  );
};

export default EmptyLocations;
