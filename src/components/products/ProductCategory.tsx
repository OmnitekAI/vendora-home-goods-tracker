
import { Product } from "@/types";
import { Tag } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCategoryProps {
  category: string;
  products: Product[];
  onEdit: (product: Product) => void;
  formatCurrency: (amount: number) => string;
}

export const ProductCategory = ({ category, products, onEdit, formatCurrency }: ProductCategoryProps) => {
  const { translations } = useLanguage();
  const displayCategory = category || translations.products.uncategorized;
  
  return (
    <div>
      <div className="flex items-center mb-2 gap-2">
        <Tag className="h-4 w-4 text-vendora-600" />
        <h2 className="text-xl font-semibold text-vendora-800">{displayCategory}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onEdit={onEdit} 
            formatCurrency={formatCurrency} 
          />
        ))}
      </div>
    </div>
  );
};
