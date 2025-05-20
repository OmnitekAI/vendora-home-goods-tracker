
import { Order } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, MoreVertical } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getLocationName } from "@/utils/dataStorage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OrderCardProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrderCard = ({ order, onEdit, onDelete }: OrderCardProps) => {
  const { translations, language } = useLanguage();
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
          <div className="flex items-center">
            <span className={`px-2 py-0.5 rounded-full text-xs mr-2 ${getStatusClass(order.status)}`}>
              {translateStatus(order.status)}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">
                    {language === 'es' ? 'Menú de acciones' : 'Actions menu'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  {c.edit}
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(order)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  {c.delete}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mb-2">
          {t.date}: {formatDate(order.date)}
        </div>
        <div className="text-sm mb-2">
          {t.quantity}: {order.items.length}
        </div>
        {order.notes && (
          <div className="text-sm italic text-muted-foreground mt-2">
            {order.notes}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderCard;
