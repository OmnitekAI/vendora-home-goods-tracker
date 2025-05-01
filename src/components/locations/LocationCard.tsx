
import { Location } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface LocationCardProps {
  location: Location;
  onEdit: (location: Location) => void;
}

const LocationCard = ({ location, onEdit }: LocationCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2 bg-vendora-50">
        <CardTitle className="flex justify-between items-center">
          <div className="truncate">{location.name}</div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(location)}
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
  );
};

export default LocationCard;
