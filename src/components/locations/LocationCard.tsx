
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Location } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { deleteLocation } from "@/utils/storage";
import { Dialog } from "@/components/ui/dialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LocationCardProps {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete?: () => void;
}

const LocationCard = ({ location, onEdit, onDelete }: LocationCardProps) => {
  const { translations, language } = useLanguage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDelete = () => {
    deleteLocation(location.id);
    setIsDeleteDialogOpen(false);
    if (onDelete) onDelete();
  };
  
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 bg-vendora-50">
          <CardTitle className="flex justify-between items-center">
            <div className="truncate pr-2">{location.name}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">
                    {language === 'es' ? 'Menú de acciones' : 'Actions menu'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onEdit(location)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {translations.common.edit}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {translations.common.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div>
              <div className="text-sm font-medium text-muted-foreground">{translations.locations.address}</div>
              <div>{location.address}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{translations.locations.contactPerson}</div>
              <div>{location.contactName}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">{translations.locations.contactPhone}</div>
              <div>{location.contactPhone}</div>
            </div>
            {location.notes && (
              <div>
                <div className="text-sm font-medium text-muted-foreground">{translations.locations.notes}</div>
                <div className="text-sm">{location.notes}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DeleteConfirmationDialog 
          onCancel={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />
      </Dialog>
    </>
  );
};

export default LocationCard;
