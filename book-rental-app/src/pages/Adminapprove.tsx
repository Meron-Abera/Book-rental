import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { TablePagination } from "@mui/material";

const fetchUsers = async (page = 1, rowsPerPage = 10, location = '') => {
  try {
    const response = await axios.get(`./api/admin/getuser?page=${page}&rowsPerPage=${rowsPerPage}&location=${location}`);
    console.log('API response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return { users: [], total: 0 }; 
  }
};

// Function to create data for each user row
function createData(email, location, phoneNumber, status) {
  return { email, location, phoneNumber, status };
}

function Row({ row, index, onUpdateStatus }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(row.status);

  const handleChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
  
    try {
      await axios.post("./api/admin/updatestatus", {
        email: row.email,
        status: newStatus,
      });
  
      onUpdateStatus(row.email, newStatus);
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleDisable = async () => {
    try {
      await axios.post("./api/admin/disableuser", {
        email: row.email,
        status: "banned",
      });
      onUpdateStatus(row.email, "banned");
    } catch (error) {
      console.error('Error disabling user:', error);
    }
  };

  const rowBackgroundColor = index % 2 === 0 ? "white" : "#f8edeb";

  return (
    <React.Fragment>
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          backgroundColor: rowBackgroundColor,
        }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.email}
        </TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>{row.phoneNumber}</TableCell>
        <TableCell>
          <Select value={status} onChange={handleChange}>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
            <MenuItem value="banned">Banned</MenuItem>
          </Select>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                User Details
              </Typography>
              <Button variant="contained" color="warning" onClick={handleDisable}>
                Disable User
              </Button>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function PaginationControls({ page, rowsPerPage, count, onPageChange, onRowsPerPageChange }) {
  return (
    <TablePagination
      rowsPerPageOptions={[4, 8, 24]}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={(event, newPage) => onPageChange(newPage)}
      onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
    />
  );
}

export default function UsersTable() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    async function loadUsers() {
      const data = await fetchUsers(page + 1, rowsPerPage, locationFilter); 
      console.log('Fetched users:', data.users); 
      setRows(data.users.map(user => createData(user.email, user.location, user.phoneNumber, user.status)));
      setTotal(data.total);
    }

    loadUsers();
  }, [page, rowsPerPage, locationFilter]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0); 
  };

  const handleUpdateStatus = (email, newStatus) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.email === email ? { ...row, status: newStatus } : row
      )
    );
  };

  const handleLocationFilterChange = (event) => {
    setLocationFilter(event.target.value);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Header />

        <Container maxWidth="lg" sx={{ mt: 4, borderRadius: "20px" }}>
          <Typography
            variant="h4"
            gutterBottom
            color="#23395B"
            sx={{ ml: 56, mb: 8, fontWeight: "bold" }}
          >
            Manage Users
          </Typography>

          <Box sx={{ mb: 2 }}>
            <TextField
              label="Filter by Location"
              variant="outlined"
              fullWidth
              value={locationFilter}
              onChange={handleLocationFilterChange}
            />
          </Box>

          <Paper elevation={3}>
            <TableContainer>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 10, color: "#23395B" }} />
                    <TableCell sx={{ fontWeight: "bold", fontSize: 15, color: "#23395B" }}>
                      Email
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 15, color: "#23395B" }}>
                      Location
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 15, color: "#23395B" }}>
                      Phone Number
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 15, color: "#23395B" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No users available
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row, index) => (
                      <Row
                        key={row.email}
                        row={row}
                        index={index}
                        onUpdateStatus={handleUpdateStatus}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <PaginationControls
              page={page}
              rowsPerPage={rowsPerPage}
              count={total}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
