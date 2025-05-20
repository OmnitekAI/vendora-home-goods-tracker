
import { Order, Location } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

interface OrderDetailsFormProps {
  order: Order;
  locations: Location[];
  onChange: (updatedOrder: Order) => void;
}

const OrderDetailsForm = ({ order, locations, onChange }: OrderDetailsFormProps) => {
  const { translations } = useLanguage();
  const t = translations.salesOrders;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      ...order,
      [name]: value,
    });
  };

  const handleOrderStatusChange = (status: 'pending' | 'delivered' | 'cancelled') => {
    onChange({ ...order, status });
  };
  
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="orderLocationId">{t.location}</Label>
          <Select
            value={order.locationId}
            onValueChange={(value) => onChange({ ...order, locationId: value })}
          >
            <SelectTrigger id="orderLocationId">
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
          <Label htmlFor="orderDate">{t.date}</Label>
          <Input
            id="orderDate"
            name="date"
            type="date"
            value={order.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">{t.status}</Label>
        <Select
          value={order.status}
          onValueChange={(value) =>
            handleOrderStatusChange(value as 'pending' | 'delivered' | 'cancelled')
          }
        >
          <SelectTrigger id="status">
            <SelectValue placeholder={t.selectStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">{t.pending}</SelectItem>
            <SelectItem value="delivered">{t.delivered}</SelectItem>
            <SelectItem value="cancelled">{t.cancelled}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="orderNotes">{t.notes}</Label>
        <Textarea
          id="orderNotes"
          name="notes"
          value={order.notes || ""}
          onChange={handleChange}
          placeholder={t.specialInstructions}
          rows={2}
        />
      </div>
    </>
  );
};

export default OrderDetailsForm;
