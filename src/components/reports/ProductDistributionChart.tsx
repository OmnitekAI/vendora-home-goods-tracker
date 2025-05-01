
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ProductDistributionChartProps {
  data: Array<{
    name: string;
    revenue: number;
    profit: number;
    quantity: number;
  }>;
  formatCurrency: (amount: number) => string;
}

export const ProductDistributionChart = ({ data, formatCurrency }: ProductDistributionChartProps) => {
  const { translations } = useLanguage();
  const COLORS = ['#F5931D', '#B0C0A1', '#EACDA3', '#E87817', '#6E8657'];
  
  // Create config for each product
  const chartConfig = data.slice(0, 5).reduce((config, product, index) => {
    return {
      ...config,
      [product.name]: {
        label: product.name,
        color: COLORS[index % COLORS.length]
      }
    };
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.reports.productSalesDistribution}</CardTitle>
        <CardDescription>
          {translations.reports.productSalesDistributionDescription}
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
                <PieChart>
                  <Pie
                    data={data.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="revenue"
                    nameKey="name"
                    label={(entry) => entry.name}
                  >
                    {data.slice(0, 5).map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
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
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
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
