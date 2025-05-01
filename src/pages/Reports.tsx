
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  getLocations, 
  getProducts, 
  getDeliveries, 
  getSales, 
  getLocationName,
  getProductName,
  getProductById
} from "@/utils/dataStorage";
import { Location, Product, Delivery, Sale } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import {
  ReportHeader,
  SummaryCards,
  MonthlyRevenueChart,
  ProductPerformanceList,
  ProductDistributionChart,
  LocationPerformanceChart
} from "@/components/reports";

const Reports = () => {
  const { translations } = useLanguage();
  const [locations, setLocations] = useState<Location[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );

  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any[]>([]);
  const [productPerformanceData, setProductPerformanceData] = useState<any[]>([]);
  const [locationPerformanceData, setLocationPerformanceData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState({
    totalRevenue: 0,
    totalCost: 0,
    profit: 0,
    topProduct: { name: "", revenue: 0 },
    topLocation: { name: "", revenue: 0 },
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateReports();
  }, [selectedLocation, selectedMonth, sales, deliveries, products, locations]);

  const loadData = () => {
    const loadedLocations = getLocations();
    const loadedProducts = getProducts();
    const loadedDeliveries = getDeliveries();
    const loadedSales = getSales();

    setLocations(loadedLocations);
    setProducts(loadedProducts);
    setDeliveries(loadedDeliveries);
    setSales(loadedSales);
  };

  const calculateReports = () => {
    // Filter data based on selected location and month
    let filteredSales = [...sales];
    let filteredDeliveries = [...deliveries];

    if (selectedLocation !== "all") {
      filteredSales = filteredSales.filter(sale => sale.locationId === selectedLocation);
      filteredDeliveries = filteredDeliveries.filter(delivery => delivery.locationId === selectedLocation);
    }

    if (selectedMonth) {
      filteredSales = filteredSales.filter(sale => sale.date.startsWith(selectedMonth));
      filteredDeliveries = filteredDeliveries.filter(delivery => delivery.date.startsWith(selectedMonth));
    }

    // Calculate monthly revenue data
    const monthlyData: Record<string, number> = {};
    filteredSales.forEach(sale => {
      const monthYear = sale.date.substring(0, 7);
      const saleTotal = sale.items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
      
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = 0;
      }
      monthlyData[monthYear] += saleTotal;
    });

    const monthlyRevenueArray = Object.entries(monthlyData).map(([month, value]) => ({
      month: formatMonthYear(month),
      revenue: value,
    })).sort((a, b) => a.month.localeCompare(b.month));

    // Calculate product performance
    const productData: Record<string, { revenue: number, quantity: number, cost: number }> = {};
    
    filteredSales.forEach(sale => {
      sale.items.forEach(item => {
        const product = getProductById(item.productId);
        
        if (!productData[item.productId]) {
          productData[item.productId] = { revenue: 0, quantity: 0, cost: 0 };
        }
        
        productData[item.productId].revenue += item.quantity * item.pricePerUnit;
        productData[item.productId].quantity += item.quantity;
        
        if (product) {
          productData[item.productId].cost += item.quantity * product.costPrice;
        }
      });
    });

    const productPerformanceArray = Object.entries(productData)
      .map(([id, data]) => ({
        name: getProductName(id),
        revenue: data.revenue,
        profit: data.revenue - data.cost,
        quantity: data.quantity,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Calculate location performance
    const locationData: Record<string, { revenue: number, count: number }> = {};
    
    filteredSales.forEach(sale => {
      if (!locationData[sale.locationId]) {
        locationData[sale.locationId] = { revenue: 0, count: 0 };
      }
      
      const saleTotal = sale.items.reduce((sum, item) => sum + item.quantity * item.pricePerUnit, 0);
      locationData[sale.locationId].revenue += saleTotal;
      locationData[sale.locationId].count += 1;
    });

    const locationPerformanceArray = Object.entries(locationData)
      .map(([id, data]) => ({
        name: getLocationName(id),
        revenue: data.revenue,
        count: data.count,
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate summary data
    let totalRevenue = 0;
    let totalCost = 0;
    let topProductName = "";
    let topProductRevenue = 0;
    let topLocationName = "";
    let topLocationRevenue = 0;

    // Calculate total revenue and find top product
    Object.entries(productData).forEach(([id, data]) => {
      totalRevenue += data.revenue;
      totalCost += data.cost;
      
      if (data.revenue > topProductRevenue) {
        topProductRevenue = data.revenue;
        topProductName = getProductName(id);
      }
    });

    // Find top location
    Object.entries(locationData).forEach(([id, data]) => {
      if (data.revenue > topLocationRevenue) {
        topLocationRevenue = data.revenue;
        topLocationName = getLocationName(id);
      }
    });

    // Update state
    setMonthlyRevenueData(monthlyRevenueArray);
    setProductPerformanceData(productPerformanceArray);
    setLocationPerformanceData(locationPerformanceArray);
    setSummaryData({
      totalRevenue,
      totalCost,
      profit: totalRevenue - totalCost,
      topProduct: { name: topProductName, revenue: topProductRevenue },
      topLocation: { name: topLocationName, revenue: topLocationRevenue },
    });
  };

  const formatMonthYear = (dateString: string) => {
    const [year, month] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString("default", { month: "short", year: "numeric" });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getMonths = () => {
    const months: string[] = [];
    const monthSet = new Set<string>();
    
    // Get all months from sales
    sales.forEach(sale => {
      const monthYear = sale.date.substring(0, 7);
      monthSet.add(monthYear);
    });
    
    // Get all months from deliveries
    deliveries.forEach(delivery => {
      const monthYear = delivery.date.substring(0, 7);
      monthSet.add(monthYear);
    });
    
    return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Headers
    csvContent += "Product Name,Quantity Sold,Revenue,Profit\n";
    
    // Data rows
    productPerformanceData.forEach(product => {
      csvContent += `${product.name},${product.quantity},${product.revenue},${product.profit}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vendora-report-${selectedMonth}-${selectedLocation}.csv`);
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 vendora-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-vendora-800">{translations.reports.title}</h1>
        </div>
        
        <ReportHeader
          locations={locations}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          getMonths={getMonths}
          formatMonthYear={formatMonthYear}
          handleExportCSV={handleExportCSV}
        />
        
        <SummaryCards 
          summaryData={summaryData}
          formatCurrency={formatCurrency}
        />
        
        <Tabs defaultValue="revenue" className="w-full mb-8">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="revenue">{translations.reports.revenue}</TabsTrigger>
            <TabsTrigger value="products">{translations.reports.products}</TabsTrigger>
            <TabsTrigger value="locations">{translations.reports.locations}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-6">
            <MonthlyRevenueChart 
              data={monthlyRevenueData} 
              formatCurrency={formatCurrency} 
            />
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductPerformanceList 
                data={productPerformanceData}
                formatCurrency={formatCurrency}
              />
              
              <ProductDistributionChart 
                data={productPerformanceData}
                formatCurrency={formatCurrency}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="locations" className="space-y-6">
            <LocationPerformanceChart 
              data={locationPerformanceData}
              formatCurrency={formatCurrency}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
