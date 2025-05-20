
import { Order } from "@/types";
import { Store, Calendar, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/LanguageContext";
import { getLocationName, getProductName } from "@/utils/dataStorage";

interface OrderCardProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrderCard = ({ order, onEdit, onDelete }: OrderCardProps) => {
  const { translations, language } = useLanguage();
  const t = translations.salesOrders;
  const c = translations.common;

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat(language === 'es' ? "es-ES" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-amber-600";
    }
  };

  const getOrderStatusBg = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-600";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-amber-600";
    }
  };

  return (
    <Card className={`border-${order.status === 'delivered' ? 'sage' : 'vendora'}-200`}>
      <CardHeader className={`pb-2 bg-${order.status === 'delivered' ? 'sage' : 'vendora'}-50`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-vendora-600" />
            <CardTitle className="truncate text-base">{getLocationName(order.locationId)}</CardTitle>
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
              <DropdownMenuItem onClick={() => onEdit(order)}>
                <Edit className="h-4 w-4 mr-2" />
                {c.edit}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(order)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {c.delete}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(order.date)}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-1">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <div>{item.quantity}x {getProductName(item.productId)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-2 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t.status}:</span>
            <span className={`text-sm ${getOrderStatusColor(order.status)} font-medium flex items-center gap-1`}>
              <span className={`h-2 w-2 ${getOrderStatusBg(order.status)} rounded-full`}></span>
              {order.status === 'pending' ? t.pending : 
               order.status === 'delivered' ? t.delivered : 
               t.cancelled}
            </span>
          </div>
        </div>
      </CardContent>
      {order.notes && (
        <CardFooter className="pt-0">
          <div className="text-xs text-muted-foreground truncate w-full">
            {order.notes}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default OrderCard;
