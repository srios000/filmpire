import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Typography, Alert, Paper } from '@mui/material';
import { ExitToApp, AccountCircle, LockOutlined } from '@mui/icons-material';
import { userSelector } from '../../features/auth';
import { useGetListQuery } from '../../services/TMDB';
import RatedCards from '../RatedCards/RatedCards';
import { fetchToken } from '../../utils';

function Profile() {
  const { isAuthenticated, user } = useSelector(userSelector);
  const { data: favoriteMovies, refetch: refetchFavorites } = useGetListQuery(
    { listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 },
    { skip: !isAuthenticated },
  );
  const { data: watchlistMovies, refetch: refetchWatchlisted } = useGetListQuery(
    { listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 },
    { skip: !isAuthenticated },
  );

  useEffect(() => {
    if (isAuthenticated) {
      refetchFavorites();
      refetchWatchlisted();
    }
  }, [isAuthenticated, refetchFavorites, refetchWatchlisted]);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Unauthorized state
  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          maxWidth: 600,
          mx: 'auto',
          mt: 8,
          textAlign: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
          }}
        >
          <LockOutlined
            sx={{
              fontSize: 80,
              color: 'error.main',
              mb: 2,
            }}
          />

          <Alert
            severity="error"
            sx={{
              mb: 3,
              '& .MuiAlert-message': {
                width: '100%',
                textAlign: 'center',
              },
            }}
          >
            <Typography variant="h6" component="div" fontWeight="600">
              401 - Unauthorized
            </Typography>
            <Typography variant="body2">
              You need to be logged in to access your profile
            </Typography>
          </Alert>

          <Typography variant="h5" fontWeight="500" gutterBottom>
            Authentication Required
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Please log in to view your favorite movies, watchlist, and personalized recommendations.
          </Typography>

          <Button
            color="primary"
            variant="contained"
            size="large"
            onClick={fetchToken}
            startIcon={<AccountCircle />}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Paper>
      </Box>
    );
  }

  // Authenticated state
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          My Profile
        </Typography>
        <Button
          color="inherit"
          onClick={logout}
          startIcon={<ExitToApp />}
        >
          Logout
        </Button>
      </Box>

      {!favoriteMovies?.results?.length && !watchlistMovies?.results?.length ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body1">
            Add favorites or watchlist some movies to see them here!
          </Typography>
        </Alert>
      ) : (
        <Box>
          <RatedCards title="Favorite Movies" data={favoriteMovies} />
          <RatedCards title="Watchlist" data={watchlistMovies} />
        </Box>
      )}
    </Box>
  );
}

export default Profile;
