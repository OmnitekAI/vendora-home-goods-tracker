
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Plus, Edit, X, Tag } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/types";
import { getProducts, saveProduct, deleteProduct, generateId } from "@/utils/dataStorage";

const Products = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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
        toast.error("Product not found");
      }
    }
  }, [id, products, navigate]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: name.includes("Price") ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setCurrentProduct((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentProduct.name) {
      toast.error("Product name is required");
      return;
    }
    
    saveProduct(currentProduct);
    loadProducts();
    setIsDialogOpen(false);
    navigate("/products");
  };

  const handleDelete = () => {
    deleteProduct(currentProduct.id);
    loadProducts();
    setIsDeleteDialogOpen(false);
    setIsDialogOpen(false);
    navigate("/products");
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
    const category = product.category || "Uncategorized";
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
          <h1 className="text-3xl font-bold text-vendora-800">Products</h1>
          <Button onClick={handleAddNew} className="bg-vendora-600 hover:bg-vendora-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-lg font-medium">No products added yet</h2>
            <p className="mt-2 text-muted-foreground">
              Add your first product to start tracking inventory and sales.
            </p>
            <Button onClick={handleAddNew} className="mt-4 bg-vendora-600 hover:bg-vendora-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <div key={category}>
                <div className="flex items-center mb-2 gap-2">
                  <Tag className="h-4 w-4 text-vendora-600" />
                  <h2 className="text-xl font-semibold text-vendora-800">{category}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <CardHeader className="pb-2 bg-vendora-50">
                        <CardTitle className="flex justify-between items-center">
                          <div className="truncate">{product.name}</div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <div className="text-sm font-medium text-muted-foreground">Cost</div>
                            <div>{formatCurrency(product.costPrice)}</div>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-sm font-medium text-muted-foreground">Wholesale</div>
                            <div>{formatCurrency(product.wholesalePrice)}</div>
                          </div>
                          <div className="flex justify-between">
                            <div className="text-sm font-medium text-muted-foreground">Retail</div>
                            <div>{formatCurrency(product.suggestedRetailPrice)}</div>
                          </div>
                          {product.description && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="text-sm">{product.description}</div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Product Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {id === "new" ? "Add New Product" : "Edit Product"}
                </DialogTitle>
                <DialogDescription>
                  {id === "new"
                    ? "Enter the details for the new product."
                    : "Update the details for this product."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={currentProduct.name}
                    onChange={handleChange}
                    placeholder="Chocolate Chip Cookies"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <div className="flex gap-2">
                    <Select
                      value={currentProduct.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!categories.includes(currentProduct.category) && currentProduct.category && (
                      <Input
                        name="category"
                        value={currentProduct.category}
                        onChange={handleChange}
                        placeholder="Add new category"
                      />
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="costPrice">Cost Price</Label>
                  <Input
                    id="costPrice"
                    name="costPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentProduct.costPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="wholesalePrice">Wholesale Price</Label>
                  <Input
                    id="wholesalePrice"
                    name="wholesalePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentProduct.wholesalePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="suggestedRetailPrice">Suggested Retail Price</Label>
                  <Input
                    id="suggestedRetailPrice"
                    name="suggestedRetailPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={currentProduct.suggestedRetailPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={currentProduct.description || ""}
                    onChange={handleChange}
                    placeholder="Product description..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter className="flex items-center justify-between">
                <div>
                  {id !== "new" && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-vendora-600 hover:bg-vendora-700">
                    {id === "new" ? "Add Product" : "Update Product"}
                  </Button>
                </div>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Products;
