
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1"
    >
      <Globe className="h-4 w-4" />
      {language === 'en' ? 'ES' : 'EN'}
    </Button>
  );
};
