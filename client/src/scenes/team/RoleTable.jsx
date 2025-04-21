// src/components/Authentication/RoleTable.jsx

import React from "react";
import { Box, Button, Table, TableHead, TableBody, TableRow, TableCell, TableContainer } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch } from "react-redux";
import { deleteRole } from "../../redux/slices/rolesSlice";  // Assuming you have a slice for roles

const RoleTable = ({ data = [], handleEdit }) => {  // Defaulting data to an empty array if undefined

  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteRole(id));
  };

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Role Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.id}</TableCell>
              <TableCell>{role.role_name}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(role)}>
                  <EditIcon /> Edit
                </Button>
                <Button onClick={() => handleDelete(role.id)}>
                  <DeleteIcon /> Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoleTable;
