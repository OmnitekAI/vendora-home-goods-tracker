
import { toast } from "@/components/ui/sonner";
import { DataStore } from "@/types";

const STORAGE_KEY = "vendora-data";

// Initial empty data structure
export const initialData: DataStore = {
  locations: [],
  products: [],
  deliveries: [],
  orders: [],
  sales: []
};

// Generate a simple ID (for demonstration purposes)
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Load data from localStorage
export const loadData = (): DataStore => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return initialData;
  } catch (error) {
    console.error("Failed to load data:", error);
    toast.error("Failed to load data");
    return initialData;
  }
};

// Save data to localStorage
export const saveData = (data: DataStore): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save data:", error);
    toast.error("Failed to save data");
  }
};
