
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

interface ProductPerformanceListProps {
  data: Array<{
    name: string;
    revenue: number;
    profit: number;
    quantity: number;
  }>;
  formatCurrency: (amount: number) => string;
}

export const ProductPerformanceList = ({ data, formatCurrency }: ProductPerformanceListProps) => {
  const { translations } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.reports.topProductsRevenue}</CardTitle>
        <CardDescription>
          {translations.reports.topProductsRevenueDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="space-y-4">
            {data.slice(0, 5).map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-vendora-100 text-vendora-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {product.quantity} {translations.reports.unitsSold}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(product.revenue)}</div>
                  <div className="text-sm text-sage-600">
                    {formatCurrency(product.profit)} {translations.reports.profit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {translations.reports.noProductData}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
