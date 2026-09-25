import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";

function FilterBar({
  filters,
  metadata,
  onFilterChange,
  onReset,
}) {
  const clients = metadata?.clients || [];
  const departments = metadata?.departments || [];
  const fms = metadata?.fms || [];
  const statuses = metadata?.statuses || [];

  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        backgroundColor: "white",
        borderRadius: 2,
        boxShadow: 1,

        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {/* Search */}

      <TextField
        size="small"
        label="Search"
        placeholder="Search tickets..."
        value={filters.search}
        onChange={(event) =>
          onFilterChange({
            search: event.target.value,
          })
        }
        sx={{
          minWidth: 220,
        }}
      />

      {/* Client */}

      <FormControl
        size="small"
        sx={{
          minWidth: 170,
        }}
      >
        <InputLabel>Client</InputLabel>

        <Select
          value={filters.client}
          label="Client"
          onChange={(event) =>
            onFilterChange({
              client: event.target.value,
            })
          }
        >
          <MenuItem value="">All Clients</MenuItem>

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

      {/* Department */}

      <FormControl
        size="small"
        sx={{
          minWidth: 170,
        }}
      >
        <InputLabel>Department</InputLabel>

        <Select
          value={filters.department}
          label="Department"
          onChange={(event) =>
            onFilterChange({
              department: event.target.value,
            })
          }
        >
          <MenuItem value="">All Departments</MenuItem>

          {departments.map((department) => (
            <MenuItem
              key={department.id ?? department}
              value={department.id ?? department}
            >
              {department.name ?? department}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* FM */}

      <FormControl
        size="small"
        sx={{
          minWidth: 160,
        }}
      >
        <InputLabel>FM</InputLabel>

        <Select
          value={filters.fm}
          label="FM"
          onChange={(event) =>
            onFilterChange({
              fm: event.target.value,
            })
          }
        >
          <MenuItem value="">All FM</MenuItem>

          {fms.map((fm) => (
            <MenuItem key={fm.id ?? fm} value={fm.id ?? fm}>
              {fm.name ?? fm}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Status */}

      <FormControl
        size="small"
        sx={{
          minWidth: 160,
        }}
      >
        <InputLabel>Status</InputLabel>

        <Select
          value={filters.status}
          label="Status"
          onChange={(event) =>
            onFilterChange({
              status: event.target.value,
            })
          }
        >
          <MenuItem value="">All Statuses</MenuItem>

          {statuses.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Sort */}

      <FormControl
        size="small"
        sx={{
          minWidth: 180,
        }}
      >
        <InputLabel>Sort By</InputLabel>

        <Select
          value={filters.ordering}
          label="Sort By"
          onChange={(event) =>
            onFilterChange({
              ordering: event.target.value,
            })
          }
        >
          <MenuItem value="-created_at">
            Newest First
          </MenuItem>

          <MenuItem value="created_at">
            Oldest First
          </MenuItem>

          <MenuItem value="priority">
            Priority
          </MenuItem>

          <MenuItem value="status">
            Status
          </MenuItem>
        </Select>
      </FormControl>

      {/* Reset */}

      <Button
        variant="outlined"
        startIcon={<ClearIcon />}
        onClick={onReset}
      >
        Clear
      </Button>
    </Box>
  );
}

export default FilterBar;