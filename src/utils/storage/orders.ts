
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
  toast.success(`Order ${index >= 0 ? 'updated' : 'added'}`);
};

export const deleteOrder = (id: string): void => {
  const data = loadData();
  data.orders = data.orders.filter(o => o.id !== id);
  saveData(data);
  toast.success("Order deleted");
};
