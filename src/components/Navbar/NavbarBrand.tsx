
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

export const NavbarBrand = () => {
  const { translations } = useLanguage();
  
  return (
    <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <span className="text-2xl font-bold text-vendora-600">{translations.app.title}</span>
      </Link>
    </div>
  );
};
