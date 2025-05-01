
import { Delivery } from "@/types";
import { toast } from "@/components/ui/sonner";
import { loadData, saveData } from "./core";

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
  
  const message = index >= 0 ? 
    { en: "Delivery updated", es: "Entrega actualizada" } : 
    { en: "Delivery added", es: "Entrega añadida" };
  
  toast.success(document.documentElement.lang === 'es' ? message.es : message.en);
};

export const deleteDelivery = (id: string): void => {
  const data = loadData();
  data.deliveries = data.deliveries.filter(d => d.id !== id);
  saveData(data);
  
  const message = { en: "Delivery deleted", es: "Entrega eliminada" };
  toast.success(document.documentElement.lang === 'es' ? message.es : message.en);
};
