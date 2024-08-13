import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const BookUpload = () => {
  const [books, setBooks] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [bookQuantity, setBookQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("./api/books/getallbooks");
        if (response.ok) {
          const data = await response.json();
          setBooks(data.books);
        } else {
          console.error("Failed to fetch books:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleBookChange = (event) => {
    setSelectedBookId(event.target.value);
  };

  const handleBookQuantityChange = (event) => {
    setBookQuantity(Number(event.target.value));
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (selectedBookId && bookQuantity && price && selectedFile) {
      const formData = new FormData();
      formData.append("bookId", selectedBookId);
      formData.append("bookQuantity", bookQuantity);
      formData.append("price", price);
      formData.append("status", "not rented"); 
      formData.append("file", selectedFile);

      const token = localStorage.getItem("token"); 

      try {
        const response = await fetch("./api/books/uploadBook", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, 
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setSuccess("Book rental details uploaded successfully!");
          setBookQuantity("");
          setPrice("");
          setSelectedFile(null);
          setSelectedBookId("");
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to upload book details.");
        }
      } catch (error) {
        console.error("Error uploading book details:", error);
        setError("An unexpected error occurred.");
      }
    } else {
      setError("Please fill all fields and upload a file.");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Header />
        <Box
          sx={{
            p: 3,
            border: "1px solid #ddd",
            height: 500,
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            color="#23395B"
            sx={{ ml: 48, mb: 8, fontWeight: "bold" }}
          >
            Upload Rental Book
          </Typography>
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <FormControl sx={{ width: "100%", mb: 12 }}>
              <InputLabel id="book-select-label">Select Book</InputLabel>
              <Select
                labelId="book-select-label"
                id="book-select"
                value={selectedBookId}
                label="Select Book"
                onChange={handleBookChange}
                sx={{ borderRadius: "8px" }}
              >
                {books.map((book) => (
                  <MenuItem key={book.id} value={book.id}>
                    {book.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <FormControl sx={{ width: "48%", mr: 8 }}>
                <InputLabel htmlFor="quantity"></InputLabel>
                <TextField
                  id="quantity"
                  type="number"
                  value={bookQuantity}
                  placeholder={bookQuantity ? "" : "Enter Book Quantity"} 
                  onChange={handleBookQuantityChange}
                  InputLabelProps={{ shrink: true }} 
                  sx={{ borderRadius: "8px" }}
                  inputProps={{ min: 1, step: 1 }}
                />
              </FormControl>

              <TextField
                sx={{ width: "48%", borderRadius: "8px" }}
                id="price"
                label="Rent price for 2 weeks"
                value={price}
                onChange={handlePriceChange}
                variant="outlined"
              />
            </Box>

            <Button
              component="label"
              sx={{ mb: 2, color: "#1976D2", mt: 4 }}
              fullWidth
            >
              UPLOAD BOOK COVER
              <input type="file" hidden onChange={handleFileChange} />
            </Button>

            {/* Display the uploaded file name */}
            {selectedFile && (
              <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                Uploaded File: {selectedFile.name}
              </Typography>
            )}

            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#23395B",
                color: "#fff",
                width: "260px",
                ml: 36,
                mt: 4,
                borderRadius: "10px",
              }}
            >
              SUBMIT
            </Button>

            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="success" sx={{ mt: 2 }}>
                {success}
              </Typography>
            )}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default BookUpload;
