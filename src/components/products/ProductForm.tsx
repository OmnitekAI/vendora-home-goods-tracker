
import React from "react";
import { Product } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CategorySelect } from "./CategorySelect";

interface ProductFormProps {
  currentProduct: Product;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product>>;
  categories: string[];
  showNewCategoryInput: boolean;
  setShowNewCategoryInput: React.Dispatch<React.SetStateAction<boolean>>;
  newCategory: string;
  setNewCategory: React.Dispatch<React.SetStateAction<string>>;
}

export const ProductForm = ({
  currentProduct,
  setCurrentProduct,
  categories,
  showNewCategoryInput,
  setShowNewCategoryInput,
  newCategory,
  setNewCategory,
}: ProductFormProps) => {
  const { translations } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: name.includes("Price") ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">{translations.products.productName}</Label>
        <Input
          id="name"
          name="name"
          value={currentProduct.name}
          onChange={handleChange}
          placeholder={translations.products.productName}
          required
        />
      </div>
      
      <CategorySelect 
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        categories={categories}
        showNewCategoryInput={showNewCategoryInput}
        setShowNewCategoryInput={setShowNewCategoryInput}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
      />
      
      <PriceField 
        id="costPrice"
        name="costPrice"
        label={translations.products.costPrice}
        value={currentProduct.costPrice}
        onChange={handleChange}
      />
      
      <PriceField 
        id="wholesalePrice"
        name="wholesalePrice"
        label={translations.products.wholesalePrice}
        value={currentProduct.wholesalePrice}
        onChange={handleChange}
      />
      
      <PriceField 
        id="suggestedRetailPrice"
        name="suggestedRetailPrice"
        label={translations.products.suggestedRetailPrice}
        value={currentProduct.suggestedRetailPrice}
        onChange={handleChange}
      />
      
      <div className="grid gap-2">
        <Label htmlFor="description">{translations.products.description}</Label>
        <Textarea
          id="description"
          name="description"
          value={currentProduct.description || ""}
          onChange={handleChange}
          placeholder={translations.products.description}
          rows={3}
        />
      </div>
    </div>
  );
};

interface PriceFieldProps {
  id: string;
  name: string;
  label: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PriceField = ({ id, name, label, value, onChange }: PriceFieldProps) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={onChange}
        placeholder="0.00"
      />
    </div>
  );
};
