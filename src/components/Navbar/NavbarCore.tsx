
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { NavbarBrand } from "./NavbarBrand";
import { NavbarItems } from "./NavbarItems";
import { DataActions } from "./DataActions";
import { LanguageToggle } from "./LanguageToggle";
import { MobileMenu } from "./MobileMenu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border">
      <div className="vendora-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo and title */}
          <NavbarBrand />

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavbarItems />
          </div>

          {/* Export/Import/Language buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <DataActions />
            <LanguageToggle />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
};

export default Navbar;
