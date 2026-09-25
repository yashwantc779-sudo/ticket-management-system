import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { createTicket } from "../api/ticketApi";

const initialForm = {
  title: "",
  description: "",
  client: "",
  department: "",
  priority: "Medium",
};

function CreateTicketModal({
  open,
  onClose,
  metadata,
  onCreated,
}) {
  const [form, setForm] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const clients = metadata?.clients || [];

  const departments = metadata?.departments || [];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");

    if (!form.title.trim()) {
      setError("Ticket title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Ticket description is required.");
      return;
    }

    setLoading(true);

    try {
      const ticket = await createTicket({
        title: form.title,
        description: form.description,
        client: form.client || null,
        department: form.department || null,
        priority: form.priority,
      });

      setForm(initialForm);

      onCreated(ticket);

      onClose();
    } catch (err) {
      setError(
        err.message || "Failed to create ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    setError("");

    setForm(initialForm);

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          Create New Ticket
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <TextField
              name="title"
              label="Ticket Title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={handleChange}
              fullWidth
              required
              multiline
              rows={4}
            />

            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>

              <Select
                name="client"
                value={form.client}
                label="Client"
                onChange={handleChange}
              >
                <MenuItem value="">
                  Select Client
                </MenuItem>

                {clients.map((client) => (
                  <MenuItem
                    key={client.id ?? client}
                    value={client.id ?? client}
                  >
                    {client.name ?? client}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>
                Department
              </InputLabel>

              <Select
                name="department"
                value={form.department}
                label="Department"
                onChange={handleChange}
              >
                <MenuItem value="">
                  Select Department
                </MenuItem>

                {departments.map(
                  (department) => (
                    <MenuItem
                      key={
                        department.id ??
                        department
                      }
                      value={
                        department.id ??
                        department
                      }
                    >
                      {department.name ??
                        department}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>
                Priority
              </InputLabel>

              <Select
                name="priority"
                value={form.priority}
                label="Priority"
                onChange={handleChange}
              >
                <MenuItem value="Low">
                  Low
                </MenuItem>

                <MenuItem value="Medium">
                  Medium
                </MenuItem>

                <MenuItem value="High">
                  High
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Create Ticket"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default CreateTicketModal;