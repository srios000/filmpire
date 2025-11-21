import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Typography } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { userSelector } from '../../features/auth';
import { useGetListQuery } from '../../services/TMDB';
import RatedCards from '../RatedCards/RatedCards';

// Get access to profile name or id from redux state
// display it in the profile component

function Profile() {
  // console.log('Profile');
  const { isAuthenticated, user } = useSelector(userSelector);
  const { data: favoriteMovies, refetch: refetchFavorites } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchlistMovies, refetch: refetchWatchlisted } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });

  useEffect(() => {
    refetchFavorites();
    refetchWatchlisted();
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h4" gutterBottom>My Profile</Typography>
        {isAuthenticated && (
        <Button color="inherit" onClick={logout}>
          Logout &nbsp;<ExitToApp />
        </Button>
        )}
      </Box>
      {!favoriteMovies?.results?.length && !watchlistMovies?.results?.length
        ? <Typography variant="h5">Add favorites or watchlist some movies to see them here!</Typography>
        : (
          <Box>
            <RatedCards title="Favorite Movies" data={favoriteMovies} />
            <RatedCards title="Watchlist" data={watchlistMovies} />
          </Box>
        )}
    </Box>
    // <div>
    //   {isAuthenticated ? <div>Profile - {user.username}</div> : <div>Profile - not logged in</div>}
    // </div>
  );
}

export default Profile;
