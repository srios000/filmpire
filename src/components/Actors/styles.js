import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  containerSpaceAround: {
    display: 'flex',
    justifyContent: 'space-around',
    margin: '10px 0 !important',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      flexWrap: 'wrap',
    },
  },
  poster: {
    borderRadius: '20px',
    boxShadow: '0.5em 1em 1em rgb(64, 64, 70)',
    width: '80%',
    [theme.breakpoints.down('lg')]: {
      margin: '0 auto',
      width: '70%',
      height: 'auto',
    },
    [theme.breakpoints.down('md')]: {
      margin: '0 auto',
      width: '50%',
      height: 'auto',
    },
    [theme.breakpoints.down('sm')]: {
      margin: '0 auto',
      width: '100%',
      height: '350px',
      marginBottom: '30px',
    },
  },
  biography: {
    margin: '0px 0px 16px !important',
    fontSize: '0.875rem !important',
  },
  birthdate: {
    margin: '0px 0px 0.35em !important',
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    alignItem: 'center',
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      padding: '0.5rem 1rem',
    },
  },
  buttonsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));
