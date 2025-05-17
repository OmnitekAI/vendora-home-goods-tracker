
import { Button } from "@/components/ui/button";
import { Upload, Download, Menu, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { exportData, importData } from "@/utils/storage";
import { useLanguage } from "@/context/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const DataActions = () => {
  const { translations, language } = useLanguage();

  const handleExport = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vendora-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(language === 'es' ? "Datos exportados exitosamente" : "Data exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error(language === 'es' ? "Error al exportar datos" : "Failed to export data");
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;
      
      const file = target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (importData(content)) {
          // Reload the page to reflect the imported data
          window.location.reload();
        }
      };
      
      reader.readAsText(file);
    };
    
    input.click();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">
            {language === 'es' ? 'Menú' : 'Menu'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          {translations.common.export}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleImport} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          {translations.common.import}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          asChild
          className="flex items-center gap-2"
        >
          <a href="https://delacasa.app/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            {language === 'es' ? 'DeLaCasa' : 'DeLaCasa'}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
