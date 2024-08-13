import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import jwt_decode from 'jwt-decode';

const EditBook = () => {
  const [rentals, setRentals] = useState([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedOwnerId = localStorage.getItem("ownerId");
      setUserId(storedUserId);
      setOwnerId(storedOwnerId);

      const fetchRentals = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            setError("Authorization token not found");
            setLoading(false);
            return;
          }

          const response = await fetch(`./api/rentBook/getallrentals`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setRentals(
              data.rentals.filter((rental) => rental.rent_quantity > 0)
            );
          } else {
            setError("Failed to fetch rentals: " + response.statusText);
          }
        } catch (error) {
          setError("Error fetching rentals: " + error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchRentals();

      return () => {
        setLoading(false);
        setError(null);
      };
    }
  }, []);

  const handleRent = async (rentalId: number) => {
    try {
      const rental = rentals.find((r) => r.rental_id === rentalId);
      if (!rental) throw new Error("Rental not found");

      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) throw new Error("Authorization token not found");

      const rentResponse = await fetch(`./api/rentBook?rentalId=${rentalId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          status: "rented",
        }),
      });

      if (rentResponse.ok) {
        const updatedRentals = rentals.map((r) =>
          r.rental_id === rentalId
            ? { ...r, isRented: true, rent_quantity: r.rent_quantity - 1 }
            : r
        );
        setRentals(updatedRentals);
        console.log("Book rented successfully");
      } else {
        const errorText = await rentResponse.text();
        console.error("Failed to rent book:", errorText);
      }
    } catch (error) {
      console.error("Error renting book:", error.message);
    }
  };
  const handleReturn = async (rentalId: number) => {
    try {
      const rental = rentals.find((r) => r.rental_id === rentalId);
      if (!rental) throw new Error("Rental not found");
  
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authorization token not found");
  
      const userId = null;
  
      const returnResponse = await fetch(`./api/rentBook/returnrental`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rentalId: rentalId, // Send rentalId
          userId: userId, // Send userId as null
          status: "returned", // Fixed status
        }),
      });
  
      if (returnResponse.ok) {
        const updatedRentals = rentals.map((r) =>
          r.rental_id === rentalId
            ? { ...r, isRented: false, rent_quantity: r.rent_quantity + 1 }
            : r
        );
        setRentals(updatedRentals);
        console.log("Book returned successfully");
      } else {
        const errorText = await returnResponse.text();
        console.error("Failed to return book:", errorText);
      }
    } catch (error) {
      console.error("Error returning book:", error.message);
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
          Books for Rent
        </Typography>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Grid container spacing={4}>
            {rentals.map((rental) => (
              <Grid item xs={12} sm={6} md={4} key={rental.rental_id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {rental.title}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Quantity: {rental.rent_quantity}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      Price: ${rental.rent_price}
                    </Typography>
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    >
                      {rental.isRented ? (
                        <Button
                          onClick={() => handleReturn(rental.rental_id)}
                          variant="contained"
                          color="secondary"
                        >
                          Return
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleRent(rental.rental_id)}
                          variant="contained"
                          color="primary"
                          disabled={rental.rent_quantity === 0}
                        >
                          Rent
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default EditBook;
