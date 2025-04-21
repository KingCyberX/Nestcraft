import React, { useEffect, useState } from "react";
import { Box, Button, Typography, TextField, useTheme, Switch, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPermissions,
  createPermission,
  removeAssignedPermission,
  assignPermissionToRole,
  updateAssignedPermissionOfRole,
  fetchPermissionsForRole,
} from "../../redux/slices/permissionsSlice";
import { fetchRoles } from "../../redux/slices/rolesSlice";
import { tokens } from "../../theme";
import { constrainPoint } from "@fullcalendar/core/internal";

const PermissionsPage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { permissions, loading, error, rolePermissions } = useSelector((state) => state.permissions); // Get rolePermissions from Redux
  const { roles } = useSelector((state) => state.roles); // Get roles from Redux
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPermission, setNewPermission] = useState("");
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  const safePermissions = Array.isArray(permissions) ? permissions : [];
  const safeRoles = Array.isArray(roles) ? roles : [];
  const safeRolePermissions = Array.isArray(rolePermissions) ? rolePermissions : []; // Ensure rolePermissions is an array

  const handleCreate = () => {
    if (!newPermission) {
      alert("Permission name cannot be empty!");
      return;
    }
    dispatch(createPermission({ permissionData: { name: newPermission }}));
    setNewPermission("");
    setShowCreateForm(false);
  };

  const handleAssignPermission = (roleId, permissionId) => {
    dispatch(assignPermissionToRole({ roleId, permissionId }));
  };

  const handleOpenAssignDialog = (roleId) => {
    console.log(safeRolePermissions); // Debugging line to check rolePermissions
    console.log(rolePermissions); // Debugging line to check rolePermissions
    dispatch(fetchPermissionsForRole(roleId)); // Fetch permissions for the selected role
    setSelectedRoleId(roleId);
    setOpenAssignDialog(true);
  };

  const handleTogglePermission = (permissionId, currentStatus) => {
    dispatch(updateAssignedPermissionOfRole({
      roleId: selectedRoleId,
      permissionId,
      is_assigned: !currentStatus,
    }));
  };

  const handleSaveAssignments = () => {
    const updatedPermissions = safeRolePermissions.map((perm) => ({
      permission_id: perm.id,
      is_assigned: perm.is_assigned ? 1 : 0, // Convert boolean to 1/0
    }));
    dispatch(updateAssignedPermissionOfRole({ roleId: selectedRoleId, permissions: updatedPermissions }));
    setOpenAssignDialog(false); // Close the dialog after saving
  };

  const permissionColumns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "permission_name", headerName: "Permission Name", flex: 1 },
    {
      field: "roles_assigned",
      headerName: "Assigned to Roles",
      renderCell: (params) => {
        const assignedRolesCount = safeRoles.filter(role => role.permissions && role.permissions.includes(params.row.id)).length;
        return <Typography>{assignedRolesCount} Roles</Typography>;
      },
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-around" gap="10px">
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleOpenRemoveDialog(params.row)}
          >
            Remove
          </Button>
        </Box>
      ),
      flex: 1,
    },
  ];

  const roleColumns = [
    { field: "id", headerName: "Role ID", flex: 0.5 },
    { field: "role_name", headerName: "Role Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <Box display="flex" justifyContent="space-around" gap="10px">
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleOpenAssignDialog(params.row.id)}
          >
            Assign
          </Button>
        </Box>
      ),
      flex: 1,
    },
  ];

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box m="20px">
      <Typography variant="h4" gutterBottom>
        Permissions Management
      </Typography>

      <Button
        variant="contained"
        onClick={() => setShowCreateForm(true)}
        sx={{ marginBottom: "20px", backgroundColor: colors.greenAccent[500] }}
      >
        Create Permission
      </Button>

      {showCreateForm && (
        <Box>
          <TextField
            label="New Permission"
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            variant="outlined"
            fullWidth
          />
          <Button onClick={handleCreate}>Submit</Button>
        </Box>
      )}

      <Box mt="20px">
        <Typography variant="h6">Permissions List</Typography>
        <DataGrid
          rows={safePermissions || []}
          columns={permissionColumns}
          components={{ Toolbar: GridToolbar }}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      <Box mt="20px">
        <Typography variant="h6">Assign Permissions to Roles</Typography>
        <DataGrid
          rows={safeRoles || []}
          columns={roleColumns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Box>

      {/* Dialog for Assigning Permissions */}
      <Dialog
        open={openAssignDialog}
        onClose={() => setOpenAssignDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign Permissions to Role</DialogTitle>
        <DialogContent>
          {safeRolePermissions.map((perm) => (
            <Box key={perm.id} display="flex" justifyContent="space-between" alignItems="center">
              <Typography>{perm.permission_name}</Typography>
              <Switch
                checked={perm.is_assigned}
                onChange={() => handleTogglePermission(perm.id, perm.is_assigned)}
                color="primary"
              />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAssignDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveAssignments} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PermissionsPage;
