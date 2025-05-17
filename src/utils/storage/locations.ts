
import { Location } from "@/types";
import { toast } from "@/components/ui/sonner";
import { loadData, saveData } from "./core";

export const getLocations = (): Location[] => {
  const data = loadData();
  return data.locations;
};

export const saveLocation = (location: Location): void => {
  const data = loadData();
  const index = data.locations.findIndex(l => l.id === location.id);
  
  if (index >= 0) {
    data.locations[index] = location;
  } else {
    data.locations.push(location);
  }
  
  saveData(data);
  
  const message = index >= 0 ? 
    { en: "Location updated", es: "Ubicación actualizada" } : 
    { en: "Location added", es: "Ubicación añadida" };
  
  toast.success(document.documentElement.lang === 'es' ? message.es : message.en);
};

export const deleteLocation = (id: string): void => {
  const data = loadData();
  data.locations = data.locations.filter(l => l.id !== id);
  saveData(data);
  
  const message = { en: "Location deleted", es: "Ubicación eliminada" };
  toast.success(document.documentElement.lang === 'es' ? message.es : message.en);
};

export const getLocationName = (id: string): string => {
  const locations = getLocations();
  const location = locations.find(l => l.id === id);
  return location ? location.name : "Unknown Location";
};
