
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Package, Truck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocations, getProducts, getDeliveries, getOrders, getSales } from "@/utils/dataStorage";
import DashboardCharts from "./dashboard/DashboardCharts";
import { useLanguage } from "@/context/LanguageContext";

const Dashboard = () => {
  const { language, translations } = useLanguage();
  const [stats, setStats] = useState({
    locationCount: 0,
    productCount: 0,
    deliveryCount: 0,
    orderCount: 0,
    saleCount: 0,
    pendingOrders: 0,
    unpaidDeliveries: 0,
    topProducts: [] as { id: string, name: string, quantitySold: number }[],
  });

  // Chart data
  const [chartData, setChartData] = useState({
    monthlyRevenueData: [] as Array<{ month: string; revenue: number }>,
    productDistributionData: [] as Array<{ 
      name: string; 
      revenue: number; 
      profit: number; 
      quantity: number 
    }>,
    locationPerformanceData: [] as Array<{ 
      name: string; 
      revenue: number; 
      count: number 
    }>,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'es-ES', {
      style: 'currency',
      currency: language === 'en' ? 'USD' : 'EUR',
      maximumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    // Load statistics
    const locations = getLocations();
    const products = getProducts();
    const deliveries = getDeliveries();
    const orders = getOrders();
    const sales = getSales();

    const pendingOrders = orders.filter(order => order.status === "pending").length;
    const unpaidDeliveries = deliveries.filter(delivery => !delivery.isPaid).length;

    // Calculate top products
    const productSales: Record<string, number> = {};
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = 0;
        }
        productSales[item.productId] += item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([id, quantitySold]) => {
        const product = products.find(p => p.id === id);
        return {
          id,
          name: product ? product.name : "Unknown Product",
          quantitySold
        };
      })
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);

    setStats({
      locationCount: locations.length,
      productCount: products.length,
      deliveryCount: deliveries.length,
      orderCount: orders.length,
      saleCount: sales.length,
      pendingOrders,
      unpaidDeliveries,
      topProducts,
    });

    // Prepare chart data
    // Monthly Revenue Data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    
    const monthlyRevenue: Record<string, number> = {};
    const months = [];
    
    for (let i = 0; i < 6; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.unshift(monthKey);
      monthlyRevenue[monthKey] = 0;
    }
    
    sales.forEach(sale => {
      const saleDate = new Date(sale.date);
      const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyRevenue[monthKey] !== undefined) {
        let saleTotal = 0;
        sale.items.forEach(item => {
          // Fix: Change item.price to item.unitPrice
          saleTotal += item.unitPrice * item.quantity;
        });
        monthlyRevenue[monthKey] += saleTotal;
      }
    });
    
    const monthlyRevenueData = months.map(month => {
      const date = new Date(month + '-01');
      return {
        month: date.toLocaleString(language === 'en' ? 'en-US' : 'es-ES', { month: 'short' }),
        revenue: monthlyRevenue[month] || 0
      };
    });

    // Product Distribution Data
    const productData: Record<string, { name: string; revenue: number; profit: number; quantity: number }> = {};
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          if (!productData[product.id]) {
            productData[product.id] = {
              name: product.name,
              revenue: 0,
              profit: 0,
              quantity: 0
            };
          }
          
          // Fix: Change item.price to item.unitPrice
          const revenue = item.unitPrice * item.quantity;
          const cost = product.costPrice ? product.costPrice * item.quantity : 0;
          const profit = revenue - cost;
          
          productData[product.id].revenue += revenue;
          productData[product.id].profit += profit;
          productData[product.id].quantity += item.quantity;
        }
      });
    });
    
    const productDistributionData = Object.values(productData)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Location Performance Data
    const locationData: Record<string, { name: string; revenue: number; count: number }> = {};
    
    sales.forEach(sale => {
      if (sale.locationId) {
        const location = locations.find(l => l.id === sale.locationId);
        if (location) {
          if (!locationData[location.id]) {
            locationData[location.id] = {
              name: location.name,
              revenue: 0,
              count: 0
            };
          }
          
          let saleTotal = 0;
          sale.items.forEach(item => {
            // Fix: Change item.price to item.unitPrice
            saleTotal += item.unitPrice * item.quantity;
          });
          
          locationData[location.id].revenue += saleTotal;
          locationData[location.id].count += 1;
        }
      }
    });
    
    const locationPerformanceData = Object.values(locationData)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setChartData({
      monthlyRevenueData,
      productDistributionData,
      locationPerformanceData
    });
  }, [language]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>{translations.navbar.locations}</span>
              <Store className="h-5 w-5 text-vendora-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.locationCount}</div>
            <Link to="/locations">
              <Button variant="link" className="p-0 h-auto text-vendora-600">
                {language === 'en' ? 'Manage locations' : 'Gestionar ubicaciones'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>{translations.navbar.products}</span>
              <Package className="h-5 w-5 text-vendora-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.productCount}</div>
            <Link to="/products">
              <Button variant="link" className="p-0 h-auto text-vendora-600">
                {language === 'en' ? 'Manage products' : 'Gestionar productos'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>{translations.navbar.deliveries}</span>
              <Truck className="h-5 w-5 text-vendora-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.deliveryCount}</div>
            <p className="text-sm text-muted-foreground">
              {stats.unpaidDeliveries > 0 
                ? language === 'en' 
                  ? `${stats.unpaidDeliveries} unpaid` 
                  : `${stats.unpaidDeliveries} sin pagar`
                : language === 'en' 
                  ? "All paid" 
                  : "Todo pagado"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>{translations.navbar.salesOrders}</span>
              <ShoppingCart className="h-5 w-5 text-vendora-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.orderCount}</div>
            <p className="text-sm text-muted-foreground">
              {stats.pendingOrders > 0 
                ? language === 'en' 
                  ? `${stats.pendingOrders} pending` 
                  : `${stats.pendingOrders} pendientes`
                : language === 'en' 
                  ? "No pending orders" 
                  : "Sin pedidos pendientes"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Visualization Dashboard */}
      <DashboardCharts 
        monthlyRevenueData={chartData.monthlyRevenueData}
        productDistributionData={chartData.productDistributionData}
        locationPerformanceData={chartData.locationPerformanceData}
        formatCurrency={formatCurrency}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{translations.dashboard.topSellingProducts}</CardTitle>
            <CardDescription>
              {translations.dashboard.topSellingProductsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.topProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-vendora-100 text-vendora-700 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <span>{product.name}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {product.quantitySold} {translations.dashboard.sold}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {translations.dashboard.noSalesRecorded}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-gradient text-white">
          <CardHeader>
            <CardTitle>{translations.dashboard.quickAccess}</CardTitle>
            <CardDescription className="text-white/90">
              {translations.dashboard.quickAccessDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Link to="/locations/new">
                <Button variant="secondary" className="w-full justify-start">
                  <Store className="mr-2 h-4 w-4" />
                  {translations.dashboard.addNewLocation}
                </Button>
              </Link>
            </div>
            <div>
              <Link to="/products/new">
                <Button variant="secondary" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  {translations.dashboard.addNewProduct}
                </Button>
              </Link>
            </div>
            <div>
              <Link to="/deliveries/new">
                <Button variant="secondary" className="w-full justify-start">
                  <Truck className="mr-2 h-4 w-4" />
                  {translations.dashboard.recordDelivery}
                </Button>
              </Link>
            </div>
            <div>
              <Link to="/sales-orders/new-sale">
                <Button variant="secondary" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {translations.dashboard.recordSale}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
