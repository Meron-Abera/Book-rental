import * as React from "react";
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
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

function Row(props) {
  const { row, index, categories } = props;
  const [open, setOpen] = React.useState(false);

  const statusColor = {
    approved: "green",
    pending: "blue",
    rejected: "red",
  };

  const rowBackgroundColor = index % 2 === 0 ? "white" : "#f8edeb";

  const categoryName = categories?.find(cat => cat.id === row.category_id)?.name || "Unknown";

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
          {row.title}
        </TableCell>
        <TableCell>{row.author}</TableCell>
        <TableCell>{categoryName}</TableCell>
        <TableCell>
          <Typography color={statusColor[row.status]}>
            {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          </Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Book Details
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function BookTable() {
  const [books, setBooks] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchBooks = async () => {
      const userToken = localStorage.getItem("token"); 

      if (!userToken) {
        console.error("User token is not available.");
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      try {
        const booksResponse = await axios.get('./api/books/getsubmittedbooks', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });
        setBooks(booksResponse.data.books);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchCategories = async () => {
      try {
        const categoriesResponse = await axios.get('./api/books/categories');
        setCategories(categoriesResponse.data.categories);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBooks();
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

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
            List of Books
          </Typography>
          <Paper elevation={3}>
            <TableContainer>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 10, color: "#23395B" }} />
                    <TableCell sx={{ fontWeight: "bold", fontSize: 15, color: "#23395B" }}>
                      Book Title
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 15, color: "#23395B" }}>
                      Author
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 15, color: "#23395B" }}>
                      Category
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: 15, color: "#23395B" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {books.map((row, index) => (
                    <Row key={row.id} row={row} index={index} categories={categories} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}
