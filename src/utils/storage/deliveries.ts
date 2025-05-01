
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
  toast.success(`Delivery ${index >= 0 ? 'updated' : 'added'}`);
};

export const deleteDelivery = (id: string): void => {
  const data = loadData();
  data.deliveries = data.deliveries.filter(d => d.id !== id);
  saveData(data);
  toast.success("Delivery deleted");
};
