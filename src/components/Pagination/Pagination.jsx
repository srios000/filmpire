import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import useStyles from './styles';

function Pagination({ currentPage, totalPages, setPage }) {
  const classes = useStyles();

  const maxPages = Math.min(totalPages, 500);

  const handleFirst = () => setPage(1);
  const handleLast = () => setPage(maxPages);
  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(maxPages, prev + 1));

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
            onClick={() => setPage(page)}
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
