import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import {
  Container,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
const Dashboard = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
    }
  }, []);

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const response = await fetch(`./api/books/getusersrental`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setBooks(data.rentals);
        } else {
          console.error("Failed to fetch books:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);
  // for revenue
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("./api/rentBook/getrevenue");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched chart data:", data); 
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartData) {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(() => {
        if (chartData) {
          drawChart(chartData);
        } else {
          console.error("chartData is null or undefined");
        }
      });
    }
  }, [chartData]);

  const drawChart = (data) => {
    if (data && data.columns && data.data) {
      console.log("Drawing chart with data:", data);

      const googleData = new google.visualization.DataTable();
      googleData.addColumn("number", data.columns[0]); // Owner ID
      googleData.addColumn("number", data.columns[1]); // Revenue

      const formattedData = data.data.map((row) => [
        row[0], // Owner ID
        parseFloat(row[1]), // Convert Revenue from string to number
      ]);

      googleData.addRows(formattedData);

      const options = {
        hAxis: {
          title: "Owner ID",
        },
        vAxis: {
          title: "Revenue",
        },
        backgroundColor: "#f1f8e9",
      };

      const chart = new google.visualization.LineChart(
        document.getElementById("chart_div")
      );
      chart.draw(googleData, options);
    } else {
      console.error("Invalid chartData:", data);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Header />

        <Typography
          variant="h4"
          gutterBottom
          color="#23395B"
          sx={{ ml: 56, mb: 8, fontWeight: "bold" }}
        >
          Rental Books
        </Typography>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: 1, marginRight: "16px" }}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Book Name</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.rent_quantity}</TableCell>
                        <TableCell>{book.rent_price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div
              id="chart_div"
              style={{ flex: 1, width: "900px", height: "380px" }}
            ></div>
          </div>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
