
import { toast } from "@/components/ui/sonner";
import { DataStore, Location, Product, Delivery, Order, Sale } from "@/types";

const STORAGE_KEY = "vendora-data";

// Initial empty data structure
const initialData: DataStore = {
  locations: [],
  products: [],
  deliveries: [],
  orders: [],
  sales: []
};

// Generate a simple ID (for demonstration purposes)
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Load data from localStorage
export const loadData = (): DataStore => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return initialData;
  } catch (error) {
    console.error("Failed to load data:", error);
    toast.error("Failed to load data");
    return initialData;
  }
};

// Save data to localStorage
export const saveData = (data: DataStore): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save data:", error);
    toast.error("Failed to save data");
  }
};

// Helper functions for each data type
export const getLocations = (): Location[] => {
  const data = loadData();
  return data.locations;
};

export const saveLocation = (location: Location): void => {
  const data = loadData();
  const index = data.locations.findIndex(l => l.id === location.id);
  
  if (index >= 0) {
    data.locations[index] = location;
  } else {
    data.locations.push(location);
  }
  
  saveData(data);
  toast.success(`Location ${index >= 0 ? 'updated' : 'added'}`);
};

export const deleteLocation = (id: string): void => {
  const data = loadData();
  data.locations = data.locations.filter(l => l.id !== id);
  saveData(data);
  toast.success("Location deleted");
};

export const getProducts = (): Product[] => {
  const data = loadData();
  return data.products;
};

export const saveProduct = (product: Product): void => {
  const data = loadData();
  const index = data.products.findIndex(p => p.id === product.id);
  
  if (index >= 0) {
    data.products[index] = product;
  } else {
    data.products.push(product);
  }
  
  saveData(data);
  toast.success(`Product ${index >= 0 ? 'updated' : 'added'}`);
};

export const deleteProduct = (id: string): void => {
  const data = loadData();
  data.products = data.products.filter(p => p.id !== id);
  saveData(data);
  toast.success("Product deleted");
};

export const getDeliveries = (): Delivery[] => {
  const data = loadData();
  return data.deliveries;
};

export const saveDelivery = (delivery: Delivery): void => {
  const data = loadData();
  const index = data.deliveries.findIndex(d => d.id === delivery.id);
  
  if (index >= 0) {
    data.deliveries[index] = delivery;
  } else {
    data.deliveries.push(delivery);
  }
  
  saveData(data);
  toast.success(`Delivery ${index >= 0 ? 'updated' : 'added'}`);
};

export const deleteDelivery = (id: string): void => {
  const data = loadData();
  data.deliveries = data.deliveries.filter(d => d.id !== id);
  saveData(data);
  toast.success("Delivery deleted");
};

export const getOrders = (): Order[] => {
  const data = loadData();
  return data.orders;
};

export const saveOrder = (order: Order): void => {
  const data = loadData();
  const index = data.orders.findIndex(o => o.id === order.id);
  
  if (index >= 0) {
    data.orders[index] = order;
  } else {
    data.orders.push(order);
  }
  
  saveData(data);
  toast.success(`Order ${index >= 0 ? 'updated' : 'added'}`);
};

export const deleteOrder = (id: string): void => {
  const data = loadData();
  data.orders = data.orders.filter(o => o.id !== id);
  saveData(data);
  toast.success("Order deleted");
};

export const getSales = (): Sale[] => {
  const data = loadData();
  return data.sales;
};

export const saveSale = (sale: Sale): void => {
  const data = loadData();
  const index = data.sales.findIndex(s => s.id === sale.id);
  
  if (index >= 0) {
    data.sales[index] = sale;
  } else {
    data.sales.push(sale);
  }
  
  saveData(data);
  toast.success(`Sale ${index >= 0 ? 'updated' : 'added'}`);
};

export const deleteSale = (id: string): void => {
  const data = loadData();
  data.sales = data.sales.filter(s => s.id !== id);
  saveData(data);
  toast.success("Sale deleted");
};

// Export/Import functions
export const exportData = (): string => {
  const data = loadData();
  const exportStr = JSON.stringify(data);
  return exportStr;
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString) as DataStore;
    
    // Basic validation
    if (!data.locations || !data.products || !data.deliveries || 
        !data.orders || !data.sales) {
      throw new Error("Invalid data format");
    }
    
    saveData(data);
    toast.success("Data imported successfully");
    return true;
  } catch (error) {
    console.error("Failed to import data:", error);
    toast.error("Failed to import data: Invalid format");
    return false;
  }
};

// Function to get location name by ID
export const getLocationName = (id: string): string => {
  const locations = getLocations();
  const location = locations.find(l => l.id === id);
  return location ? location.name : "Unknown Location";
};

// Function to get product name by ID
export const getProductName = (id: string): string => {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  return product ? product.name : "Unknown Product";
};

// Function to get product details by ID
export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};
