
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
  toast.success(`Sale ${index >= 0 ? 'updated' : 'added'}`);
};

export const deleteSale = (id: string): void => {
  const data = loadData();
  data.sales = data.sales.filter(s => s.id !== id);
  saveData(data);
  toast.success("Sale deleted");
};
