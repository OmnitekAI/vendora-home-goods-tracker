
import { Sale } from "@/types";
import { toast } from "@/components/ui/sonner";
import { loadData, saveData } from "./core";

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
  
  const message = index >= 0 ? 
    { en: "Sale updated", es: "Venta actualizada" } : 
    { en: "Sale added", es: "Venta añadida" };
  
  toast.success(document.documentElement.lang === 'es' ? message.es : message.en);
};

export const deleteSale = (id: string): void => {
  const data = loadData();
  data.sales = data.sales.filter(s => s.id !== id);
  saveData(data);
  
  const message = { en: "Sale deleted", es: "Venta eliminada" };
  toast.success(document.documentElement.lang === 'es' ? message.es : message.en);
};
