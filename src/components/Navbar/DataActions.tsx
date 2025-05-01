
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { exportData, importData } from "@/utils/dataStorage";
import { useLanguage } from "@/context/LanguageContext";

export const DataActions = () => {
  const { translations } = useLanguage();

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
      toast.success("Data exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export data");
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
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        {translations.common.export}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleImport}
        className="flex items-center gap-1"
      >
        <Upload className="h-4 w-4" />
        {translations.common.import}
      </Button>
    </>
  );
};
