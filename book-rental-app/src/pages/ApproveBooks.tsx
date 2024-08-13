import React, { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { TablePagination, TextField, Select, MenuItem } from "@mui/material";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  useMaterialReactTable,
} from "material-react-table";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

interface Book {
  id: number;
  title: string;
  author: string;
  status: string;
}

const fetchBooks = async (page = 1, rowsPerPage = 10, filters = {}) => {
  try {
    const { title, author, status } = filters;
    const response = await axios.get(`/api/admin/getbooks`, {
      params: { page, rowsPerPage, title, author, status },
    });
    console.log("API response:", response.data); 
    return response.data;
  } catch (error) {
    console.error("Error fetching books:", error);
    return { books: [], total: 0 };
  }
};

export default function ApproveBooksTable() {
  const [data, setData] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    title: "",
    author: "",
    status: "",
  });

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        filterVariant: "text",
      },
      {
        header: "Author",
        accessorKey: "author",
        filterVariant: "text",
      },
      {
        header: "Status",
        accessorKey: "status",
        filterVariant: "select",
        filterSelectOptions: [
          { text: "Pending", value: "pending" },
          { text: "Approved", value: "approved" },
          { text: "Rejected", value: "rejected" },
        ],
      },
    ],
    []
  );

  const handleTableChange = (columnFilters) => {
    console.log("Column Filters:", columnFilters); 
    const newFilters = Object.keys(columnFilters).reduce((acc, key) => {
      acc[key] = columnFilters[key].value;
      return acc;
    }, {});

    setFilters(newFilters);
    setPage(0); 
  };

  const table = useMaterialReactTable({
    columns,
    data,
    manualPagination: true,
    manualFiltering: true,
    pageCount: Math.ceil(total / rowsPerPage),
    onColumnFiltersChange: handleTableChange,
    initialState: { showColumnFilters: true },
  });

  useEffect(() => {
    async function loadBooks() {
      const response = await fetchBooks(page + 1, rowsPerPage, filters);
      console.log("Fetched books:", response.books); 
      setData(response.books);
      setTotal(response.total);
    }

    loadBooks();
  }, [page, rowsPerPage, filters]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setPage(0); 
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 3, p: 3 }}>
        <Header />
        <Container maxWidth="lg" sx={{ mt: 4, borderRadius: "20px" }}>
          <Paper elevation={3}>
            <Box
              sx={{
                p: 3,
                border: "1px solid #ddd",
                borderRadius: "8px",
                overflowX: "auto",
                maxWidth: "100%",
                height: "auto",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                color="#23395B"
                sx={{ ml: 56, mb: 8, fontWeight: "bold" }}
              >
                Manage Books
              </Typography>
              <TextField
                name="title"
                label="Title"
                variant="outlined"
                value={filters.title}
                onChange={handleFilterChange}
                onKeyDown={handleKeyDown}
                sx={{ mb: 2, mr: 2 }}
              />
              <TextField
                name="author"
                label="Author"
                variant="outlined"
                value={filters.author}
                onChange={handleFilterChange}
                onKeyDown={handleKeyDown}
                sx={{ mb: 2, mr: 2 }}
              />
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>

              <MaterialReactTable
                table={table}
                manualPagination
                manualFiltering
                onChange={handleFilterChange}
                onKeyDown={handleKeyDown}
                pageCount={Math.ceil(total / rowsPerPage)}
              />

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
