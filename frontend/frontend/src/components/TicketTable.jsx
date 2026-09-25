import {
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "open":
      return "info";

    case "in progress":
      return "warning";

    case "resolved":
      return "success";

    case "closed":
      return "default";

    case "rejected":
      return "error";

    default:
      return "default";
  }
};

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return "error";

    case "medium":
      return "warning";

    case "low":
      return "success";

    default:
      return "default";
  }
};

function TicketTable({
  tickets,
  loading,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onView,
}) {
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Paper
      sx={{
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Ticket ID</strong>
              </TableCell>

              <TableCell>
                <strong>Title</strong>
              </TableCell>

              <TableCell>
                <strong>Client</strong>
              </TableCell>

              <TableCell>
                <strong>Department</strong>
              </TableCell>

              <TableCell>
                <strong>FM</strong>
              </TableCell>

              <TableCell>
                <strong>Priority</strong>
              </TableCell>

              <TableCell>
                <strong>Status</strong>
              </TableCell>

              <TableCell>
                <strong>Created</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      py: 6,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9}>
                  <Box
                    sx={{
                      textAlign: "center",
                      py: 6,
                    }}
                  >
                    <Typography color="text.secondary">
                      No tickets found
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  hover
                >
                  <TableCell>
                    #{ticket.id}
                  </TableCell>

                  <TableCell>
                    <Typography
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {ticket.title || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {ticket.client_name ||
                      ticket.client?.name ||
                      "-"}
                  </TableCell>

                  <TableCell>
                    {ticket.department_name ||
                      ticket.department?.name ||
                      "-"}
                  </TableCell>

                  <TableCell>
                    {ticket.fm_name ||
                      ticket.fm?.name ||
                      "-"}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={ticket.priority || "-"}
                      color={getPriorityColor(
                        ticket.priority
                      )}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={ticket.status || "-"}
                      color={getStatusColor(
                        ticket.status
                      )}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {ticket.created_at
                      ? new Date(
                          ticket.created_at
                        ).toLocaleDateString()
                      : "-"}
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="View ticket">
                      <IconButton
                        color="primary"
                        onClick={() => onView(ticket)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}

      {!loading && totalPages > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) =>
              onPageChange(value)
            }
            color="primary"
          />
        </Box>
      )}
    </Paper>
  );
}

export default TicketTable;