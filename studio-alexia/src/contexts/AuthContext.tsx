import { createContext, useEffect, useState, type ReactNode } from 'react';
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
} from '../services/firebase';

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | undefined;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({} as AuthContextType);

const checkIsAdmin = (email: string): boolean => {
  const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map((e: string) => e.trim()) || [];
  return adminEmails.includes(email);
};

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, uid, email } = user;
        if (!displayName || !email) {
          throw new Error('Missing information from Google account');
        }
        setUser({
          id: uid,
          name: displayName,
          email: email,
        });
        setIsAdmin(checkIsAdmin(email));
      } else {
        setUser(undefined);
        setIsAdmin(false);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    if (result.user) {
      const { displayName, photoURL, uid, email } = result.user;
      if (!displayName || !photoURL || !email) {
        throw new Error('Missing information from Google account');
      }
      setUser({
        id: uid,
        name: displayName,
        email: email,
      });
      setIsAdmin(checkIsAdmin(email));
    }
  }
  return (
    <AuthContext.Provider value={{ user, isAdmin, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}
