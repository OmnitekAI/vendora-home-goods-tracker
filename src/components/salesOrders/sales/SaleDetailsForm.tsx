
import { Sale } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { Location } from "@/types";

interface SaleDetailsFormProps {
  sale: Sale;
  locations: Location[];
  onChange: (updatedSale: Sale) => void;
}

const SaleDetailsForm = ({ sale, locations, onChange }: SaleDetailsFormProps) => {
  const { translations } = useLanguage();
  const t = translations.salesOrders;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...sale,
      [name]: value,
    });
  };
  
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="locationId">{t.location}</Label>
          <Select
            value={sale.locationId}
            onValueChange={(value) => onChange({ ...sale, locationId: value })}
          >
            <SelectTrigger id="locationId">
              <SelectValue placeholder={t.selectLocation} />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="saleDate">{t.date}</Label>
          <Input
            id="saleDate"
            name="date"
            type="date"
            value={sale.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="saleNotes">{t.notes}</Label>
        <Textarea
          id="saleNotes"
          name="notes"
          value={sale.notes || ""}
          onChange={handleChange}
          placeholder={t.additionalInfo}
          rows={2}
        />
      </div>
    </>
  );
};

export default SaleDetailsForm;
