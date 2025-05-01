
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useLanguage } from "@/context/LanguageContext";

interface MonthlyRevenueChartProps {
  data: Array<{ month: string; revenue: number }>;
  formatCurrency: (amount: number) => string;
}

export const MonthlyRevenueChart = ({ data, formatCurrency }: MonthlyRevenueChartProps) => {
  const { translations } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.reports.monthlyRevenue}</CardTitle>
        <CardDescription>
          {translations.reports.monthlyRevenueDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(value)
                  }
                />
                <Tooltip 
                  formatter={(value) => [
                    formatCurrency(value as number),
                    translations.reports.revenue
                  ]}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#F5931D" name={translations.reports.revenue} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {translations.reports.noRevenueData}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
