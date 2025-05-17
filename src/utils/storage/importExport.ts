
import { DataStore } from "@/types";
import { toast } from "@/components/ui/sonner";
import { loadData, saveData } from "./core";
import { useLanguage } from "@/context/LanguageContext";

// Export/Import functions
export const exportData = (): string => {
  const data = loadData();
  const exportStr = JSON.stringify(data);
  return exportStr;
};

export const importData = (jsonString: string): boolean => {
  try {
    const data = JSON.parse(jsonString) as DataStore;
    
    // Basic validation
    if (!data.locations || !data.products || !data.deliveries || 
        !data.orders || !data.sales) {
      throw new Error("Invalid data format");
    }
    
    saveData(data);
    
    // Get language for toast messages
    const language = localStorage.getItem('language') || 'en';
    
    toast.success(language === 'es' ? "Datos importados exitosamente" : "Data imported successfully");
    return true;
  } catch (error) {
    console.error("Failed to import data:", error);
    
    // Get language for toast messages
    const language = localStorage.getItem('language') || 'en';
    
    toast.error(language === 'es' ? "Error al importar datos: formato inválido" : "Failed to import data: Invalid format");
    return false;
  }
};
