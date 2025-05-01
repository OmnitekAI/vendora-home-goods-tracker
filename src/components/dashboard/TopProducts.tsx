
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

interface TopProductsProps {
  products: Array<{
    id: string;
    name: string;
    quantitySold: number;
  }>;
}

const TopProducts = ({ products }: TopProductsProps) => {
  const { translations } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.dashboard.topSellingProducts}</CardTitle>
        <CardDescription>
          {translations.dashboard.topSellingProductsDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-vendora-100 text-vendora-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <span>{product.name}</span>
                </div>
                <div className="text-sm font-medium">
                  {product.quantitySold} {translations.dashboard.sold}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            {translations.dashboard.noSalesRecorded}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopProducts;
