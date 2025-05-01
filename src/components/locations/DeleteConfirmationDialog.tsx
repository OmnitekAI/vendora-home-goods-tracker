
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteConfirmationDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationDialog = ({ onConfirm, onCancel }: DeleteConfirmationDialogProps) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this location? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
        >
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteConfirmationDialog;
