import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Box, Divider, IconButton } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookIcon from "@mui/icons-material/AutoStories"; // Updated icon import
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuIcon from "@mui/icons-material/Menu";
import ApprovalIcon from "@mui/icons-material/Approval";

const Sidebar = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [open, setOpen] = useState(true); 

  useEffect(() => {
    const pathMap: { [key: string]: number } = {
      "/Admindashboard": 0,
      "/AddNewBook": 1,
      "/RentBook": 2,
      "/ShowBooks": 3,
      "/bookUploadforRent": 4,
      "/settings": 6,
      "/Adminapprove": 9,
      "/ApproveBooks": 10,
      "/OwnerDashboard": 11,
    };
    setSelectedIndex(pathMap[router.pathname] || null);
  }, [router.pathname]);

  const handleNavigation = (index: number, path: string) => {
    setSelectedIndex(index);
    router.push(path);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Retrieve the user's role from local storage
  const userRole =
    typeof window !== "undefined"
      ? localStorage.getItem("userRole") || "guest"
      : "guest";

  return (
    <>
      <IconButton
        onClick={toggleDrawer}
        sx={{
          color: "#fff",
          position: "fixed",
          top: 10,
          left: 10,
          zIndex: 1300,
        }}
      >
        <MenuIcon sx={{ color: "#56638A", ml: 2, mt: 2 }} />
      </IconButton>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: 240,
          height: "100%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#1E1E2D",
            color: "#fff",
            borderRadius: "8px",
            mt: 2,
            mx: 2,
            mb: 4,
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", mb: 8 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 2,
            }}
          >
            <BookIcon sx={{ fontSize: 50, color: 'white' }} /> 
          </Box>
          <List sx={{ flexGrow: 1 }}>
            {userRole === "admin" && (
              <>
                <ListItem
                  button
                  selected={selectedIndex === 0}
                  onClick={() => handleNavigation(0, "/Admindashboard")}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#fff",
                      color: "#000",
                      "& .MuiListItemIcon-root": {
                        color: "#000",
                      },
                      "& .MuiListItemText-primary": {
                        color: "#000",
                      },
                    },
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon
                      style={{ color: selectedIndex === 0 ? "#000" : "#fff" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>

                <ListItem
                  button
                  selected={selectedIndex === 9}
                  onClick={() => handleNavigation(9, "/ApproveBooks")}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#fff",
                      color: "#000",
                      "& .MuiListItemIcon-root": {
                        color: "#000",
                      },
                      "& .MuiListItemText-primary": {
                        color: "#000",
                      },
                    },
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <ApprovalIcon
                      style={{ color: selectedIndex === 9 ? "#000" : "#fff" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Approve Books" />
                </ListItem>

                <ListItem
                  button
                  selected={selectedIndex === 10}
                  onClick={() => handleNavigation(10, "/Adminapprove")}
                >
                  <ListItemIcon>
                    <ApprovalIcon
                      style={{ color: selectedIndex === 10 ? "#000" : "#fff" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Approve Users" />
                </ListItem>
              </>
            )}
            {userRole === "owner" && (
              <>
                <ListItem
                  button
                  selected={selectedIndex === 11}
                  onClick={() => handleNavigation(11, "/OwnerDashboard")}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#fff",
                      color: "#000",
                      "& .MuiListItemIcon-root": {
                        color: "#000",
                      },
                      "& .MuiListItemText-primary": {
                        color: "#000",
                      },
                    },
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <DashboardIcon
                      style={{ color: selectedIndex === 11 ? "#000" : "#fff" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedIndex === 1}
                  onClick={() => handleNavigation(1, "/AddNewBook")}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#fff",
                      color: "#000",
                      "& .MuiListItemIcon-root": {
                        color: "#000",
                      },
                      "& .MuiListItemText-primary": {
                        color: "#000",
                      },
                    },
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <AddCircleIcon
                      style={{ color: selectedIndex === 1 ? "#000" : "#fff" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Add New Book" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedIndex === 2}
                  onClick={() => handleNavigation(2, "/RentBook")}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#fff",
                      color: "#000",
                      "& .MuiListItemIcon-root": {
                        color: "#000",
                      },
                      "& .MuiListItemText-primary": {
                        color: "#000",
                      },
                    },
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <EditIcon
                      style={{ color: selectedIndex === 2 ? "#000" : "#fff" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Rent Book" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedIndex === 3}
                  onClick={() => handleNavigation(3, "/ShowBooks")}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#fff",
                      color: "#000",
                      "& .MuiListItemIcon-root": {
                        color: "#000",
                      },
                      "& .MuiListItemText-primary": {
                        color: "#000",
                      },
                    },
                    mb: 1,
                  }}
                >
                  <ListItemIcon>
                    <VisibilityIcon
                      style={{ color: selectedIndex === 3 ? "#000" : "#fff" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Display Books" />
                </ListItem>
                <ListItem
                  button
                  selected={selectedIndex === 4}
                  onClick={() => handleNavigation(4, "/bookUploadforRent")}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#fff",
                      color: "#000",
                      "& .MuiListItemIcon-root": {
                        color: "#000",
                      },
                      "& .MuiListItemText-primary": {
                        color: "#000",
                      },
                    },
                    mb: 2,
                  }}
                >
                  <ListItemIcon>
                    <BookIcon
                      style={{ color: selectedIndex === 4 ? "#000" : "#fff" }}
                    />
                  </ListItemIcon>
                  <ListItemText primary="Book Upload for Rent" />
                </ListItem>
                <Divider sx={{ borderBottom: "2px solid #fff", mb: 1 }} />
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
