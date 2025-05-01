
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface MonthlyRevenueChartProps {
  data: Array<{ month: string; revenue: number }>;
  formatCurrency: (amount: number) => string;
}

export const MonthlyRevenueChart = ({ data, formatCurrency }: MonthlyRevenueChartProps) => {
  const { translations } = useLanguage();
  
  const chartConfig = {
    revenue: {
      label: translations.reports.revenue,
      color: "#F5931D"
    }
  };

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
            <ChartContainer
              config={chartConfig}
              className="h-full w-full"
            >
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
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent
                            className="rounded-lg border bg-background p-2 shadow-md"
                            formatter={(value) => [
                              formatCurrency(value as number),
                              translations.reports.revenue
                            ]}
                            payload={payload}
                          />
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" name={translations.reports.revenue} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
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
