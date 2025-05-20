
import { Sale, SaleItem } from "@/types";
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

interface SaleCardProps {
  sale: Sale;
  onEdit: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
}

const SaleCard = ({ sale, onEdit, onDelete }: SaleCardProps) => {
  const { translations, language } = useLanguage();
  const t = translations.salesOrders;
  const c = translations.common;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  const calculateSaleTotal = (items: SaleItem[]) => {
    return items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
  };

  return (
    <Card className="border-sage-200">
      <CardHeader className="pb-2 bg-sage-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-sage-600" />
            <CardTitle className="truncate text-base">{getLocationName(sale.locationId)}</CardTitle>
          </div>
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
              <DropdownMenuItem onClick={() => onEdit(sale)}>
                <Edit className="h-4 w-4 mr-2" />
                {c.edit}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(sale)}
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
          <span>{formatDate(sale.date)}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-1">
          {sale.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <div>{item.quantity}x {getProductName(item.productId)}</div>
              <div>{formatCurrency(item.pricePerUnit * item.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-2 border-t border-border flex justify-between font-medium">
          <div>{t.total}:</div>
          <div>{formatCurrency(calculateSaleTotal(sale.items))}</div>
        </div>
      </CardContent>
      {sale.notes && (
        <CardFooter className="pt-0">
          <div className="text-xs text-muted-foreground truncate w-full">
            {sale.notes}
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default SaleCard;
