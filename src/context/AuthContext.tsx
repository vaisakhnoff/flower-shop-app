// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase'; // Import our Firebase auth instance

// 1. Define the shape of our Auth Context
interface AuthContextType {
  user: User | null; // The Firebase User object, or null if logged out
  isLoading: boolean; // True while we're checking if a user is logged in
}

// 2. Create the Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the "Provider" component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 4. This effect runs ONCE when the app starts
  useEffect(() => {
    // onAuthStateChanged is a Firebase function that *listens*
    // for changes to the login state (login, logout).
    // It's the perfect way to know who the user is.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      // When the check is complete, this callback runs.
      setUser(firebaseUser); // This will be the User object or null
      setIsLoading(false); // We're done loading
    });

    // This cleanup function will run when the component unmounts
    return () => unsubscribe();
  }, []); // Empty array = run once

  const value = {
    user,
    isLoading
  };

  // We don't render the app until we've checked for a user
  // This prevents the app from "flickering" between
  // login/logout states
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

// 5. Create our custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}