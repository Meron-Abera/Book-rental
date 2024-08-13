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
  FormHelperText,
  Stack,
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

const AddNewBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("./api/books/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error("Failed to fetch categories.");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleAuthorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuthor(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedCategoryId = event.target.value as string;
    console.log("Selected Category ID:", selectedCategoryId); 
    setCategory(selectedCategoryId);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const userToken = localStorage.getItem("token");

    if (!userToken) {
      console.error("User token is not available.");
      setError("User not authenticated.");
      return;
    }

    if (title && author && category && selectedFile) {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("category", category);
      formData.append("file", selectedFile);

      try {
        const response = await fetch("/api/books/addbook", { 
          method: "POST",
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setSuccess("Book added successfully!");
          setTitle("");
          setAuthor("");
          setCategory("");
          setSelectedFile(null);
          setError(null);
        } else {
          const errorData = await response.json();
          console.error("API Error:", errorData);
          setError(errorData.message || "Failed to add book.");
        }
      } catch (error) {
        console.error("Error adding book:", error);
        setError("An unexpected error occurred.");
      }
    } else {
      setError("Please fill all fields and upload a file.");
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, p: 1 }}>
        <Header />
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Container
            sx={{
              p: 4,
              borderRadius: "10px",
              boxShadow: 3,
              backgroundColor: "#fff",
              width: 900,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              color="#23395B"
              sx={{ fontWeight: "bold" }}
            >
              Add New Book
            </Typography>

            <form>
              <Stack spacing={2} sx={{ marginBottom: 4 }}>
                <FormControl fullWidth>
                  <InputLabel
                    htmlFor="title"
                    sx={{
                      // Custom styles for the label
                      visibility: title || focusedField === "title" ? "hidden" : "visible",
                      transition: "visibility 0.2s ease-out",
                    }}
                  >
                  </InputLabel>
                  <TextField
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    onFocus={() => setFocusedField("title")}
                    onBlur={() => setFocusedField(null)}
                    placeholder={title ? "" : "Enter book title"} 
                    aria-describedby="title-helper-text"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "grey",
                        },
                        "&:hover fieldset": {
                          borderColor: "#23395B",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#23395B",
                        },
                      },
                      "& .MuiInputBase-input": {
                        paddingTop: "12px", 
                      },
                    }}
                  />
                  <FormHelperText id="title-helper-text">
                    Please enter the title of the book.
                  </FormHelperText>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel
                    htmlFor="author"
                    sx={{
                      // Custom styles for the label
                      visibility: author || focusedField === "author" ? "hidden" : "visible",
                      transition: "visibility 0.2s ease-out",
                    }}
                  >
                  </InputLabel>
                  <TextField
                    id="author"
                    value={author}
                    onChange={handleAuthorChange}
                    onFocus={() => setFocusedField("author")}
                    onBlur={() => setFocusedField(null)}
                    placeholder={author ? "" : "Enter author's name"} 
                    aria-describedby="author-helper-text"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "grey",
                        },
                        "&:hover fieldset": {
                          borderColor: "#23395B",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#23395B",
                        },
                      },
                      "& .MuiInputBase-input": {
                        paddingTop: "12px", 
                      },
                    }}
                  />
                  <FormHelperText id="author-helper-text">
                    Please enter the author's name.
                  </FormHelperText>
                </FormControl>
              </Stack>

              <Stack spacing={2} sx={{ marginBottom: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category"
                    value={category}
                    label="Category"
                    onChange={handleCategoryChange}
                    aria-describedby="category-helper-text"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "grey",
                        },
                        "&:hover fieldset": {
                          borderColor: "#23395B",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#23395B",
                        },
                      },
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText id="category-helper-text">
                    Select the category of the book.
                  </FormHelperText>
                </FormControl>
              </Stack>

              <Stack spacing={2} sx={{ marginBottom: 4 }}>
                <Button
                  component="label"
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  UPLOAD BOOK COVER
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {selectedFile && (
                  <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
                    Uploaded File: {selectedFile.name}
                  </Typography>
                )}
              </Stack>

              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: "#23395B",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "blue",
                  },
                  mt: 4,
                  borderRadius: "10px",
                }}
                fullWidth
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
            </form>
          </Container>
        </Container>
      </Box>
    </Box>
  );
};

export default AddNewBook;
