
import { Order } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getLocationName } from "@/utils/dataStorage";

interface OrderCardProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrderCard = ({ order, onEdit, onDelete }: OrderCardProps) => {
  const { translations } = useLanguage();
  const t = translations.salesOrders;
  const c = translations.common;

  // Helper to format date in a readable way
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  // Helper to get status class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper to translate status
  const translateStatus = (status: string) => {
    switch (status) {
      case "pending":
        return t.pending;
      case "delivered":
        return t.delivered;
      case "cancelled":
        return t.cancelled;
      default:
        return status;
    }
  };

  const handleEdit = () => {
    console.log("Editing order:", order);
    onEdit(order);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between mb-2">
          <h3 className="font-medium">{getLocationName(order.locationId)}</h3>
          <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusClass(order.status)}`}>
            {translateStatus(order.status)}
          </span>
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          {t.date}: {formatDate(order.date)}
        </div>
        <div className="text-sm mb-2">
          {t.items}: {order.items.length}
        </div>
        {order.notes && (
          <div className="text-sm italic text-muted-foreground mt-2">
            {order.notes}
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-muted/50 p-4 flex justify-end gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleEdit}
          aria-label={c.edit}
        >
          <Edit className="h-4 w-4 mr-1" />
          {c.edit}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-destructive hover:text-destructive" 
          onClick={() => onDelete(order)}
          aria-label={c.delete}
        >
          <Trash className="h-4 w-4 mr-1" />
          {c.delete}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;
