
import { Product } from "@/types";
import { toast } from "@/components/ui/sonner";
import { loadData, saveData } from "./core";

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

export const getProductName = (id: string): string => {
  const products = getProducts();
  const product = products.find(p => p.id === id);
  return product ? product.name : "Unknown Product";
};

export const getProductById = (id: string): Product | undefined => {
  const products = getProducts();
  return products.find(p => p.id === id);
};
