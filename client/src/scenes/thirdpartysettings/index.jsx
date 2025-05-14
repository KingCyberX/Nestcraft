import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Avatar,
  useTheme,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
    RadioGroup,Checkbox,
FormControlLabel,Radio
} from "@mui/material";
import { useDispatch ,useSelector} from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import {
  fetchAllApps,
  updateAppThunk,
  createAppThunk,
  deleteAppThunk,
} from "../../redux/slices/userAppsSlice";
import {
  getallusers
} from "../../redux/slices/userSlice";
import {fetchAppAssignedTier,assignTiersToApp,
  fetchAllTiers,
  createTierThunk,
  updateTierThunk,
  deleteTierThunk,fetchUserTier,
  assignUserTier,
} from "../../redux/slices/userTierSlice"; 
import { tokens } from "../../theme";

const initialFormState = {
  id: null,
  app_name: "",
  auth_token: "",
  app_url: "",
  image_url: "",
  description: "",
};

const ThirdPartySettings = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);

const [assignDialogOpen, setAssignDialogOpen] = useState(false);
const [selectedApp, setSelectedApp] = useState(null);
const [tierAssignments, setTierAssignments] = useState({});

  useEffect(() => {
    dispatch(fetchAllApps())
      .unwrap()
      .then((data) => {
        const mappedApps = (data.apps || data).map((app) => ({
          ...app,
          id: app.id || app.appId,
        }));
        setApps(mappedApps);
        setLoading(false);
      })
      .catch((err) => {
        setError(err || "Failed to load apps");
        setLoading(false);
      });
      dispatch(fetchAllTiers())
    .unwrap()
    .then((data) => {
      const mapped = (data.tiers || data).map((tier) => ({
        ...tier,
        id: tier.id,
      }));
      setTiers(mapped);
    })
    .catch((err) => {
      console.error("Tier load failed", err);
    });

    dispatch(getallusers());
  }, [dispatch]);

const handleOpenAssignDialog = (app) => {
  setSelectedApp(app.id);
 dispatch(fetchAppAssignedTier(app.id))
  .unwrap()
  .then((res) => {
    console.log("API response:", res);  // Check if `res.assignedTiers` is correctly populated
    const assignedTierIds = res?.assignedTiers || [];
    const assignments = {};

    tiers.forEach((tier) => {
      assignments[tier.id] = assignedTierIds.includes(tier.id);
    });

    setTierAssignments(assignments);
    setAssignDialogOpen(true);
  })
  .catch((err) => {
    console.error("Error fetching assigned tiers:", err);
  });


};



const handleCheckboxChange = (tierId) => {
  setTierAssignments((prev) => ({
    ...prev,
    [tierId]: !prev[tierId],
  }));
};
const handleAssignSubmit = () => {
  const selectedTiers = Object.keys(tierAssignments).filter(
    (id) => tierAssignments[id]
  );
  dispatch(assignTiersToApp({ appId: selectedApp, tierIds: selectedTiers }));
  setAssignDialogOpen(false);
};

  const handleOpenApp = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCreateApp = () => {
    setFormData(initialFormState);
    setErrors({});
    setOpenDialog(true);
  };

  const handleEditApp = (app) => {
    setFormData(app);
    setErrors({});
    setOpenDialog(true);
  };

const handleDeleteApp = (app) => {
  setAppToDelete(app);
  setOpenDeleteDialog(true);
};
const confirmDeleteApp = () => {
  if (!appToDelete) return;

  setSubmitError(null);

  dispatch(deleteAppThunk(appToDelete.id))
    .unwrap()
    .then(() => {
      setApps((prev) => prev.filter((app) => app.id !== appToDelete.id));
    })
    .catch((err) => {
      setSubmitError(err?.message || "Failed to delete the app");
    })
    .finally(() => {
      // Close dialog in both success and failure
      setOpenDeleteDialog(false);
      setAppToDelete(null);
    });
};



  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormState);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.app_name.trim()) newErrors.app_name = "App Name is required";
    if (!formData.auth_token.trim()) newErrors.auth_token = "Auth Token is required";
    if (!formData.app_url.trim()) newErrors.app_url = "App URL is required";
    if (!formData.image_url.trim()) newErrors.image_url = "Image URL is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
