
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Calendar, Edit } from "lucide-react";
import { Delivery, DeliveryItem } from "@/types";
import { getLocationName, getProductName } from "@/utils/dataStorage";

interface DeliveryCardProps {
  delivery: Delivery;
  onEdit: (delivery: Delivery) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export const DeliveryCard = ({ 
  delivery, 
  onEdit, 
  formatCurrency, 
  formatDate 
}: DeliveryCardProps) => {
  const calculateTotal = (items: DeliveryItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
  };

  return (
    <Card className={delivery.isPaid ? "border-sage-200" : "border-vendora-200"}>
      <CardHeader className={`pb-2 ${delivery.isPaid ? "bg-sage-50" : "bg-vendora-50"}`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-vendora-600" />
            <CardTitle className="truncate text-base">{getLocationName(delivery.locationId)}</CardTitle>
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(delivery)}
          >
            <Edit className="h-4 w-4" />
          </Button>
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
          <div>Total:</div>
          <div>{formatCurrency(calculateTotal(delivery.items))}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <div>
          {delivery.isPaid ? (
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <span className="h-2 w-2 bg-green-600 rounded-full"></span>
              Paid
            </span>
          ) : (
            <span className="text-sm text-amber-600 font-medium flex items-center gap-1">
              <span className="h-2 w-2 bg-amber-600 rounded-full"></span>
              Unpaid
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
  );
};
