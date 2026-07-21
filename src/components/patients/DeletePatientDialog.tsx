import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import type { Patient } from "../../types/patient";

interface Props {
  open: boolean;
  patient: Patient | null;
  onClose: () => void;
  onConfirmDelete: (patientId: number) => Promise<void>;
  isLoading: boolean;
}

export default function DeletePatientDialog({
  open,
  patient,
  onClose,
  onConfirmDelete,
  isLoading,
}: Props) {
  if (!patient) return null;

  const handleDelete = async () => {
    await onConfirmDelete(patient.id);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          elevation: 5,
          sx: { borderRadius: 4, p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, color: "#EF4444" }}>
        <WarningAmberRoundedIcon sx={{ fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Delete Patient Record
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: "#334155", mb: 2 }}>
          Are you sure you want to permanently delete patient <strong>{patient.patient_code}</strong> (ID: {patient.id})?
        </Typography>

        <Alert severity="warning" sx={{ borderRadius: 3, fontSize: "0.8rem" }}>
          This action will remove the patient entry and linked assessment logs.
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: "#64748B", fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={isLoading}
          sx={{ borderRadius: 3, fontWeight: 700 }}
        >
          {isLoading ? "Deleting..." : "Delete Permanently"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
