import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { registerUser } from '../../redux/slices/authSlice';
const AddUserModal = ({ show, handleClose, roles }) => {
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [role, setRole] = useState(2); // Default to 'user' role
  const [password, setPassword] = useState(""); // State for password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
const handleSubmit = (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    console.log("Passwords do not match");
    return; // Prevent form submission if passwords do not match
  }

  console.log("Form Submitted");
  console.log("Role ID:", role);
  console.log("Name:", userName);
  console.log("Email:", userEmail);
  console.log("Password:", password);
  console.log("Confirm Password:", confirmPassword);

  // Dispatch the addUser action with the password included
  dispatch(
    registerUser({
      name: userName,
      email: userEmail,
      role_id: parseInt(role), // Parse role_id to ensure it's a number
      password: password, // Pass the password along
    })
  );
  handleClose(); // Close modal after submit
};

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUserName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter user name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formUserEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Control
              as="select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.role_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add User
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUserModal;
