import {
  ChakraProvider,
  CSSReset,
  extendTheme,
  StyleFunctionProps,
  theme,
  withDefaultColorScheme,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';

const customTheme = extendTheme(
  {
    colors: {
      primary: theme.colors.blue,
      secondary: theme.colors.purple,
    },
    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          bg: mode('#f4f5fd', 'gray.800')(props),
        },
      }),
    },
  },
  withDefaultColorScheme({ colorScheme: 'primary' }),
);

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={baseUrl}>
        <ChakraProvider theme={customTheme}>
          <CSSReset />
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
