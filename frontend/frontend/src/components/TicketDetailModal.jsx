import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import {
  getTicket,
  getTicketHistory,
  updateTicketStatus,
} from "../api/ticketApi";

const statuses = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
];

function TicketDetailModal({
  open,
  ticket,
  role,
  onClose,
  onUpdated,
}) {
  const [details, setDetails] = useState(ticket);

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [newStatus, setNewStatus] =
    useState(ticket?.status || "Open");

  useEffect(() => {
    if (!open || !ticket?.id) {
      return;
    }

    setDetails(ticket);

    setNewStatus(ticket.status || "Open");

    setError("");

    const loadData = async () => {
      setLoading(true);
      setHistoryLoading(true);

      try {
        const ticketData = await getTicket(
          ticket.id
        );

        setDetails(ticketData);
      } catch (err) {
        setDetails(ticket);
      } finally {
        setLoading(false);
      }

      try {
        const historyData =
          await getTicketHistory(ticket.id);

        setHistory(
          Array.isArray(historyData)
            ? historyData
            : historyData.results || []
        );
      } catch (err) {
        setHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadData();
  }, [open, ticket]);

  const handleStatusUpdate = async () => {
    if (!details?.id || !newStatus) {
      return;
    }

    if (newStatus === details.status) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const updated =
        await updateTicketStatus(
          details.id,
          newStatus
        );

      setDetails(updated);

      onUpdated(updated);
    } catch (err) {
      setError(
        err.message ||
          "Failed to update ticket."
      );
    } finally {
      setLoading(false);
    }
  };

  const canChangeStatus =
    role === "FM" ||
    role === "POC" ||
    role === "Technician";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        Ticket #{details?.id}
      </DialogTitle>

      <DialogContent>
        {loading && !details ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 5,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2}>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
              >
                {details?.title || "-"}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                {details?.description || "-"}
              </Typography>
            </Box>

            <Divider />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Client
                </Typography>

                <Typography>
                  {details?.client_name ||
                    details?.client?.name ||
                    "-"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Department
                </Typography>

                <Typography>
                  {details?.department_name ||
                    details?.department?.name ||
                    "-"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  FM
                </Typography>

                <Typography>
                  {details?.fm_name ||
                    details?.fm?.name ||
                    "-"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Priority
                </Typography>

                <Chip
                  label={
                    details?.priority || "-"
                  }
                  size="small"
                />
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Status
                </Typography>

                <Chip
                  label={
                    details?.status || "-"
                  }
                  color="primary"
                  size="small"
                />
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Created
                </Typography>

                <Typography>
                  {details?.created_at
                    ? new Date(
                        details.created_at
                      ).toLocaleString()
                    : "-"}
                </Typography>
              </Box>
            </Box>

            {/* Status transition */}

            {canChangeStatus && (
              <>
                <Divider />

                <Typography
                  variant="h6"
                  fontWeight={600}
                >
                  Update Status
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    size="small"
                    sx={{ minWidth: 200 }}
                  >
                    <InputLabel>
                      Status
                    </InputLabel>

                    <Select
                      value={newStatus}
                      label="Status"
                      onChange={(event) =>
                        setNewStatus(
                          event.target.value
                        )
                      }
                    >
                      {statuses.map(
                        (status) => (
                          <MenuItem
                            key={status}
                            value={status}
                          >
                            {status}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>

                  <Button
                    variant="contained"
                    startIcon={
                      <CheckCircleIcon />
                    }
                    onClick={
                      handleStatusUpdate
                    }
                    disabled={
                      loading ||
                      newStatus ===
                        details?.status
                    }
                  >
                    Update
                  </Button>
                </Box>
              </>
            )}

            {/* History */}

            <Divider />

            <Typography
              variant="h6"
              fontWeight={600}
            >
              Ticket History
            </Typography>

            {historyLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "center",
                  py: 3,
                }}
              >
                <CircularProgress
                  size={28}
                />
              </Box>
            ) : history.length === 0 ? (
              <Typography
                color="text.secondary"
              >
                No history available.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {history.map(
                  (item, index) => (
                    <Box
                      key={
                        item.id || index
                      }
                      sx={{
                        p: 2,
                        backgroundColor:
                          "#f5f5f5",
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        fontWeight={600}
                      >
                        {item.action ||
                          item.status ||
                          "Update"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {item.description ||
                          item.message ||
                          ""}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {item.created_at
                          ? new Date(
                              item.created_at
                            ).toLocaleString()
                          : ""}
                      </Typography>
                    </Box>
                  )
                )}
              </Stack>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TicketDetailModal;