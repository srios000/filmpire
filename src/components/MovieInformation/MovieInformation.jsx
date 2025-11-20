import React, { useState } from 'react';
import { Box, Button, ButtonGroup, CircularProgress, Grid, Modal, Rating, Tooltip, Typography } from '@mui/material';
import { Movie as MovieIcon, Language, Theaters, FavoriteBorderOutlined, Favorite, Remove, PlusOne, ArrowBack, PlayArrow } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { MovieList } from '..';

import { useGetRecommendationsQuery, useGetMovieQuery } from '../../services/TMDB';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';

import useStyles from './styles';
import genreIcons from '../../assets/genres';

function MovieInformation() {
  const { id } = useParams();
  const { data, isFetching, error } = useGetMovieQuery(id);
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedVideoKey, setSelectedVideoKey] = useState('');

  const { data: recommentations, isFetching: isRecommendationsFetching } = useGetRecommendationsQuery({ list: 'recommendations', movie_id: id });

  const isMovieFavorited = false;
  const isMovieWatchlisted = true;

  const addToFavorites = () => {

  };
  const addToWatchlist = () => {

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

  if (error) {
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
        <Typography variant="h3" align="center" gutterBottom>{data?.title} ({data.release_date.split('-')[0]})</Typography>
        <Typography variant="h5" align="center" gutterBottom>{data?.tagline}</Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display="flex" align="center">
            <Tooltip disableTouchListener title={`${data.vote_average} / 10`}>
              <div>
                <Rating readOnly value={data.vote_average / 2} precision={0.1} />
              </div>
            </Tooltip>
            <Typography variant="subtitle1" gutterBottom style={{ marginLeft: '10px' }}>
              {roundedUpVoteAverage} / 10
            </Typography>
          </Box>
          <Typography variant="h6" align="center" gutterBottom>
            {data?.runtime}min / {data?.spoken_languages.length > 0 ? `${data?.spoken_languages[0].name}` : ''}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre, i) => (
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
                <Button onClick={addToFavorites} endIcon={isMovieFavorited ? <Favorite /> : <FavoriteBorderOutlined />}>
                  {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Button onClick={addToWatchlist} endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}>Watchlist</Button>
                <Button endIcon={<ArrowBack />} sx={{ borderColor: 'primary.main' }}>
                  <Typography style={{ textDecoration: 'none' }} component={Link} to="/" color="inherit" variant="subtitle2">
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
    </Grid>
  );
}

export default MovieInformation;
