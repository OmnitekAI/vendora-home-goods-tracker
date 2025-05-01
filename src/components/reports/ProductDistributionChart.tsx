
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useLanguage } from "@/context/LanguageContext";

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
                <Tooltip 
                  formatter={(value) => [
                    formatCurrency(value as number),
                    translations.reports.revenue
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
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
