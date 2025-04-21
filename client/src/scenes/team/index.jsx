import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../../redux/slices/rolesSlice";
import { DataGrid, GridToolbar } from "@mui/x-data-grid"; // Import DataGrid
import { tokens } from "../../theme";
import RoleCreate from "./RoleCreate";
import RoleUpdate from "./RoleUpdate"; // Modal for editing roles

const RoleManagementPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles()); // Fetch roles from API or Redux
  }, [dispatch]);
  const { roles, loading, error } =  useSelector((state) => state.roles); // Get roles from Redux store
  const handleEdit = (role) => {
    setSelectedRole(role);
  };

  const handleCreate = () => {
    setShowCreateForm(true);
  };

  // Define columns for DataGrid
  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "role_name", headerName: "Role Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        return (
          <Box display="flex" justifyContent="space-around" gap="10px">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleEdit(params.row)} // Pass the selected role to edit
              sx={{ textTransform: "none", padding: "6px 12px" }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(params.row.id)} // Implement role delete logic
              sx={{ textTransform: "none", padding: "6px 12px" }}
            >
              Delete
            </Button>
          </Box>
        );
      },
      flex: 1,
    },
  ];

  const handleDelete = (id) => {
    // Implement role deletion logic here
    console.log(`Delete role with ID: ${id}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Role Management
      </Typography>

      <Button
        variant="contained"
        onClick={handleCreate}
        sx={{ marginBottom: "20px", backgroundColor: colors.greenAccent[500] }}
      >
        Create Role
      </Button>

      {showCreateForm && <RoleCreate />}

      <Box mt="20px" height="75vh" sx={{ maxWidth: "100%", overflow: "auto" }}>
        <DataGrid
          rows={roles || []} // Ensure the roles data is passed correctly (if roles is empty or undefined, pass an empty array)
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
          checkboxSelection
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiDataGrid-footerContainer": {
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.gray[100]} !important`,
            },
          }}
        />
      </Box>

      {selectedRole && <RoleUpdate roleToEdit={selectedRole} />}
    </Box>
  );
};

export default RoleManagementPage;
