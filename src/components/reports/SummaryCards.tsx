
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

interface SummaryCardsProps {
  summaryData: {
    totalRevenue: number;
    totalCost: number;
    profit: number;
    topProduct: { name: string; revenue: number };
    topLocation: { name: string; revenue: number };
  };
  formatCurrency: (amount: number) => string;
}

export const SummaryCards = ({ summaryData, formatCurrency }: SummaryCardsProps) => {
  const { translations } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{translations.reports.totalRevenue}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-vendora-600">
            {formatCurrency(summaryData.totalRevenue)}
          </div>
          <p className="text-muted-foreground text-sm">
            {translations.reports.totalRevenueDescription}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{translations.reports.totalProfit}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-sage-600">
            {formatCurrency(summaryData.profit)}
          </div>
          <p className="text-muted-foreground text-sm">
            {translations.reports.totalProfitDescription}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{translations.reports.profitMargin}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-sage-600">
            {summaryData.totalRevenue > 0
              ? `${((summaryData.profit / summaryData.totalRevenue) * 100).toFixed(1)}%`
              : "0%"}
          </div>
          <p className="text-muted-foreground text-sm">
            {translations.reports.profitMarginDescription}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
