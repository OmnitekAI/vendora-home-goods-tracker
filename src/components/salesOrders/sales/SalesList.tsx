
import { useState } from "react";
import { Sale } from "@/types";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import SaleCard from "./SaleCard";
import EmptySales from "./EmptySales";

interface SalesListProps {
  sales: Sale[];
  onAddNew: () => void;
  onEdit: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
}

const SalesList = ({ sales, onAddNew, onEdit, onDelete }: SalesListProps) => {
  const { translations } = useLanguage();
  const t = translations.salesOrders;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={onAddNew} className="bg-vendora-600 hover:bg-vendora-700">
          <Plus className="mr-2 h-4 w-4" />
          {t.recordSale}
        </Button>
      </div>
      
      {sales.length === 0 ? (
        <EmptySales onAddNew={onAddNew} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sales.map((sale) => (
            <SaleCard 
              key={sale.id} 
              sale={sale} 
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesList;
