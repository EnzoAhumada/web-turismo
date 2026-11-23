import { createContext, useContext, useEffect, useState } from 'react';
import {
  getSession,
  onAuthStateChange,
  getProfile,
  signInWithEmail,
  signUpWithEmail,
  signOutUser,
  updateUserProfile,
} from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then((session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          return loadProfile(session.user.id);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

    const unsubscribe = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function loadProfile(userId) {
    const data = await getProfile(userId);
    setProfile(data);
    setLoading(false);
  }

  async function signIn(email, password) {
    return signInWithEmail(email, password);
  }

  async function signUp(email, password, nombre, apellido) {
    return signUpWithEmail({ email, password, nombre, apellido });
  }

  async function signOut() {
    await signOutUser();
  }

  async function updateProfile(updates) {
    if (!user) return { data: null, error: new Error('Sesión no iniciada.') };
    const { data, error } = await updateUserProfile(user.id, updates);
    if (!error && data) {
      setProfile(data);
    }
    return { data, error };
  }

  const isAdmin = profile?.rol === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        updateProfile,
        reloadProfile: () => user && loadProfile(user.id),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
