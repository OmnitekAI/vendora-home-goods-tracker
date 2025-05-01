
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Package, Truck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface StatsCardsProps {
  stats: {
    locationCount: number;
    productCount: number;
    deliveryCount: number;
    orderCount: number;
    unpaidDeliveries: number;
    pendingOrders: number;
  };
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const { language, translations } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>{translations.navbar.locations}</span>
            <Store className="h-5 w-5 text-vendora-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.locationCount}</div>
          <Link to="/locations">
            <Button variant="link" className="p-0 h-auto text-vendora-600">
              {language === 'en' ? 'Manage locations' : 'Gestionar ubicaciones'}
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>{translations.navbar.products}</span>
            <Package className="h-5 w-5 text-vendora-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.productCount}</div>
          <Link to="/products">
            <Button variant="link" className="p-0 h-auto text-vendora-600">
              {language === 'en' ? 'Manage products' : 'Gestionar productos'}
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>{translations.navbar.deliveries}</span>
            <Truck className="h-5 w-5 text-vendora-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.deliveryCount}</div>
          <p className="text-sm text-muted-foreground">
            {stats.unpaidDeliveries > 0 
              ? language === 'en' 
                ? `${stats.unpaidDeliveries} unpaid` 
                : `${stats.unpaidDeliveries} sin pagar`
              : language === 'en' 
                ? "All paid" 
                : "Todo pagado"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>{translations.navbar.salesOrders}</span>
            <ShoppingCart className="h-5 w-5 text-vendora-600" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.orderCount}</div>
          <p className="text-sm text-muted-foreground">
            {stats.pendingOrders > 0 
              ? language === 'en' 
                ? `${stats.pendingOrders} pending` 
                : `${stats.pendingOrders} pendientes`
              : language === 'en' 
                ? "No pending orders" 
                : "Sin pedidos pendientes"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
