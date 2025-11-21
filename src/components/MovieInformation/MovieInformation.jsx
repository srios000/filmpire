import React, { useEffect, useState } from 'react';
import { Box, Button, ButtonGroup, CircularProgress, Grid, Modal, Rating, Snackbar, Alert, Tooltip, Typography } from '@mui/material';
import { Movie as MovieIcon, Language, Theaters, FavoriteBorderOutlined, Favorite, Remove, PlusOne, ArrowBack, PlayArrow } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import MovieList from '../MovieList/MovieList';

import { useGetRecommendationsQuery, useGetMovieQuery, useGetListQuery } from '../../services/TMDB';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { userSelector } from '../../features/auth';

import useStyles from './styles';
import genreIcons from '../../assets/genres';

function MovieInformation() {
  const { isAuthenticated, user } = useSelector(userSelector);
  const { id } = useParams();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { data, isFetching, error: movieFetchError } = useGetMovieQuery(id);
  const { data: recommentations, isFetching: isRecommendationsFetching } = useGetRecommendationsQuery({ list: 'recommendations', movieId: id });
  const { data: favoriteMovies } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchlistMovies } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });

  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchUserRating = async () => {
      if (isAuthenticated) {
        try {
          const { data: accountStates } = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}/account_states?api_key=${import.meta.env.VITE_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`,
          );
          if (accountStates.rated) {
            setUserRating(accountStates.rated.value);
          }
        } catch (error) {
          showSnackbar('Failed to fetch user rating', 'error');
        }
      }
    };

    fetchUserRating();
  }, [id, isAuthenticated]);

  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieWatchlisted(!!watchlistMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchlistMovies, data]);

  const addToFavorites = async () => {
    try {
      await axios.post(`https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${import.meta.env.VITE_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
        media_type: 'movie',
        media_id: id,
        favorite: !isMovieFavorited,
      });
      setIsMovieFavorited((prev) => !prev);
      showSnackbar(isMovieFavorited ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
      showSnackbar('Failed to update favorites', 'error');
    }
  };

  const addToWatchlist = async () => {
    try {
      await axios.post(`https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${import.meta.env.VITE_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`, {
        media_type: 'movie',
        media_id: id,
        watchlist: !isMovieWatchlisted,
      });
      setIsMovieWatchlisted((prev) => !prev);
      showSnackbar(isMovieWatchlisted ? 'Removed from watchlist' : 'Added to watchlist');
    } catch (error) {
      showSnackbar('Failed to update watchlist', 'error');
    }
  };

  const addRating = async (value) => {
    try {
      await axios.post(
        `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${import.meta.env.VITE_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`,
        {
          value,
        },
      );
      setUserRating(value);
      showSnackbar('Rating added successfully');
    } catch (error) {
      showSnackbar('Failed to add rating', 'error');
    }
  };

  const deleteRating = async () => {
    try {
      await axios.delete(
        `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${import.meta.env.VITE_TMDB_KEY}&session_id=${localStorage.getItem('session_id')}`,
      );
      setUserRating(0);
      showSnackbar('Rating removed successfully');
    } catch (error) {
      showSnackbar('Failed to remove rating', 'error');
    }
  };

  const handleVideoClick = (videoKey) => {
    setSelectedVideoKey(videoKey);
    setOpen(true);
  };

  const roundedUpVoteAverage = data?.vote_average.toFixed(1);

  if (isFetching) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size="8rem" />
      </Box>
    );
  }

  if (movieFetchError) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Link to="/">Something has gone wrong.<br />Go back!</Link>
      </Box>
    );
  }

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4}>
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title}
        />
      </Grid>
      <Grid item container direction="column" lg={7}>
        <Typography variant="h3" align="center" gutterBottom sx={{ marginTop: { sm: '1rem', md: '2rem' } }}>{data?.title} ({data.release_date.split('-')[0]})</Typography>
        <Typography variant="h5" align="center" gutterBottom>{data?.tagline}</Typography>

        <Grid item className={classes.ratingContainer}>
          <Box className={classes.tmdbRatingBox}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              TMDB Rating
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Tooltip disableTouchListener title={`${data.vote_average} / 10`}>
                <div>
                  <Rating readOnly value={data.vote_average / 2} precision={0.1} size="small" />
                </div>
              </Tooltip>
              <Typography variant="body2" fontWeight="bold">
                {roundedUpVoteAverage} / 10
              </Typography>
            </Box>
          </Box>

          {isAuthenticated && (
            <Box className={classes.userRatingBox}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Your Rating
              </Typography>
              <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                <Rating
                  value={userRating / 2}
                  precision={0.5}
                  size="small"
                  onChange={(event, newValue) => {
                    if (newValue) {
                      addRating(newValue * 2);
                    }
                  }}
                />
                {userRating > 0 && (
                  <>
                    <Typography variant="body2" fontWeight="bold">
                      {userRating.toFixed(1)} / 10
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={deleteRating}
                      sx={{ fontSize: '0.7rem', padding: '2px 8px' }}
                    >
                      Remove
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Grid>

        <Typography variant="h6" align="center" gutterBottom style={{ marginTop: '16px' }}>
          {data?.runtime}min | Language: {data?.spoken_languages[0].name}
        </Typography>

        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre) => (
            <Link
              key={genre.name}
              className={classes.links}
              to="/"
              onClick={() => dispatch(selectGenreOrCategory(genre.id))}
            >
              <Tooltip disableTouchListener title={`${genre?.name}`}>
                <img src={genreIcons[genre.name.toLowerCase()]} className={classes.genreImage} height={30} />
              </Tooltip>
            </Link>
          ))}
        </Grid>
        <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.overview}
        </Typography>
        <Typography variant="h5" gutterBottom>
          Top Cast
        </Typography>
        <Grid item container spacing={2}>
          {data && data.credits?.cast?.map((character, i) => (
            character.profile_path && (
              <Grid key={i} item xs={4} md={2} component={Link} to={`/actors/${character.id}`} style={{ textDecoration: 'none' }}>
                <img className={classes.castImage} src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`} alt={character.name} />
                <Typography color="textPrimary">{character?.name}</Typography>
                <Typography color="textSecondary">{character?.character.split('/')[0]}</Typography>
              </Grid>
            )
          )).slice(0, 6)}
        </Grid>
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                <Button target="_blank" rel="noopener noreferrer" href={data?.homepage} endIcon={<Language />}>Website</Button>
                <Button target="_blank" rel="noopener noreferrer" href={`https://www.imdb.com/title/${data?.imdb_id}`} endIcon={<MovieIcon />}>IMDB</Button>
                <Button onClick={() => handleVideoClick(data?.videos?.results?.[0]?.key)} endIcon={<Theaters />}>Trailer</Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size="medium" variant="outlined">
                {isAuthenticated && (
                <>
                  <Button onClick={addToFavorites} endIcon={isMovieFavorited ? <Favorite /> : <FavoriteBorderOutlined />}>
                    {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                  </Button>
                  <Button onClick={addToWatchlist} endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}>Watchlist</Button>
                </>
                )}
                <Button component={Link} to="/" endIcon={<ArrowBack />} sx={{ borderColor: 'primary.main' }}>
                  <Typography style={{ textDecoration: 'none' }} color="inherit" variant="subtitle2">
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>

      {data?.videos?.results?.length > 0 && (
        <Box marginTop="5rem" width="100%">
          <Typography variant="h3" gutterBottom align="center">
            Videos
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {data.videos.results.slice(0, 6).map((video, index) => (
              <Grid item xs={12} sm={6} md={4} key={video.id || index}>
                <Box
                  className={classes.videoThumbnailContainer}
                  onClick={() => handleVideoClick(video.key)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                    alt={video.name}
                    className={classes.videoThumbnail}
                  />
                  <Box className={`${classes.playOverlay} play-overlay`}>
                    <PlayArrow sx={{ fontSize: 64, color: 'white' }} />
                  </Box>
                  <Typography variant="subtitle1" align="center" style={{ marginTop: '8px' }}>
                    {video.name}
                  </Typography>
                  <Typography variant="caption" align="center" color="textSecondary" display="block">
                    {video.type}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {isRecommendationsFetching ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size="8rem" />
        </Box>
      ) : (
        <Box marginTop="5rem" width="100%">
          <Typography variant="h3" gutterBottom align="center">
            You might also like
          </Typography>
          {recommentations
            ? <MovieList movies={recommentations} numberOfMovies={12} />
            : <Box>Sorry, nothing was found.</Box>}
        </Box>
      )}

      {selectedVideoKey && (
        <Modal
          closeAfterTransition
          className={classes.modal}
          open={open}
          onClose={() => setOpen(false)}
        >
          <iframe
            autoPlay
            className={classes.video}
            title="Video"
            src={`https://www.youtube.com/embed/${selectedVideoKey}`}
            allow="autoplay"
          />
        </Modal>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}

export default MovieInformation;
