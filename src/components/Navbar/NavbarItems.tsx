
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Store, Package, Truck, ShoppingCart, FileText } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const NavbarItems = ({ onMobileItemClick }: { onMobileItemClick?: () => void }) => {
  const location = useLocation();
  const { translations } = useLanguage();

  const navItems = [
    { path: "/", label: translations.navbar.dashboard, icon: <Store className="h-5 w-5" /> },
    { path: "/locations", label: translations.navbar.locations, icon: <Store className="h-5 w-5" /> },
    { path: "/products", label: translations.navbar.products, icon: <Package className="h-5 w-5" /> },
    { path: "/deliveries", label: translations.navbar.deliveries, icon: <Truck className="h-5 w-5" /> },
    { path: "/sales-orders", label: translations.navbar.salesOrders, icon: <ShoppingCart className="h-5 w-5" /> },
    { path: "/reports", label: translations.navbar.reports, icon: <FileText className="h-5 w-5" /> },
  ];

  return (
    <>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={cn(
            "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
            location.pathname === item.path
              ? "bg-vendora-100 text-vendora-800"
              : "text-foreground hover:bg-vendora-50"
          )}
          onClick={onMobileItemClick}
        >
          <span className="mr-2">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </>
  );
};
