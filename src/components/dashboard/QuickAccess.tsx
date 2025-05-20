
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Package, Truck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const QuickAccess = () => {
  const { translations } = useLanguage();

  return (
    <Card className="card-gradient text-white">
      <CardHeader>
        <CardTitle>{translations.dashboard.quickAccess}</CardTitle>
        <CardDescription className="text-white/90">
          {translations.dashboard.quickAccessDescription}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Link to="/locations/new">
            <Button variant="secondary" className="w-full justify-start">
              <Store className="mr-2 h-4 w-4" />
              {translations.dashboard.addNewLocation}
            </Button>
          </Link>
        </div>
        <div>
          <Link to="/products/new">
            <Button variant="secondary" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              {translations.dashboard.addNewProduct}
            </Button>
          </Link>
        </div>
        <div>
          <Link to="/deliveries/new">
            <Button variant="secondary" className="w-full justify-start">
              <Truck className="mr-2 h-4 w-4" />
              {translations.dashboard.recordDelivery}
            </Button>
          </Link>
        </div>
        <div>
          <Link to="/sales/new-sale">
            <Button variant="secondary" className="w-full justify-start">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {translations.dashboard.recordSale}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickAccess;
