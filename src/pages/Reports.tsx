
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Store, ArrowRight, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const Reports = () => {
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

  const COLORS = ['#F5931D', '#B0C0A1', '#EACDA3', '#E87817', '#6E8657'];

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
          <h1 className="text-3xl font-bold text-vendora-800">Reports</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="md:w-1/3">
            <div className="text-sm font-medium mb-1">Location</div>
            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:w-1/3">
            <div className="text-sm font-medium mb-1">Month</div>
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                {getMonths().map(month => (
                  <SelectItem key={month} value={month}>
                    {formatMonthYear(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:w-1/3 flex items-end">
            <Button 
              variant="outline" 
              className="w-full flex items-center gap-2"
              onClick={handleExportCSV}
            >
              <Download className="w-4 h-4" />
              Export Report to CSV
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-vendora-600">
                {formatCurrency(summaryData.totalRevenue)}
              </div>
              <p className="text-muted-foreground text-sm">
                For selected period
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sage-600">
                {formatCurrency(summaryData.profit)}
              </div>
              <p className="text-muted-foreground text-sm">
                Revenue minus costs
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Profit Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sage-600">
                {summaryData.totalRevenue > 0
                  ? `${((summaryData.profit / summaryData.totalRevenue) * 100).toFixed(1)}%`
                  : "0%"}
              </div>
              <p className="text-muted-foreground text-sm">
                Profit as percentage of revenue
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="revenue" className="w-full mb-8">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>
                  Revenue trends over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                {monthlyRevenueData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyRevenueData}
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
                            "Revenue"
                          ]}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#F5931D" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No revenue data available for the selected filters
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Revenue</CardTitle>
                  <CardDescription>
                    Highest performing products
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {productPerformanceData.length > 0 ? (
                    <div className="space-y-4">
                      {productPerformanceData.slice(0, 5).map((product, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-vendora-100 text-vendora-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {product.quantity} units sold
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(product.revenue)}</div>
                            <div className="text-sm text-sage-600">
                              {formatCurrency(product.profit)} profit
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No product data available for the selected filters
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Product Sales Distribution</CardTitle>
                  <CardDescription>
                    Revenue percentage by product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {productPerformanceData.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productPerformanceData.slice(0, 5)}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="revenue"
                            nameKey="name"
                            label={(entry) => entry.name}
                          >
                            {productPerformanceData.slice(0, 5).map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value) => [
                              formatCurrency(value as number),
                              "Revenue"
                            ]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      No product data available for the selected filters
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="locations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>
                  Revenue by location
                </CardDescription>
              </CardHeader>
              <CardContent>
                {locationPerformanceData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={locationPerformanceData}
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
                            "Revenue"
                          ]}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#B0C0A1" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No location data available for the selected filters
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Reports;
