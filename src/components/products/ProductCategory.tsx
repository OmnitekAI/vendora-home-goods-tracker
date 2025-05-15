
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

interface ProductCategoryProps {
  category: string;
  products: Product[];
  onEdit: (product: Product) => void;
  formatCurrency: (amount: number) => string;
  onProductsChange?: () => void;
}

export const ProductCategory = ({
  category,
  products,
  onEdit,
  formatCurrency,
  onProductsChange
}: ProductCategoryProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">{category}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEdit}
            formatCurrency={formatCurrency}
            onDelete={onProductsChange}
          />
        ))}
      </div>
    </div>
  );
};
