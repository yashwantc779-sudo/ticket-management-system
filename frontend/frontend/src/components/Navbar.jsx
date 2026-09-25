import {
  AppBar,
  Box,
  FormControl,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  Chip,
} from "@mui/material";

import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

const roles = [
  "Client",
  "FM",
  "POC",
  "Technician",
];

function Navbar({ role, setRole }) {
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
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
            sx={{
              fontWeight: 700,
            }}
          >
            Ticket Management
          </Typography>
        </Box>

        {/* Role */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Chip
            label={`Role: ${role}`}
            color="secondary"
            variant="outlined"
            sx={{
              color: "white",
              borderColor: "white",
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: 140,
              backgroundColor: "white",
              borderRadius: 1,
            }}
          >
            <Select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              {roles.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;