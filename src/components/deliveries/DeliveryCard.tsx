
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Calendar, Edit, MoreVertical, Trash2 } from "lucide-react";
import { Delivery, DeliveryItem } from "@/types";
import { getLocationName, getProductName, deleteDelivery } from "@/utils/storage";
import { useLanguage } from "@/context/LanguageContext";
import { DeliveryDeleteDialog } from "./DeliveryDeleteDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DeliveryCardProps {
  delivery: Delivery;
  onEdit: (delivery: Delivery) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
  onDelete?: () => void;
}

export const DeliveryCard = ({ 
  delivery, 
  onEdit, 
  formatCurrency, 
  formatDate,
  onDelete
}: DeliveryCardProps) => {
  const { translations, language } = useLanguage();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const calculateTotal = (items: DeliveryItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
  };

  const handleDelete = () => {
    deleteDelivery(delivery.id);
    setIsDeleteDialogOpen(false);
    if (onDelete) onDelete();
  };

  return (
    <>
      <Card className={delivery.isPaid ? "border-sage-200" : "border-vendora-200"}>
        <CardHeader className={`pb-2 ${delivery.isPaid ? "bg-sage-50" : "bg-vendora-50"}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-vendora-600" />
              <CardTitle className="truncate text-base">{getLocationName(delivery.locationId)}</CardTitle>
            </div>
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
                <DropdownMenuItem onClick={() => onEdit(delivery)}>
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
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(delivery.date)}</span>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-1">
            {delivery.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div>{item.quantity}x {getProductName(item.productId)}</div>
                <div>{formatCurrency(item.pricePerUnit * item.quantity)}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-2 border-t border-border flex justify-between font-medium">
            <div>{translations.deliveries.total}:</div>
            <div>{formatCurrency(calculateTotal(delivery.items))}</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-0">
          <div>
            {delivery.isPaid ? (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                {translations.deliveries.paid}
              </span>
            ) : (
              <span className="text-sm text-amber-600 font-medium flex items-center gap-1">
                <span className="h-2 w-2 bg-amber-600 rounded-full"></span>
                {translations.deliveries.unpaid}
              </span>
            )}
          </div>
          {delivery.notes && (
            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
              {delivery.notes}
            </div>
          )}
        </CardFooter>
      </Card>

      <DeliveryDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onDelete={handleDelete}
        deliveryId={delivery.id}
      />
    </>
  );
};
