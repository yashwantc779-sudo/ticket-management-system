import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

import {
  getTickets,
  getMetaData,
} from "./api/ticketApi";

// =====================================================
// STATUS
// =====================================================

const statuses = [
  "All Statuses",
  "Open",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
];

// =====================================================
// ROLES
// =====================================================

const roles = [
  "Client",
  "FM",
  "POC",
  "Technician",
];

// =====================================================
// APP
// =====================================================

function App() {

  // ===================================================
  // TICKETS
  // ===================================================

  const [tickets, setTickets] = useState([]);

  // ===================================================
  // CLIENTS
  // ===================================================

  const [clients, setClients] = useState([
    "All Clients",
  ]);

  // ===================================================
  // DEPARTMENTS
  // ===================================================

  const [departments, setDepartments] = useState([
    "All Departments",
  ]);

  // ===================================================
  // FACILITIES
  // ===================================================

  const [facilities, setFacilities] = useState([]);

  // ===================================================
  // LOADING
  // ===================================================

  const [loading, setLoading] = useState(true);

  // ===================================================
  // ERROR
  // ===================================================

  const [error, setError] = useState("");

  // ===================================================
  // ROLE
  // ===================================================

  const [role, setRole] = useState("Client");

  // ===================================================
  // SEARCH
  // ===================================================

  const [search, setSearch] = useState("");

  // ===================================================
  // FILTERS
  // ===================================================

  const [clientFilter, setClientFilter] =
    useState("All Clients");

  const [departmentFilter, setDepartmentFilter] =
    useState("All Departments");

  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  // ===================================================
  // PAGINATION
  // ===================================================

  const [page, setPage] = useState(1);

  const pageSize = 5;

  // ===================================================
  // DETAIL MODAL
  // ===================================================

  const [selectedTicket, setSelectedTicket] =
    useState(null);

  const [detailOpen, setDetailOpen] =
    useState(false);

  // ===================================================
  // CREATE MODAL
  // ===================================================

  const [createOpen, setCreateOpen] =
    useState(false);

  // ===================================================
  // NOTIFICATION
  // ===================================================

  const [notification, setNotification] =
    useState(false);

  // ===================================================
  // NEW TICKET
  // ===================================================

  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    client: "",
    department: "",
    priority: "Medium",
  });

  // ===================================================
  // LOAD DATA FROM DJANGO
  // ===================================================

  const loadData = async () => {

    setLoading(true);

    setError("");

    // =================================================
    // GET TICKETS
    // =================================================

    try {

      const ticketData = await getTickets();

      console.log(
        "TICKETS FROM DJANGO:",
        ticketData
      );

      let ticketList = [];

      if (Array.isArray(ticketData)) {

        ticketList = ticketData;

      } else {

        ticketList =
          ticketData?.results || [];

      }

      setTickets(ticketList);

    } catch (err) {

      console.error(
        "TICKETS API ERROR:",
        err
      );

      setTickets([]);

      setError(
        "Unable to load tickets from Django backend."
      );
    }

    // =================================================
    // GET META DATA
    // =================================================

    try {

      const metaData = await getMetaData();

      console.log(
        "META DATA FROM DJANGO:",
        metaData
      );

      // ===============================================
      // CLIENTS
      // ===============================================

      const clientList =
        Array.isArray(metaData?.clients)
          ? metaData.clients
              .map((client) => client.name)
              .filter(Boolean)
          : [];

      setClients([
        "All Clients",
        ...clientList,
      ]);

      // ===============================================
      // DEPARTMENTS
      // ===============================================

      const departmentList =
        Array.isArray(metaData?.departments)
          ? metaData.departments
              .map(
                (department) =>
                  department.name
              )
              .filter(Boolean)
          : [];

      setDepartments([
        "All Departments",
        ...departmentList,
      ]);

      // ===============================================
      // FACILITIES
      // ===============================================

      setFacilities(
        Array.isArray(metaData?.facilities)
          ? metaData.facilities
          : []
      );

    } catch (err) {

      console.error(
        "META DATA API ERROR:",
        err
      );

      // Metadata fail hone par
      // tickets ko remove nahi karna.

      setClients([
        "All Clients",
      ]);

      setDepartments([
        "All Departments",
      ]);

      setFacilities([]);
    }

    setLoading(false);
  };

  // ===================================================
  // LOAD DATA ON PAGE LOAD
  // ===================================================

  useEffect(() => {

    loadData();

  }, []);

  // ===================================================
  // GET CLIENT NAME
  // ===================================================

  const getClientName = (ticket) => {

    if (!ticket) {
      return "";
    }

    // Client object
    if (
      typeof ticket.client === "object" &&
      ticket.client !== null
    ) {

      return (
        ticket.client.name ||
        ticket.client.client_name ||
        ""
      );
    }

    // Client string / ID
    return ticket.client || "";
  };

  // ===================================================
  // GET DEPARTMENT NAME
  // ===================================================

  const getDepartmentName = (ticket) => {

    if (!ticket) {
      return "";
    }

    // Department object
    if (
      typeof ticket.department === "object" &&
      ticket.department !== null
    ) {

      return (
        ticket.department.name ||
        ticket.department.department_name ||
        ""
      );
    }

    // Department string / ID
    return ticket.department || "";
  };

  // ===================================================
  // GET STATUS NAME
  // ===================================================

  const getStatusName = (ticket) => {

    if (!ticket) {
      return "";
    }

    const status = ticket.status;

    if (status === "OPEN") {
      return "Open";
    }

    if (status === "ASSIGNED") {
      return "Assigned";
    }

    if (status === "IN_PROGRESS") {
      return "In Progress";
    }

    if (status === "RESOLVED") {
      return "Resolved";
    }

    if (status === "CLOSED") {
      return "Closed";
    }

    return status || "";
  };

  // ===================================================
  // GET PRIORITY
  // ===================================================

  const getPriority = (ticket) => {

    return ticket?.priority || "Medium";
  };

  // ===================================================
  // FILTER TICKETS
  // ===================================================

  const filteredTickets = tickets.filter(
    (ticket) => {

      const title =
        ticket?.title || "";

      const description =
        ticket?.description || "";

      const id =
        ticket?.id || "";

      const client =
        getClientName(ticket);

      const department =
        getDepartmentName(ticket);

      const status =
        getStatusName(ticket);

      // ===============================================
      // SEARCH
      // ===============================================

      const searchText =
        search.toLowerCase().trim();

      const searchMatch =
        title
          .toLowerCase()
          .includes(searchText) ||

        description
          .toLowerCase()
          .includes(searchText) ||

        String(id)
          .toLowerCase()
          .includes(searchText);

      // ===============================================
      // CLIENT
      // ===============================================

      const clientMatch =
        clientFilter === "All Clients" ||
        client === clientFilter;

      // ===============================================
      // DEPARTMENT
      // ===============================================

      const departmentMatch =
        departmentFilter ===
          "All Departments" ||
        department === departmentFilter;

      // ===============================================
      // STATUS
      // ===============================================

      const statusMatch =
        statusFilter ===
          "All Statuses" ||
        status === statusFilter;

      return (
        searchMatch &&
        clientMatch &&
        departmentMatch &&
        statusMatch
      );
    }
  );

  // ===================================================
  // TOTAL PAGES
  // ===================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredTickets.length /
        pageSize
    )
  );

  // ===================================================
  // VISIBLE TICKETS
  // ===================================================

  const visibleTickets =
    filteredTickets.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

  // ===================================================
  // RESET FILTERS
  // ===================================================

  const resetFilters = () => {

    setSearch("");

    setClientFilter(
      "All Clients"
    );

    setDepartmentFilter(
      "All Departments"
    );

    setStatusFilter(
      "All Statuses"
    );

    setPage(1);
  };

  // ===================================================
  // STATUS COLOR
  // ===================================================

  const getStatusColor = (status) => {

    if (
      status === "Open" ||
      status === "OPEN"
    ) {
      return "info";
    }

    if (
      status === "Assigned"
    ) {
      return "secondary";
    }

    if (
      status === "In Progress" ||
      status === "IN_PROGRESS"
    ) {
      return "warning";
    }

    if (
      status === "Resolved" ||
      status === "RESOLVED"
    ) {
      return "success";
    }

    if (
      status === "Closed" ||
      status === "CLOSED"
    ) {
      return "default";
    }

    return "default";
  };

  // ===================================================
  // PRIORITY COLOR
  // ===================================================

  const getPriorityColor = (priority) => {

    if (priority === "High") {
      return "error";
    }

    if (priority === "Medium") {
      return "warning";
    }

    if (priority === "Low") {
      return "success";
    }

    return "default";
  };

  // ===================================================
  // CREATE TICKET
  // ===================================================

  const handleCreateTicket = () => {

    if (!newTicket.title.trim()) {
      return;
    }

    const ticket = {

      id:
        1000 +
        tickets.length +
        1,

      title:
        newTicket.title,

      description:
        newTicket.description,

      client:
        newTicket.client ||
        "Unknown",

      department:
        newTicket.department ||
        "Unknown",

      priority:
        newTicket.priority,

      status: "OPEN",

      created_at:
        new Date().toISOString(),
    };

    setTickets(
      (previous) => [
        ticket,
        ...previous,
      ]
    );

    setNewTicket({
      title: "",
      description: "",
      client: "",
      department: "",
      priority: "Medium",
    });

    setCreateOpen(false);

    setNotification(true);

    setPage(1);
  };

  // ===================================================
  // REFRESH
  // ===================================================

  const handleRefresh = () => {

    resetFilters();

    loadData();
  };

  // ===================================================
  // RETURN UI
  // ===================================================

  return (

    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
      }}
    >

      {/* =================================================
          NAVBAR
      ================================================= */}

      <Box
        sx={{
          backgroundColor: "#1976d2",
          color: "white",
          px: 3,
          py: 1.5,
        }}
      >

        <Container maxWidth="xl">

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >

            {/* LOGO */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >

              <ConfirmationNumberIcon />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                Ticket Management System
              </Typography>

            </Box>

            {/* ROLE */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >

              <Typography>
                Role:
              </Typography>

              <FormControl
                size="small"
                sx={{
                  minWidth: 140,
                  backgroundColor:
                    "white",
                  borderRadius: 1,
                }}
              >

                <Select
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value
                    )
                  }
                >

                  {roles.map(
                    (item) => (

                      <MenuItem
                        key={item}
                        value={item}
                      >
                        {item}
                      </MenuItem>

                    )
                  )}

                </Select>

              </FormControl>

            </Box>

          </Box>

        </Container>

      </Box>

      {/* =================================================
          MAIN
      ================================================= */}

      <Container
        maxWidth="xl"
        sx={{
          py: 4,
        }}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}
        >

          <Box>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              Tickets
            </Typography>

            <Typography
              color="text.secondary"
            >
              Manage and track support
              tickets
            </Typography>

          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
            }}
          >

            {/* REFRESH */}

            <Button
              variant="outlined"
              startIcon={
                <RefreshIcon />
              }
              onClick={
                handleRefresh
              }
            >
              Refresh
            </Button>

            {/* CREATE */}

            <Button
              variant="contained"
              startIcon={
                <AddIcon />
              }
              onClick={() =>
                setCreateOpen(true)
              }
            >
              Create Ticket
            </Button>

          </Box>

        </Box>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <Alert
            severity="error"
            sx={{ mb: 3 }}
            onClose={() =>
              setError("")
            }
          >
            {error}
          </Alert>

        )}

        {/* =================================================
            FILTER BAR
        ================================================= */}

        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
          }}
        >

          <Grid
            container
            spacing={2}
            alignItems="center"
          >

            {/* SEARCH */}

            <Grid
              item
              xs={12}
              md={3}
            >

              <TextField
                fullWidth
                size="small"
                label="Search Ticket"
                value={search}
                onChange={(event) => {

                  setSearch(
                    event.target.value
                  );

                  setPage(1);

                }}
                InputProps={{
                  startAdornment: (
                    <SearchIcon
                      sx={{
                        mr: 1,
                        color:
                          "text.secondary",
                      }}
                    />
                  ),
                }}
              />

            </Grid>

            {/* CLIENT */}

            <Grid
              item
              xs={12}
              md={2.2}
            >

              <FormControl
                fullWidth
                size="small"
              >

                <InputLabel>
                  Client
                </InputLabel>

                <Select
                  value={
                    clientFilter
                  }
                  label="Client"
                  onChange={(event) => {

                    setClientFilter(
                      event.target.value
                    );

                    setPage(1);

                  }}
                >

                  {clients.map(
                    (item) => (

                      <MenuItem
                        key={item}
                        value={item}
                      >
                        {item}
                      </MenuItem>

                    )
                  )}

                </Select>

              </FormControl>

            </Grid>

            {/* DEPARTMENT */}

            <Grid
              item
              xs={12}
              md={2.2}
            >

              <FormControl
                fullWidth
                size="small"
              >

                <InputLabel>
                  Department
                </InputLabel>

                <Select
                  value={
                    departmentFilter
                  }
                  label="Department"
                  onChange={(event) => {

                    setDepartmentFilter(
                      event.target.value
                    );

                    setPage(1);

                  }}
                >

                  {departments.map(
                    (item) => (

                      <MenuItem
                        key={item}
                        value={item}
                      >
                        {item}
                      </MenuItem>

                    )
                  )}

                </Select>

              </FormControl>

            </Grid>

            {/* STATUS */}

            <Grid
              item
              xs={12}
              md={2}
            >

              <FormControl
                fullWidth
                size="small"
              >

                <InputLabel>
                  Status
                </InputLabel>

                <Select
                  value={
                    statusFilter
                  }
                  label="Status"
                  onChange={(event) => {

                    setStatusFilter(
                      event.target.value
                    );

                    setPage(1);

                  }}
                >

                  {statuses.map(
                    (item) => (

                      <MenuItem
                        key={item}
                        value={item}
                      >
                        {item}
                      </MenuItem>

                    )
                  )}

                </Select>

              </FormControl>

            </Grid>

            {/* CLEAR */}

            <Grid
              item
              xs={12}
              md={2}
            >

              <Button
                fullWidth
                variant="outlined"
                onClick={
                  resetFilters
                }
              >
                Clear Filters
              </Button>

            </Grid>

          </Grid>

        </Paper>

        {/* =================================================
            SUMMARY CARDS
        ================================================= */}

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >

          {/* TOTAL */}

          <Paper
            sx={{
              p: 2,
              minWidth: 180,
              flex: 1,
            }}
          >

            <Typography
              color="text.secondary"
            >
              Total Tickets
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              {tickets.length}
            </Typography>

          </Paper>

          {/* OPEN */}

          <Paper
            sx={{
              p: 2,
              minWidth: 180,
              flex: 1,
            }}
          >

            <Typography
              color="text.secondary"
            >
              Open
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="info.main"
            >

              {
                tickets.filter(
                  (item) =>
                    getStatusName(
                      item
                    ) === "Open"
                ).length
              }

            </Typography>

          </Paper>

          {/* IN PROGRESS */}

          <Paper
            sx={{
              p: 2,
              minWidth: 180,
              flex: 1,
            }}
          >

            <Typography
              color="text.secondary"
            >
              In Progress
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="warning.main"
            >

              {
                tickets.filter(
                  (item) =>
                    getStatusName(
                      item
                    ) ===
                    "In Progress"
                ).length
              }

            </Typography>

          </Paper>

          {/* RESOLVED */}

          <Paper
            sx={{
              p: 2,
              minWidth: 180,
              flex: 1,
            }}
          >

            <Typography
              color="text.secondary"
            >
              Resolved
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              color="success.main"
            >

              {
                tickets.filter(
                  (item) =>
                    getStatusName(
                      item
                    ) ===
                    "Resolved"
                ).length
              }

            </Typography>

          </Paper>

        </Box>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <Paper
            sx={{
              p: 8,
              textAlign: "center",
            }}
          >

            <CircularProgress />

            <Typography
              sx={{ mt: 2 }}
              color="text.secondary"
            >
              Loading tickets...
            </Typography>

          </Paper>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
            }}
          >

            <Table>

              {/* TABLE HEAD */}

              <TableHead>

                <TableRow>

                  <TableCell>
                    <strong>
                      Ticket ID
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Title
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Client
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Department
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Priority
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Status
                    </strong>
                  </TableCell>

                  <TableCell>
                    <strong>
                      Created
                    </strong>
                  </TableCell>

                  <TableCell align="center">
                    <strong>
                      Action
                    </strong>
                  </TableCell>

                </TableRow>

              </TableHead>

              {/* TABLE BODY */}

              <TableBody>

                {visibleTickets.map(
                  (ticket) => {

                    const client =
                      getClientName(
                        ticket
                      );

                    const department =
                      getDepartmentName(
                        ticket
                      );

                    const status =
                      getStatusName(
                        ticket
                      );

                    const priority =
                      getPriority(
                        ticket
                      );

                    return (

                      <TableRow
                        key={
                          ticket.id
                        }
                        hover
                      >

                        {/* ID */}

                        <TableCell>
                          #
                          {ticket.id}
                        </TableCell>

                        {/* TITLE */}

                        <TableCell>

                          <Typography
                            fontWeight={600}
                          >
                            {
                              ticket.title
                            }
                          </Typography>

                        </TableCell>

                        {/* CLIENT */}

                        <TableCell>
                          {client}
                        </TableCell>

                        {/* DEPARTMENT */}

                        <TableCell>
                          {department}
                        </TableCell>

                        {/* PRIORITY */}

                        <TableCell>

                          <Chip
                            label={
                              priority
                            }
                            size="small"
                            color={
                              getPriorityColor(
                                priority
                              )
                            }
                          />

                        </TableCell>

                        {/* STATUS */}

                        <TableCell>

                          <Chip
                            label={
                              status
                            }
                            size="small"
                            color={
                              getStatusColor(
                                status
                              )
                            }
                          />

                        </TableCell>

                        {/* CREATED */}

                        <TableCell>

                          {ticket.created_at
                            ? new Date(
                                ticket.created_at
                              ).toLocaleDateString()
                            : "-"}

                        </TableCell>

                        {/* ACTION */}

                        <TableCell align="center">

                          <IconButton
                            color="primary"
                            onClick={() => {

                              setSelectedTicket(
                                ticket
                              );

                              setDetailOpen(
                                true
                              );

                            }}
                          >

                            <VisibilityIcon />

                          </IconButton>

                        </TableCell>

                      </TableRow>

                    );
                  }
                )}

                {/* NO DATA */}

                {visibleTickets.length ===
                  0 && (

                  <TableRow>

                    <TableCell
                      colSpan={8}
                      align="center"
                    >

                      <Typography
                        sx={{
                          py: 5,
                        }}
                        color="text.secondary"
                      >
                        No tickets found
                      </Typography>

                    </TableCell>

                  </TableRow>

                )}

              </TableBody>

            </Table>

            {/* PAGINATION */}

            <Box
              sx={{
                display: "flex",
                justifyContent:
                  "flex-end",
                p: 2,
              }}
            >

              <Pagination
                count={totalPages}
                page={page}
                onChange={(
                  event,
                  value
                ) =>
                  setPage(value)
                }
                color="primary"
              />

            </Box>

          </TableContainer>

        )}

      </Container>

      {/* =================================================
          CREATE TICKET MODAL
      ================================================= */}

      <Dialog
        open={createOpen}
        onClose={() =>
          setCreateOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle>
          Create New Ticket
        </DialogTitle>

        <DialogContent>

          <Box
            sx={{
              display: "flex",
              flexDirection:
                "column",
              gap: 2,
              mt: 1,
            }}
          >

            {/* TITLE */}

            <TextField
              label="Ticket Title"
              fullWidth
              value={
                newTicket.title
              }
              onChange={(event) =>
                setNewTicket({
                  ...newTicket,
                  title:
                    event.target
                      .value,
                })
              }
            />

            {/* DESCRIPTION */}

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={
                newTicket.description
              }
              onChange={(event) =>
                setNewTicket({
                  ...newTicket,
                  description:
                    event.target
                      .value,
                })
              }
            />

            {/* CLIENT */}

            <FormControl fullWidth>

              <InputLabel>
                Client
              </InputLabel>

              <Select
                value={
                  newTicket.client
                }
                label="Client"
                onChange={(event) =>
                  setNewTicket({
                    ...newTicket,
                    client:
                      event.target
                        .value,
                  })
                }
              >

                {clients
                  .filter(
                    (item) =>
                      item !==
                      "All Clients"
                  )
                  .map((item) => (

                    <MenuItem
                      key={item}
                      value={item}
                    >
                      {item}
                    </MenuItem>

                  ))}

              </Select>

            </FormControl>

            {/* DEPARTMENT */}

            <FormControl fullWidth>

              <InputLabel>
                Department
              </InputLabel>

              <Select
                value={
                  newTicket.department
                }
                label="Department"
                onChange={(event) =>
                  setNewTicket({
                    ...newTicket,
                    department:
                      event.target
                        .value,
                  })
                }
              >

                {departments
                  .filter(
                    (item) =>
                      item !==
                      "All Departments"
                  )
                  .map((item) => (

                    <MenuItem
                      key={item}
                      value={item}
                    >
                      {item}
                    </MenuItem>

                  ))}

              </Select>

            </FormControl>

            {/* PRIORITY */}

            <FormControl fullWidth>

              <InputLabel>
                Priority
              </InputLabel>

              <Select
                value={
                  newTicket.priority
                }
                label="Priority"
                onChange={(event) =>
                  setNewTicket({
                    ...newTicket,
                    priority:
                      event.target
                        .value,
                  })
                }
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

          {/* CANCEL */}

          <Button
            onClick={() =>
              setCreateOpen(false)
            }
          >
            Cancel
          </Button>

          {/* CREATE */}

          <Button
            variant="contained"
            onClick={
              handleCreateTicket
            }
            disabled={
              !newTicket.title.trim()
            }
          >
            Create Ticket
          </Button>

        </DialogActions>

      </Dialog>

      {/* =================================================
          TICKET DETAIL MODAL
      ================================================= */}

      <Dialog
        open={detailOpen}
        onClose={() =>
          setDetailOpen(false)
        }
        fullWidth
        maxWidth="md"
      >

        <DialogTitle>
          Ticket Details
        </DialogTitle>

        <DialogContent>

          {selectedTicket && (

            <Box>

              {/* TITLE */}

              <Typography
                variant="h5"
                fontWeight={700}
              >
                {
                  selectedTicket.title
                }
              </Typography>

              {/* DESCRIPTION */}

              <Typography
                color="text.secondary"
                sx={{
                  mt: 1,
                  mb: 3,
                }}
              >
                {
                  selectedTicket.description ||
                  "No description available."
                }
              </Typography>

              <Divider
                sx={{
                  mb: 3,
                }}
              />

              <Grid
                container
                spacing={3}
              >

                {/* ID */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                  >
                    Ticket ID
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    #
                    {
                      selectedTicket.id
                    }
                  </Typography>

                </Grid>

                {/* CLIENT */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                  >
                    Client
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {
                      getClientName(
                        selectedTicket
                      )
                    }
                  </Typography>

                </Grid>

                {/* DEPARTMENT */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                  >
                    Department
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {
                      getDepartmentName(
                        selectedTicket
                      )
                    }
                  </Typography>

                </Grid>

                {/* FACILITY MANAGER */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                  >
                    Facility Manager
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {
                      selectedTicket.facility_manager ||
                      selectedTicket.fm ||
                      "Unassigned"
                    }
                  </Typography>

                </Grid>

                {/* PRIORITY */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                  >
                    Priority
                  </Typography>

                  <Box sx={{ mt: 1 }}>

                    <Chip
                      label={
                        getPriority(
                          selectedTicket
                        )
                      }
                      color={
                        getPriorityColor(
                          getPriority(
                            selectedTicket
                          )
                        )
                      }
                    />

                  </Box>

                </Grid>

                {/* STATUS */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                  >
                    Status
                  </Typography>

                  <Box sx={{ mt: 1 }}>

                    <Chip
                      label={
                        getStatusName(
                          selectedTicket
                        )
                      }
                      color={
                        getStatusColor(
                          getStatusName(
                            selectedTicket
                          )
                        )
                      }
                    />

                  </Box>

                </Grid>

                {/* CREATED */}

                <Grid
                  item
                  xs={12}
                  md={6}
                >

                  <Typography
                    color="text.secondary"
                  >
                    Created
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {
                      selectedTicket.created_at
                        ? new Date(
                            selectedTicket.created_at
                          ).toLocaleString()
                        : "-"
                    }
                  </Typography>

                </Grid>

              </Grid>

              <Divider
                sx={{
                  my: 3,
                }}
              />

              {/* HISTORY */}

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  mb: 2,
                }}
              >
                Ticket History
              </Typography>

              <Box
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
                  Ticket Created
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Ticket was created
                  and is available in
                  the system.
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {
                    selectedTicket.created_at
                      ? new Date(
                          selectedTicket.created_at
                        ).toLocaleString()
                      : "-"
                  }
                </Typography>

              </Box>

            </Box>

          )}

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setDetailOpen(false)
            }
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

      {/* =================================================
          SUCCESS NOTIFICATION
      ================================================= */}

      <Snackbar
        open={notification}
        autoHideDuration={3000}
        onClose={() =>
          setNotification(false)
        }
      >

        <Alert
          severity="success"
          onClose={() =>
            setNotification(false)
          }
        >
          Ticket created successfully!
        </Alert>

      </Snackbar>

    </Box>
  );
}

export default App;