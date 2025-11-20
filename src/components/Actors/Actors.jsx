import React, { useState } from 'react';
import { Box, Button, ButtonGroup, CircularProgress, Grid, Modal, Typography } from '@mui/material';
import { Movie as MovieIcon, Language, ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useGetMoviesQuery, useGetActorQuery } from '../../services/TMDB';

import { MovieList, Pagination } from '..';

import useStyles from './styles';

function MovieInformation() {
  const { id } = useParams();
  const { data, isFetching, error } = useGetActorQuery(id);
  const [page, setPage] = useState(1);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { data: movies, isFetching: isMoviesFetching } = useGetMoviesQuery({ actorId: id, page });

  // console.log(data);

  const options = { weekday: 'narrow', year: 'numeric', month: 'long', day: 'numeric' };
  const birthdate = data?.birthday ? new Date(data.birthday) : null;

  const formattedBirthDate = birthdate?.toLocaleDateString('ja-JP', options);

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
          src={`https://image.tmdb.org/t/p/w500/${data?.profile_path}`}
          alt={data?.title}
        />
      </Grid>
      <Grid
        item
        container
        direction="column"
        lg={7}
        sx={{
          paddingLeft: { xs: 0, lg: '2rem' },
          paddingRight: { xs: 0, lg: '1rem' },
        }}
      >
        <Typography
          variant="h2"
          sx={{
            marginBottom: '1rem',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
          }}
          fontWeight="400"
        >
          {data?.name}
        </Typography>

        <Typography
          variant="h5"
          className={classes.birthdate}
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '1rem', sm: '1.25rem' },
          }}
        >
          Born: {formattedBirthDate}
        </Typography>

        <Typography
          className={classes.biography}
          sx={{
            lineHeight: 1.7,
            textAlign: { xs: 'left', md: 'justify' },
            marginTop: { xs: '1rem', md: '1.5rem' },
          }}
        >
          {data?.biography}
        </Typography>

        <Grid
          item
          container
          spacing={{ xs: 2, sm: 2 }}
          sx={{
            marginTop: { xs: '1.5rem', md: '2rem' },
          }}
        >
          <Grid item xs={12} sm={6}>
            <ButtonGroup
              size="medium"
              variant="outlined"
              fullWidth
              sx={{
                '& .MuiButton-root': {
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                },
              }}
            >
              <Button
                target="_blank"
                rel="noopener noreferrer"
                href={data?.homepage}
                endIcon={<Language />}
              >
                Website
              </Button>
              <Button
                target="_blank"
                rel="noopener noreferrer"
                href={`https://www.imdb.com/name/${data?.imdb_id}`}
                endIcon={<MovieIcon />}
              >
                IMDB
              </Button>
            </ButtonGroup>
          </Grid>

          <Grid item xs={12} sm={6}>
            <ButtonGroup
              size="medium"
              variant="outlined"
              fullWidth
            >
              <Button
                startIcon={<ArrowBack />}
                sx={{
                  borderColor: 'primary.main',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                }}
                component={Link}
                to="/"
                fullWidth
              >
                <Typography
                  color="inherit"
                  variant="subtitle2"
                >
                  Back
                </Typography>
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Grid>

      {isMoviesFetching ? (
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress size="8rem" />
        </Box>
      ) : (
        <Box marginTop="5rem" width="100%">
          <Typography variant="h3" gutterBottom align="center" cx={{ fontWeight: '300' }}>
            Starred Movies
          </Typography>
          {movies
            ? (
              <>
                <MovieList movies={movies} numberOfMovies={12} />
                {console.log(page, movies)}
                <Pagination currentPage={page} setPage={setPage} totalPages={movies.total_pages} />
              </>
            )
            : <Box>Sorry, nothing was found.</Box>}
        </Box>
      )}
    </Grid>
  );
}

export default MovieInformation;
