
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Store, Package, Truck, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocations, getProducts, getDeliveries, getOrders, getSales } from "@/utils/dataStorage";

const Dashboard = () => {
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
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Locations</span>
              <Store className="h-5 w-5 text-vendora-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.locationCount}</div>
            <Link to="/locations">
              <Button variant="link" className="p-0 h-auto text-vendora-600">Manage locations</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Products</span>
              <Package className="h-5 w-5 text-vendora-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.productCount}</div>
            <Link to="/products">
              <Button variant="link" className="p-0 h-auto text-vendora-600">Manage products</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Deliveries</span>
              <Truck className="h-5 w-5 text-vendora-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.deliveryCount}</div>
            <p className="text-sm text-muted-foreground">
              {stats.unpaidDeliveries > 0 ? `${stats.unpaidDeliveries} unpaid` : "All paid"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Orders</span>
              <ShoppingCart className="h-5 w-5 text-vendora-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.orderCount}</div>
            <p className="text-sm text-muted-foreground">
              {stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : "No pending orders"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Products with the highest sales volume</CardDescription>
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
                      {product.quantitySold} sold
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No sales recorded yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-gradient text-white">
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription className="text-white/90">
              Common tasks to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Link to="/locations/new">
                <Button variant="secondary" className="w-full justify-start">
                  <Store className="mr-2 h-4 w-4" />
                  Add New Location
                </Button>
              </Link>
            </div>
            <div>
              <Link to="/products/new">
                <Button variant="secondary" className="w-full justify-start">
                  <Package className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </Link>
            </div>
            <div>
              <Link to="/deliveries/new">
                <Button variant="secondary" className="w-full justify-start">
                  <Truck className="mr-2 h-4 w-4" />
                  Record Delivery
                </Button>
              </Link>
            </div>
            <div>
              <Link to="/sales-orders/new-sale">
                <Button variant="secondary" className="w-full justify-start">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Record Sale
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
