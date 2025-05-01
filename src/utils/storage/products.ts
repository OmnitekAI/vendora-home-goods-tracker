
import { Product } from "@/types";
import { toast } from "@/components/ui/sonner";
import { loadData, saveData } from "./core";
import { useLanguage } from "@/context/LanguageContext";

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
  
  const message = index >= 0 ? 
    { en: "Product updated", es: "Producto actualizado" } : 
    { en: "Product added", es: "Producto añadido" };
  
  toast.success(document.documentElement.lang === 'es' ? message.es : message.en);
};

export const deleteProduct = (id: string): void => {
  const data = loadData();
  data.products = data.products.filter(p => p.id !== id);
  saveData(data);
  
  const message = { en: "Product deleted", es: "Producto eliminado" };
  toast.success(document.documentElement.lang === 'es' ? message.es : message.en);
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