const handleSubmit = () => {
  setSubmitError(null); // Reset previous errors

  if (!validate()) return;

  if (formData.id) {
    dispatch(updateAppThunk(formData))
      .unwrap()
      .then((updatedApp) => {
        setApps((prev) =>
          prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
        );
        handleCloseDialog();
      })
      .catch((err) => setSubmitError(err?.message || "Failed to update app"));
  } else {
    dispatch(createAppThunk(formData))
      .unwrap()
      .then((newApp) => {
        setApps((prev) => [...prev, newApp]);
        handleCloseDialog();
      })
      .catch((err) => setSubmitError(err?.message || "Failed to create app"));
  }
};


  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "app_name", headerName: "App Name", flex: 1 },
    {
      field: "image_url",
      headerName: "Logo",
      flex: 0.5,
      renderCell: (params) => (
        <Avatar src={params.row.image_url} alt={params.row.app_name} />
      ),
    },
    { field: "auth_token", headerName: "Auth Token", flex: 1.5 },
    { field: "description", headerName: "Description", flex: 2 },
    {
      field: "app_url",
      headerName: "Open App",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleOpenApp(params.row.app_url)}
        >
          Open
        </Button>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.7,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEditApp(params.row)}
        >
          Edit
        </Button>
      ),
    },{
    field: "assign",
    headerName: "Assign",
    flex: 0.7,
    renderCell: (params) => (
      <Button
        variant="contained"
        onClick={() => handleOpenAssignDialog(params.row)}
      >
        Assign
      </Button>
    ),
  },
    {
     field: "delete",
  headerName: "Delete",
  flex: 0.7,
  renderCell: (params) => (
    <Button
      variant="contained"
      color="error"
      onClick={() => handleDeleteApp(params.row)}
    >
      Delete
    </Button>
  ),
    },
  ];
const [tiers, setTiers] = useState([]);
const [tierFormData, setTierFormData] = useState({ id: null, tier_name: "",tier_description: ""  });
const [tierErrors, setTierErrors] = useState({});
const [tierSubmitError, setTierSubmitError] = useState(null);
const [tierDialogOpen, setTierDialogOpen] = useState(false);
const [openTierDeleteDialog, setOpenTierDeleteDialog] = useState(false);
const [tierToDelete, setTierToDelete] = useState(null);

const handleOpenTierDialog = () => {
  setTierFormData({ id: null, tier_name: "" ,tier_description: "" });
  setTierErrors({});
  setTierDialogOpen(true);
};

const handleCloseTierDialog = () => {
  setTierDialogOpen(false);
  setTierFormData({ id: null, tier_name: "",tier_description: ""  });
};

const handleCreateTier = () => {
  setTierFormData({ id: null, tier_name: "",tier_description: "" });
  setTierErrors({});
  setTierDialogOpen(true);
};

const handleEditTier = (tier) => {
  setTierFormData(tier);
  setTierErrors({});
  setTierDialogOpen(true); // ✅ fixed from setOpenTierDialog
};

const handleDeleteTier = (tier) => {
  setTierToDelete(tier);
  setOpenTierDeleteDialog(true);
};

const confirmDeleteTier = () => {
  if (!tierToDelete) return;

  dispatch(deleteTierThunk(tierToDelete.id))
    .unwrap()
    .then(() => {
      setTiers((prev) => prev.filter((t) => t.id !== tierToDelete.id));
    })
    .catch((err) => setTierSubmitError(err?.message || "Delete failed"))
    .finally(() => {
      setOpenTierDeleteDialog(false);
      setTierToDelete(null);
    });
};

const validateTier = () => {
  const errs = {};
  if (!tierFormData.tier_name.trim()) errs.tier_name = "Tier name is required";
  setTierErrors(errs);
  return Object.keys(errs).length === 0;
};

