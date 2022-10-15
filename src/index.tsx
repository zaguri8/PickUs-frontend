import ReactDOM from 'react-dom/client';
import './index.css';
import { MantineProvider } from '@mantine/core';
import App from './App';
import { UserContextProvider } from './logic/context/Firebase';
import { GoogleMapsContextProvider } from './logic/context/GoogleMaps';
import { LanguageContextProvider } from './logic/context/Language';
import { CookieContextProvider } from './logic/context/CookieContext';
import { ModalContextProvider } from './logic/context/ModalContext';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<MantineProvider
  withGlobalStyles
  withNormalizeCSS>
  <ModalContextProvider>
    <CookieContextProvider>
      <LanguageContextProvider>
        <GoogleMapsContextProvider>
          <UserContextProvider>
            <App />
          </UserContextProvider>
        </GoogleMapsContextProvider>
      </LanguageContextProvider>
    </CookieContextProvider>
  </ModalContextProvider>
</MantineProvider>);
