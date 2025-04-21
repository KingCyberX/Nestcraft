// src/components/Authentication/RoleCreate.js

import React, { useState } from "react";
import { Box, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useDispatch } from "react-redux";
import { createRole } from "../../redux/slices/rolesSlice";

const RoleCreate = ({ show, handleClose }) => {
  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    const roleData = { roleName, description };
    await dispatch(createRole(roleData)); // Assuming the createRole action is set up
    handleClose(); // Close the modal after role creation
  };

  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>Create Role</DialogTitle>
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
        <Button onClick={handleSubmit}>Create Role</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RoleCreate;
