// useAuth.tsx (or useAuth.js)
import { useState, useEffect } from 'react';
import axios from 'axios';
import User from '../interfaces/user';

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
        console.log(err);
        setUser(null); // Handle the error by clearing the user
      });
  }, []);

  return [user, setUser] as const;
};

export default useAuth;