const handleTierSubmit = () => {
  if (!validateTier()) return;

  const action = tierFormData.id
    ? updateTierThunk(tierFormData)
    : createTierThunk(tierFormData);

  dispatch(action)
    .unwrap()
    .then((res) => {
      setTiers((prev) =>
        tierFormData.id
          ? prev.map((t) => (t.id === res.id ? res : t))
          : [...prev, res]
      );
      setTierDialogOpen(false);
      setTierFormData({ id: null, tier_name: "" });
    })
    .catch((err) =>
      setTierSubmitError(err?.message || "Failed to save tier")
    );
};

const handleTierInputChange = (e) => {
  setTierFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
};


// Redux state for user tiers
  const users = useSelector((state) => state.users.users);
  const usersloading = useSelector((state) => state.users.loading);
  const userserror = useSelector((state) => state.users.error);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTierId, setSelectedTierId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
const [assignError, setAssignError] = useState(null);

  useEffect(() => {
    //dispatch(fetchUsers());
    dispatch(fetchAllTiers());
  }, [dispatch]);

  const openTierDialog = (user) => {
   setSelectedUser(user);
  setSelectedTierId(null); // or keep previously selected tier if you want
  setDialogOpen(true);
  };

  const handleTierChange = (e) => {
    setSelectedTierId(e.target.value);
  };

  const handleAssignTier = () => {
  if (!selectedTierId) {
    setAssignError("Please select a tier before assigning.");
    return;
  }

  // Proceed to dispatch the assignment
  dispatch(assignUserTier({ userId: selectedUser.id, tierId: selectedTierId }))
    .unwrap()
    .then(() => {
      setDialogOpen(false);
      setAssignError(null);
    })
    .catch((err) => {
      setAssignError(err?.message || "Failed to assign tier.");
    });
};


  const userColumns = [
    { field: 'id', headerName: 'User ID', flex: 1 },
    { field: 'name', headerName: 'Name', flex: 2 },
    { field: 'tier_name', headerName: 'Tier_Name', flex: 2 },
    {
    field: 'assignTier',
    headerName: 'Assign Tier',
    flex: 1,
    sortable: false,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => openTierDialog(params.row)}>
          Assign Tier
        </Button>
      ),
    },
  ];

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (<>
     <Box m={4}>
    <Stack direction="row" justifyContent="space-between" mb={2}>
      <Typography variant="h4">Third-Party Applications</Typography>
      <Button variant="contained" color="success" onClick={handleCreateApp}>
        Create New App
      </Button>
    </Stack>

    {submitError && (
      <Typography color="error" mb={2}>
        {submitError}
      </Typography>
    )}

    <DataGrid
      rows={apps}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[5, 10, 25]}
      autoHeight
    />


      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{formData.id ? "Edit App" : "Create App"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField
              label="App Name"
              name="app_name"
              fullWidth
              value={formData.app_name}
              onChange={handleInputChange}
              error={!!errors.app_name}
              helperText={errors.app_name}
            />
            <TextField
              label="Auth Token"
              name="auth_token"
              fullWidth
              value={formData.auth_token}
              onChange={handleInputChange}
              error={!!errors.auth_token}
              helperText={errors.auth_token}
            />
            <TextField
              label="App URL"
              name="app_url"
              fullWidth
              value={formData.app_url}
              onChange={handleInputChange}
              error={!!errors.app_url}
              helperText={errors.app_url}
            />
            <TextField
              label="Image URL"
              name="image_url"
              fullWidth
              value={formData.image_url}
              onChange={handleInputChange}
              error={!!errors.image_url}
              helperText={errors.image_url}
            />
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              minRows={3}
              value={formData.description}
              onChange={handleInputChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {formData.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <Typography>
      Are you sure you want to delete{" "}
      <strong>{appToDelete?.app_name}</strong>?
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
    <Button onClick={confirmDeleteApp} variant="contained" color="error">
      Delete
    </Button>
  </DialogActions>
</Dialog>
<Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
  <DialogTitle>Assign Tiers to {selectedApp?.app_name}</DialogTitle>
  <DialogContent dividers>
    {tiers.map((tier) => (
      <FormControlLabel
        key={tier.id}
        control={
          <Checkbox
            checked={!!tierAssignments[tier.id]}
            onChange={() => handleCheckboxChange(tier.id)}
          />
        }
        label={tier.tier_name}
      />
    ))}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
    <Button onClick={handleAssignSubmit} variant="contained">
      Assign
    </Button>
  </DialogActions>
</Dialog>

    </Box>
    <Box m={4} mt={6}>
 <Stack direction="row" justifyContent="space-between" mt={4} mb={2}>
  <Typography variant="h4">Tier Management</Typography>
  <Button variant="contained" color="success" onClick={handleCreateTier}>
    Create New Tier
  </Button>
</Stack>

{tierSubmitError && (
  <Typography color="error" mb={2}>
    {tierSubmitError}
  </Typography>
)}

<DataGrid
  rows={tiers}
  columns={[
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "tier_name", headerName: "Tier Name", flex: 2 },
    { field: "tier_description", headerName: "Tier Description", flex: 2 },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.7,
      renderCell: (params) => (
        <Button variant="contained" onClick={() => handleEditTier(params.row)}>
          Edit
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.7,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDeleteTier(params.row)}
        >
          Delete
        </Button>
      ),
    },
  ]}
  pageSize={5}
  autoHeight
