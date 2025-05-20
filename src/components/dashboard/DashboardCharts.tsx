
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import {
  MonthlyRevenueChart,
  ProductDistributionChart,
  LocationPerformanceChart
} from "@/components/reports";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface DashboardChartsProps {
  monthlyRevenueData: Array<{ month: string; revenue: number }>;
  productDistributionData: Array<{
    name: string;
    revenue: number;
    profit: number;
    quantity: number;
  }>;
  locationPerformanceData: Array<{
    name: string;
    revenue: number;
    count: number;
  }>;
  formatCurrency: (amount: number) => string;
}

const DashboardCharts = ({
  monthlyRevenueData,
  productDistributionData,
  locationPerformanceData,
  formatCurrency
}: DashboardChartsProps) => {
  const { translations, language } = useLanguage();
  const [currentView, setCurrentView] = useState<"combined" | "single">("combined");
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  // Load minimized state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("dashboard-charts-minimized");
    if (savedState !== null) {
      setIsMinimized(savedState === "true");
    }
  }, []);

  // Save minimized state to localStorage
  const toggleMinimize = () => {
    const newState = !isMinimized;
    setIsMinimized(newState);
    localStorage.setItem("dashboard-charts-minimized", String(newState));
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>
              {language === "en" ? "Data Visualization Dashboard" : "Tablero de Visualización de Datos"}
            </CardTitle>
            <CardDescription>
              {language === "en" 
                ? "Comprehensive view of your business metrics"
                : "Vista integral de las métricas de su negocio"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleMinimize}
              aria-label={isMinimized ? 
                (language === "en" ? "Expand charts" : "Expandir gráficos") : 
                (language === "en" ? "Minimize charts" : "Minimizar gráficos")}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            {!isMinimized && (
              <Tabs 
                defaultValue="combined" 
                className="w-full sm:w-auto"
                onValueChange={(value) => setCurrentView(value as "combined" | "single")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="combined">
                    {language === "en" ? "Combined View" : "Vista Combinada"}
                  </TabsTrigger>
                  <TabsTrigger value="single">
                    {language === "en" ? "Individual Charts" : "Gráficos Individuales"}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </div>
      </CardHeader>
      {!isMinimized && (
        <CardContent className="p-2 sm:p-6">
          {currentView === "combined" ? (
            <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="flex h-full items-center justify-center p-6">
                  <div className="w-full h-full">
                    <h3 className="text-lg font-semibold mb-2">
                      {translations.reports.monthlyRevenue}
                    </h3>
                    <div className="h-[500px]">
                      <MonthlyRevenueChart 
                        data={monthlyRevenueData} 
                        formatCurrency={formatCurrency} 
                      />
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel>
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={50}>
                    <div className="flex h-full items-center justify-center p-6">
                      <div className="w-full h-full">
                        <h3 className="text-lg font-semibold mb-2">
                          {translations.reports.productSalesDistribution}
                        </h3>
                        <ProductDistributionChart 
                          data={productDistributionData} 
                          formatCurrency={formatCurrency} 
                        />
                      </div>
                    </div>
                  </ResizablePanel>
                  <ResizableHandle withHandle />
                  <ResizablePanel defaultSize={50}>
                    <div className="flex h-full items-center justify-center p-6">
                      <div className="w-full h-full">
                        <h3 className="text-lg font-semibold mb-2">
                          {translations.reports.locationPerformance}
                        </h3>
                        <LocationPerformanceChart 
                          data={locationPerformanceData} 
                          formatCurrency={formatCurrency} 
                        />
                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <Tabs defaultValue="monthly" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="monthly">
                  {translations.reports.monthlyRevenue}
                </TabsTrigger>
                <TabsTrigger value="products">
                  {translations.reports.products}
                </TabsTrigger>
                <TabsTrigger value="locations">
                  {translations.reports.locations}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="monthly" className="pt-4 min-h-[500px]">
                <MonthlyRevenueChart 
                  data={monthlyRevenueData} 
                  formatCurrency={formatCurrency} 
                />
              </TabsContent>
              <TabsContent value="products" className="pt-4 min-h-[500px]">
                <ProductDistributionChart 
                  data={productDistributionData} 
                  formatCurrency={formatCurrency} 
                />
              </TabsContent>
              <TabsContent value="locations" className="pt-4 min-h-[500px]">
                <LocationPerformanceChart 
                  data={locationPerformanceData} 
                  formatCurrency={formatCurrency} 
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default DashboardCharts;
