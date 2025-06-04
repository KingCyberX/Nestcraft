import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppCard from '../../components/AppCard';
import { Toaster } from 'react-hot-toast';
import { fetchTierApps, addAppThunk,removeAppThunk, removeApp ,createauthtoken} from '../../redux/slices/userAppsSlice';
import {
  Container,
  Typography,
  Button,
  useTheme as useMuiTheme,
  CssBaseline,
  Box,
  Paper,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  ListItemText,
  Grid
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThirdPartyApps = () => {
  const dispatch = useDispatch();
  const userApps = useSelector((state) => state.userApps.apps); // get userApps from redux store
  const status = useSelector((state) => state.userApps.status);
  const error = useSelector((state) => state.userApps.error);
  useEffect(() => {
    try {

      //if (user.id) {
        dispatch(fetchTierApps(user.id));
      //}
    } catch (error) {
      console.error('Error parsing authToken from sessionStorage:', error);
    }
  }, [dispatch]);


  const muiTheme = useMuiTheme();
  const [themeMode, setThemeMode] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const [selectedAppId, setSelectedAppId] = useState('');
  const storedUser = sessionStorage.getItem('authToken');
  const user = storedUser ? JSON.parse(storedUser) : null;


  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleAddToList = async () => {
    if (!selectedAppId) return;

    const authToken = crypto.randomUUID();
    await new Promise((resolve) => setTimeout(resolve, 500));
    dispatch(addAppThunk({ userId:user.id, appId }));
    setSelectedAppId('');
  };

const handleOpenApp = async (appId) => {
  try {
    let a=userApps.find(app => app.appId === appId);
    const resultAction = await dispatch(createauthtoken({
      userId: user.id,
      app_name: a.appName
    }));
    if (createauthtoken.fulfilled.match(resultAction)) {
      const newAuthToken = resultAction.payload.authToken;
      const userApp = userApps.find(app => app.appId === appId);
      if (userApp) {
        const redirectUrl = `${userApp.appUrl}?authtoken=${newAuthToken}`;
        window.open(redirectUrl, '_blank');
      }
    } else {
      console.error('Failed to get auth token:', resultAction.payload || resultAction.error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};


  const handleRemoveApp = (appId) => {
    dispatch(removeAppThunk({ userId:user.id, appId }));
  };

const addedApps = Array.isArray(userApps) ? userApps.filter(app => app.is_added === false) : [];
const availableApps = Array.isArray(userApps) ? userApps.filter(app => app.is_added === true) : [];

  
  if (status === 'loading') {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box mt={4} textAlign="center">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Available Third-Party Apps
          </Typography>
          <Button
            variant="contained"
            startIcon={themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            onClick={toggleTheme}
          >
            {themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </Box>

        <Box mb={6}>
          <FormControl fullWidth>
            <InputLabel>Select App</InputLabel>
            <Select
              value={selectedAppId}
              label="Select App"
              onChange={(e) => setSelectedAppId(e.target.value)}
            >
              {availableApps.map((app) => (
                <MenuItem key={app.appId} value={app.appId}>
                  <ListItemText
                    primary={app.appName}
                    secondary={app.description}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box mt={2} textAlign="right">
            <Button
              variant="contained"
              disabled={!selectedAppId}
              onClick={handleAddToList}
            >
              Add
            </Button>
          </Box>
        </Box>

        <Box>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Allocated Tier Apps <b>{ userApps[0]?.tier_name?? ''}</b>
          </Typography>
          <Grid container spacing={3}>
            {addedApps.length > 0 ? (
              addedApps.map((userApp) => (
                <Grid item xs={12} sm={6} md={4} key={userApp.authToken}>
                  <Box className="card-wrapper">
                    <AppCard
                      app={userApp}
                      theme={themeMode}
                      isInUserList={true}
                      onOpenApp={handleOpenApp}
                    />
                    {/* <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveApp(userApp.appId)}
                      sx={{ marginTop: 2 }}
                    >
                      Remove
                    </Button> */}
                  </Box>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1" color="textSecondary">
                    No apps added to your list yet.
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
      <Toaster position="top-right" />
    </>
  );
};

export default ThirdPartyApps;
