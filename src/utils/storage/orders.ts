
import { Order } from "@/types";
import { toast } from "@/components/ui/sonner";
import { loadData, saveData } from "./core";

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
  
  const language = localStorage.getItem('language') || 'en';
  const message = index >= 0 ? 
    { en: "Order updated", es: "Orden actualizada" } : 
    { en: "Order added", es: "Orden añadida" };
  
  toast.success(language === 'es' ? message.es : message.en);
};

export const deleteOrder = (id: string): void => {
  const data = loadData();
  data.orders = data.orders.filter(o => o.id !== id);
  saveData(data);
  
  const language = localStorage.getItem('language') || 'en';
  const message = { en: "Order deleted", es: "Orden eliminada" };
  toast.success(language === 'es' ? message.es : message.en);
};
