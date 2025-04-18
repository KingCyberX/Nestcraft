
import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button, TextField } from "@mui/material";
import { Header } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from '../../redux/slices/authSlice';
import { fetchRoles } from "../../redux/slices/rolesSlice";
import { tokens } from "../../theme";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal"; // Import the new EditUserModal component
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTable, useSortBy, usePagination, useFilters } from "react-table";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const { data: users, loading, error } = useSelector((state) => state.users);
  const { roles } = useSelector((state) => state.roles);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit modal
  const [userToEdit, setUserToEdit] = useState(null); // State to store the user to edit
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  useEffect(() => {
    dispatch(loginUser());
    dispatch(fetchRoles());
  }, [dispatch]);

  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role_name",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <Box display="flex" justifyContent="space-around" gap="10px">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => handleEdit(row.original)} // Pass the full user object
              sx={{ textTransform: "none", padding: "6px 12px" }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(row.original.id)}
              sx={{ textTransform: "none", padding: "6px 12px" }}
            >
              Delete
            </Button>
          </Box>
        ),
      },
    ],
    []
  );

  const data = React.useMemo(
    () =>
      users
        .filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role_name: user.role_name || "No Role",
        })),
    [users, searchQuery]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const handleEdit = (user) => {
    setUserToEdit(user); // Set the user to edit
    setShowEditModal(true); // Open the Edit modal
  };

 const handleDelete = (id) => {
  const token = localStorage.getItem("authToken");

  fetch(`http://localhost:5000/auth/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // 🔐 Ensure this line sends token
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Delete response:", data);
      if (data.message) {
        alert("User deleted successfully");
        // Refresh or remove from UI
      } else {
        alert(data.error || "Delete failed");
      }
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
    });
};


  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box m="20px">
      <Header
        title="Authentication & Management"
        subtitle="Managing the Team Members"
      />
      <Button
        variant="contained"
        style={{ backgroundColor: colors.greenAccent[500] }}
        onClick={() => setShowModal(true)}
        sx={{ marginBottom: "20px" }}
      >
        Add User
      </Button>

      <Box mt="20px" mb="20px" display="flex" justifyContent="center">
        <TextField
          variant="outlined"
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ width: "250px", marginBottom: "20px" }}
        />
      </Box>

      <Box mt="40px" sx={{ overflowX: "auto" }}>
        <table
          {...getTableProps()}
          style={{
            width: "100%",
            borderCollapse: "collapse",
            backgroundColor: colors.primary[400],
          }}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    style={{
                      borderBottom: "2px solid #000",
                      padding: "12px",
                      backgroundColor: colors.blueAccent[700],
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  style={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: colors.primary[500] },
                  }}
                >
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #ccc",
                        textAlign: "center",
                      }}
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Box>

      <Box
        mt="20px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        <Box>
          <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </Button>
          <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Previous
          </Button>
          <Button onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </Button>
          <Button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </Button>
        </Box>

        <Box display="flex" alignItems="center">
          <Typography variant="body2" sx={{ marginRight: "10px" }}>
            Page {pageIndex + 1} of {pageOptions.length}
          </Typography>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={{ padding: "6px 12px", borderRadius: "4px" }}
          >
            {[10, 20, 30, 40].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </Box>
      </Box>

      {/* Add the EditUserModal */}
      <EditUserModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        userToEdit={userToEdit}
        roles={roles}
      />

      <AddUserModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        roles={roles}
      />
    </Box>
  );
};

export default Team;
