import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setPage } from '../../features/currentGenreOrCategory';
import useStyles from './styles';

function Pagination({ currentPage, totalPages }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const maxPages = Math.min(totalPages, 500);

  const handleFirst = () => dispatch(setPage(1));
  const handleLast = () => dispatch(setPage(maxPages));
  const handlePrev = () => dispatch(setPage(Math.max(1, currentPage - 1)));
  const handleNext = () => dispatch(setPage(Math.min(maxPages, currentPage + 1)));
  const handlePageClick = (page) => dispatch(setPage(page));

  if (maxPages === 0) return null;

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;

    if (maxPages <= showPages + 2) {
      for (let i = 1; i <= maxPages; i += 1) {
        pages.push(i);
      }
    } else {
      pages.push(1, 2);

      const start = Math.max(3, currentPage - 1);
      const end = Math.min(maxPages - 2, currentPage + 1);

      if (start > 3) {
        pages.push('...');
      }

      for (let i = start; i <= end; i += 1) {
        if (i > 2 && i < maxPages - 1) {
          pages.push(i);
        }
      }

      if (end < maxPages - 2) {
        pages.push('...');
      }

      pages.push(maxPages - 1, maxPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Box className={classes.container}>
      <Button
        onClick={handleFirst}
        disabled={currentPage === 1}
        className={classes.button}
        variant="contained"
        color="primary"
        type="button"
      >
        First
      </Button>

      <Button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={classes.button}
        variant="contained"
        color="primary"
        type="button"
      >
        Prev
      </Button>

      {pageNumbers.map((page, index) => (
        page === '...' ? (
          <Typography
            key={`ellipsis-${index}`}
            variant="h6"
            component="span"
            sx={{
              mx: 1,
              display: 'inline-flex',
              alignItems: 'center',
              minWidth: '40px',
              justifyContent: 'center',
            }}
          >
            ...
          </Typography>
        ) : (
          <Button
            key={page}
            onClick={() => handlePageClick(page)}
            className={classes.button}
            variant={currentPage === page ? 'contained' : 'outlined'}
            color="primary"
            type="button"
            sx={{
              minWidth: '40px',
              fontWeight: currentPage === page ? 'bold' : 'normal',
            }}
          >
            {page}
          </Button>
        )
      ))}

      <Button
        onClick={handleNext}
        disabled={currentPage === maxPages}
        className={classes.button}
        variant="contained"
        color="primary"
        type="button"
      >
        Next
      </Button>

      <Button
        onClick={handleLast}
        disabled={currentPage === maxPages}
        className={classes.button}
        variant="contained"
        color="primary"
        type="button"
      >
        Last
      </Button>
    </Box>
  );
}

export default Pagination;
