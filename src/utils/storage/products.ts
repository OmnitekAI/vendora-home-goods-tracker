
import { Product } from "@/types";
import { toast } from "@/components/ui/sonner";
import { loadData, saveData } from "./core";

// Get all products from storage
export const getProducts = (): Product[] => {
  const data = loadData();
  return data.products;
};

// Get a product by ID
export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};

// Get product name by ID
export const getProductName = (id: string): string => {
  const product = getProductById(id);
  return product ? product.name : "Unknown Product";
};

// Save or update a product
export const saveProduct = (product: Product): void => {
  const data = loadData();
  const index = data.products.findIndex(p => p.id === product.id);
  const isNew = index < 0;
  
  // Update or add the product
  if (isNew) {
    data.products.push(product);
  } else {
    data.products[index] = product;
  }
  
  saveData(data);
  
  // Show success message in current language
  const language = document.documentElement.lang || 'en';
  const message = isNew 
    ? (language === 'es' ? "Producto añadido" : "Product added")
    : (language === 'es' ? "Producto actualizado" : "Product updated");
  
  toast.success(message);
};

// Delete a product
export const deleteProduct = (id: string): void => {
  const data = loadData();
  data.products = data.products.filter(p => p.id !== id);
  saveData(data);
  
  // Show success message in current language
  const language = document.documentElement.lang || 'en';
  const message = language === 'es' ? "Producto eliminado" : "Product deleted";
  
  toast.success(message);
};

// Get unique product categories
export const getProductCategories = (): string[] => {
  const products = getProducts();
  return Array.from(new Set(products.map(p => p.category)))
    .filter(category => category)
    .sort();
};
