
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getLocations, getProducts, getDeliveries, getOrders, getSales } from "@/utils/storage";

export interface DashboardStats {
  locationCount: number;
  productCount: number;
  deliveryCount: number;
  orderCount: number;
  saleCount: number;
  pendingOrders: number;
  unpaidDeliveries: number;
  topProducts: Array<{ id: string, name: string, quantitySold: number }>;
}

export interface ChartData {
  monthlyRevenueData: Array<{ month: string; revenue: number }>;
  productDistributionData: Array<{ 
    name: string; 
    revenue: number; 
    profit: number; 
    quantity: number 
  }>;
  locationPerformanceData: Array<{ 
    name: string; 
    revenue: number; 
    count: number 
  }>;
}

export const useDashboardData = () => {
  const { language } = useLanguage();
  const [stats, setStats] = useState<DashboardStats>({
    locationCount: 0,
    productCount: 0,
    deliveryCount: 0,
    orderCount: 0,
    saleCount: 0,
    pendingOrders: 0,
    unpaidDeliveries: 0,
    topProducts: [],
  });

  const [chartData, setChartData] = useState<ChartData>({
    monthlyRevenueData: [],
    productDistributionData: [],
    locationPerformanceData: [],
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
          saleTotal += item.pricePerUnit * item.quantity;
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
          
          const revenue = item.pricePerUnit * item.quantity;
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
            saleTotal += item.pricePerUnit * item.quantity;
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

  return { stats, chartData, formatCurrency };
};
