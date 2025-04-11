import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/features/usersSlice"; // Assuming you have an updateUser action in your slice

const EditUserModal = ({ show, handleClose, userToEdit, roles }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name);
      setEmail(userToEdit.email);
      setRoleId(userToEdit.role_id || ""); // Default role is empty if no role
    }
  }, [userToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password || !roleId) {
      alert("All fields are required.");
      return;
    }

    // Dispatch the update action
    dispatch(
      updateUser({ id: userToEdit.id, name, email, password, role_id: roleId })
    );

    handleClose(); // Close modal after submit
  };

  return (
    <Modal open={show} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          backgroundColor: "white",
          padding: 3,
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">Edit User</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              label="Role"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.role_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Save Changes
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
