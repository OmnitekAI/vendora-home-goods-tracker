
import { useState } from "react";
import { Order } from "@/types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import OrderCard from "./OrderCard";
import EmptyOrders from "./EmptyOrders";

interface OrdersListProps {
  orders: Order[];
  onAddNew: () => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrdersList = ({ orders, onAddNew, onEdit, onDelete }: OrdersListProps) => {
  const { translations } = useLanguage();
  const t = translations.salesOrders;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={onAddNew} className="bg-vendora-600 hover:bg-vendora-700">
          <Plus className="mr-2 h-4 w-4" />
          {t.newOrder}
        </Button>
      </div>
      
      {orders.length === 0 ? (
        <EmptyOrders onAddNew={onAddNew} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
