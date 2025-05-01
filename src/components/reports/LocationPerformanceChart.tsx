
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { useLanguage } from "@/context/LanguageContext";

interface LocationPerformanceChartProps {
  data: Array<{
    name: string;
    revenue: number;
    count: number;
  }>;
  formatCurrency: (amount: number) => string;
}

export const LocationPerformanceChart = ({ data, formatCurrency }: LocationPerformanceChartProps) => {
  const { translations } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.reports.locationPerformance}</CardTitle>
        <CardDescription>
          {translations.reports.locationPerformanceDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => 
                    new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(value)
                  }
                />
                <YAxis type="category" dataKey="name" width={150} />
                <Tooltip 
                  formatter={(value) => [
                    formatCurrency(value as number),
                    translations.reports.revenue
                  ]}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#B0C0A1" name={translations.reports.revenue} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {translations.reports.noLocationData}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
