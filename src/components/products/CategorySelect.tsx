
import React from "react";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategorySelectProps {
  currentProduct: Product;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
  categories: string[];
  showNewCategoryInput: boolean;
  setShowNewCategoryInput: React.Dispatch<React.SetStateAction<boolean>>;
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
}

export const CategorySelect = ({
  currentProduct,
  setCurrentProduct,
  categories,
  showNewCategoryInput,
  setShowNewCategoryInput,
  newCategory,
  setNewCategory,
}: CategorySelectProps) => {
  const { translations } = useLanguage();

  const handleCategoryChange = (value: string) => {
    if (value === "new") {
      // Show the new category input
      setShowNewCategoryInput(true);
      setNewCategory("");
    } else {
      // Hide the new category input and set the selected category
      setShowNewCategoryInput(false);
      setCurrentProduct((prev) => ({
        ...prev,
        category: value,
      }));
    }
  };

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNewCategory(value);
    // Update the product category with the new category value
    setCurrentProduct((prev) => ({
      ...prev,
      category: value,
    }));
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="category">{translations.products.category}</Label>
      <div className="flex flex-col gap-2">
        <Select
          value={showNewCategoryInput ? "new" : (currentProduct.category || "")}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder={translations.products.selectCategory} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
            <SelectItem value="new">
              {translations.products.addNewCategory}
            </SelectItem>
          </SelectContent>
        </Select>
        
        {showNewCategoryInput && (
          <Input
            name="newCategory"
            value={newCategory}
            onChange={handleNewCategoryChange}
            placeholder={translations.products.addNewCategory}
            autoFocus
          />
        )}
      </div>
    </div>
  );
};
