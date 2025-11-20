import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material';
import { Provider as ReduxProvider } from 'react-redux';

import App from './components/App';
import store from './app/store';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({});

ReactDOM.render(
  <ReduxProvider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    </ThemeProvider>,
  </ReduxProvider>,
  document.getElementById('root'),
);
