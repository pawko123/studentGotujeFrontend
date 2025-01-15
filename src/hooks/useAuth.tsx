// useAuth.tsx (or useAuth.js)
import { useState, useEffect } from 'react';
import axios from 'axios';
import User from '../interfaces/user';

/**
 * Custom hook to manage user authentication state.
 *
 * This hook fetches the authenticated user data from the server and updates the state accordingly.
 * It uses Axios to make a GET request to the `/api/auth/user` endpoint with credentials.
 * If the request is successful and returns a 200 status, the user data is set in the state.
 * If the request fails with a 401 status, the user state is set to null.
 *
 * @returns {[User | null, React.Dispatch<React.SetStateAction<User | null>>]} An array containing the user state and the function to update the user state.
 */
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get('/api/auth/user', { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          const { id, email, username, appUserRole, enabled } = res.data;
          setUser({ id, email, username, appUserRole, enabled });
        } else {
          setUser(null);
        }
      })
      .catch((err) => {
        if(err.response.status === 401){
          setUser(null);
        }
      });
  }, []);

  return [user, setUser] as const;
};

export default useAuth;