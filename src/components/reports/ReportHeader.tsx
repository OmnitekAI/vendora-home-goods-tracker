
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Location } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface ReportHeaderProps {
  locations: Location[];
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  getMonths: () => string[];
  formatMonthYear: (dateString: string) => string;
  handleExportCSV: () => void;
}

export const ReportHeader = ({
  locations,
  selectedLocation,
  setSelectedLocation,
  selectedMonth,
  setSelectedMonth,
  getMonths,
  formatMonthYear,
  handleExportCSV
}: ReportHeaderProps) => {
  const { translations } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="md:w-1/3">
        <div className="text-sm font-medium mb-1">{translations.reports.location}</div>
        <Select
          value={selectedLocation}
          onValueChange={setSelectedLocation}
        >
          <SelectTrigger>
            <SelectValue placeholder={translations.reports.allLocations} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{translations.reports.allLocations}</SelectItem>
            {locations.map(location => (
              <SelectItem key={location.id} value={location.id}>
                {location.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:w-1/3">
        <div className="text-sm font-medium mb-1">{translations.reports.month}</div>
        <Select
          value={selectedMonth}
          onValueChange={setSelectedMonth}
        >
          <SelectTrigger>
            <SelectValue placeholder={translations.reports.allMonths} />
          </SelectTrigger>
          <SelectContent>
            {getMonths().map(month => (
              <SelectItem key={month} value={month}>
                {formatMonthYear(month)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="md:w-1/3 flex items-end">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
          onClick={handleExportCSV}
        >
          <Download className="w-4 h-4" />
          {translations.reports.exportReportCSV}
        </Button>
      </div>
    </div>
  );
};