/>


  {/* Create/Edit Tier Dialog */}
  <Dialog open={tierDialogOpen} onClose={handleCloseTierDialog} maxWidth="sm" fullWidth>
    <DialogTitle>{tierFormData.id ? "Edit Tier" : "Create Tier"}</DialogTitle>
    <DialogContent dividers>
       <Stack spacing={2}>
      <TextField
        label="Tier Name"
        name="tier_name"
        fullWidth
        value={tierFormData.tier_name}
        onChange={handleTierInputChange}
        error={!!tierErrors.tier_name}
        helperText={tierErrors.tier_name}
      />
      <TextField
        label="Tier Description"
        name="tier_description"
        fullWidth
        value={tierFormData.tier_description}
        onChange={handleTierInputChange}
        error={!!tierErrors.tier_description}
        helperText={tierErrors.tier_description}
      /></Stack>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseTierDialog}>Cancel</Button>
      <Button onClick={handleTierSubmit} variant="contained">
        {tierFormData.id ? "Update" : "Create"}
      </Button>
    </DialogActions>
  </Dialog>

  {/* Confirm Delete Tier Dialog */}
  <Dialog open={openTierDeleteDialog} onClose={() => setOpenTierDeleteDialog(false)}>
    <DialogTitle>Confirm Delete</DialogTitle>
    <DialogContent>
      <Typography>
        Are you sure you want to delete tier <strong>{tierToDelete?.tier_name}</strong>?
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setOpenTierDeleteDialog(false)}>Cancel</Button>
      <Button onClick={confirmDeleteTier} variant="contained" color="error">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
</Box>
    {/* Assign Tiers to Users */}
  <Box m={4}>
      <Typography variant="h4" mb={2}>Assign Tiers to Users</Typography>
      {assignError && (
  <Typography color="error" mt={1}>
    {assignError}
  </Typography>
)}
      <DataGrid rows={users} columns={userColumns} autoHeight pageSize={5} />

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Assign Tier to {selectedUser?.name}</DialogTitle>
        <DialogContent>
          <RadioGroup value={selectedTierId} onChange={handleTierChange}>
            {tiers.map((tier) => (
              <FormControlLabel
                key={tier.id}
                value={tier.id}
                control={<Radio />}
                label={tier.tier_name}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignTier} variant="contained">Assign</Button>
        </DialogActions>
      </Dialog>
    </Box>
</>
  );
};

export default ThirdPartySettings;
