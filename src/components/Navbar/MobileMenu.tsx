
import { LanguageToggle } from "./LanguageToggle";
import { DataActions } from "./DataActions";
import { NavbarItems } from "./NavbarItems";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { language, setLanguage, translations } = useLanguage();
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden px-4 py-2 pb-4 bg-background border-b border-border">
      <div className="space-y-1">
        <NavbarItems onMobileItemClick={onClose} />
        <div className="flex space-x-2 pt-2">
          <DataActions />
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-1 flex-1"
          >
            <Globe className="h-4 w-4" />
            {language === 'en' ? 'Español' : 'English'}
          </Button>
        </div>
      </div>
    </div>
  );
};
