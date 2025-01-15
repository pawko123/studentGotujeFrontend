import React ,{useState,useEffect} from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from './pages/main.tsx';
import Login from './pages/login.tsx';
import Inspiration from './pages/inspiration.tsx';
import RecipePage from './pages/recipePage.tsx';
import CreateForm from './pages/createForm.tsx';
import UserPage from './pages/userpage.tsx';
import Register from './pages/register.tsx';
import Top10Recipes from './pages/top10.tsx';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import ResetPasswordEmailPage from './pages/resetPasswordEmail.tsx';
import ResetPasswordPage from './pages/resetPasswordPage.tsx';

/**
 * The main application component that sets up the theme, routing, and Google reCAPTCHA provider.
 *
 * This component:
 * - Determines the user's preferred color scheme (dark or light mode) and sets up a theme accordingly.
 * - Listens for changes in the system's color scheme preference and updates the theme dynamically.
 * - Provides the Google reCAPTCHA context to the application.
 * - Sets up the application's routing using React Router.
 *
 * @returns {JSX.Element} The main application component.
 */
function App() {
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  // Listen to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Create theme based on darkMode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <GoogleReCaptchaProvider
     //@ts-ignore
      reCaptchaKey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "body",
        nonce: undefined,
      }}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Main />} />
              <Route path="inspiration" element={<Inspiration/>} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="resetPasswordEmail" element={<ResetPasswordEmailPage />} />
              <Route path="resetPassword" element={<ResetPasswordPage />} />
              <Route path="recipe/:id" element={<RecipePage />} />
              <Route path='userPage' element={<UserPage/>}/>
              <Route path='recipe/create' element={<CreateForm/>}/>
              <Route path='top10' element={<Top10Recipes/>}/>
              <Route path="*" element={<h1>Not Found</h1>} />
            </Route>
          </Routes>
        </BrowserRouter>
        </GoogleReCaptchaProvider>
    </ThemeProvider>
  );
}

export default App;
