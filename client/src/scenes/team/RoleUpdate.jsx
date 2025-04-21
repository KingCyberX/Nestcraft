// src/components/Authentication/RoleUpdate.js

import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateRole } from "../../redux/slices/rolesSlice"; // You would need to create this updateRole action

const RoleUpdate = ({ roleToEdit, handleClose }) => {
  const [roleName, setRoleName] = useState(roleToEdit?.role_name || "");
  const [description, setDescription] = useState(roleToEdit?.description || "");
  const dispatch = useDispatch();

  useEffect(() => {
    setRoleName(roleToEdit?.role_name || "");
    setDescription(roleToEdit?.description || "");
  }, [roleToEdit]);

  const handleSubmit = async () => {
    const updatedRoleData = { roleName, description };
    await dispatch(updateRole({ id: roleToEdit.id, updatedRoleData })); // Assuming the updateRole action is set up
    handleClose(); // Close the modal after role update
  };

  return (
    <Dialog open={Boolean(roleToEdit)} onClose={handleClose}>
      <DialogTitle>Update Role</DialogTitle>
      <DialogContent>
        <Box>
          <TextField
            label="Role Name"
            fullWidth
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Update Role</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleUpdate;
