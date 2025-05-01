
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types";
import { getProducts, generateId } from "@/utils/dataStorage";
import { ProductDialog } from "@/components/products/ProductDialog";
import { ProductCategory } from "@/components/products/ProductCategory";
import { EmptyProducts } from "@/components/products/EmptyProducts";
import { useLanguage } from "@/context/LanguageContext";

const Products = () => {
  const { translations } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: "",
    name: "",
    category: "",
    costPrice: 0,
    wholesalePrice: 0,
    suggestedRetailPrice: 0,
    description: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (id === "new") {
      setCurrentProduct({
        id: generateId(),
        name: "",
        category: "",
        costPrice: 0,
        wholesalePrice: 0,
        suggestedRetailPrice: 0,
        description: "",
        imageUrl: "",
      });
      setIsDialogOpen(true);
    } else if (id) {
      const product = products.find((prod) => prod.id === id);
      if (product) {
        setCurrentProduct(product);
        setIsDialogOpen(true);
      } else {
        navigate("/products");
        toast.error(translations.products.productName + " " + translations.common.noData);
      }
    }
  }, [id, products, navigate, translations]);

  useEffect(() => {
    // Extract unique categories
    const uniqueCategories = Array.from(new Set(products.map((p) => p.category)))
      .filter(category => category)
      .sort();
    setCategories(uniqueCategories);
  }, [products]);

  const loadProducts = () => {
    const loadedProducts = getProducts();
    setProducts(loadedProducts);
  };

  const handleAddNew = () => {
    navigate("/products/new");
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    navigate("/products");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Group products by category
  const productsByCategory: Record<string, Product[]> = {};
  products.forEach((product) => {
    const category = product.category || translations.products.uncategorized;
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push(product);
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8 vendora-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-vendora-800">{translations.products.title}</h1>
          <Button onClick={handleAddNew} className="bg-vendora-600 hover:bg-vendora-700">
            <Plus className="mr-2 h-4 w-4" />
            {translations.products.addProduct}
          </Button>
        </div>

        {products.length === 0 ? (
          <EmptyProducts onAddNew={handleAddNew} />
        ) : (
          <div className="space-y-6">
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <ProductCategory 
                key={category}
                category={category}
                products={categoryProducts}
                onEdit={handleEdit}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>
        )}

        <ProductDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          product={currentProduct}
          categories={categories}
          isNew={id === "new"}
          onSave={loadProducts}
        />
      </main>
    </div>
  );
};

export default Products;
