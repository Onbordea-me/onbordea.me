import { createContext, useEffect, useState, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null); // Initialize as null

  // Signup
  const signUpNewUser = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        console.error('Error signing up:', error);
        return { success: false, error: error.message };
      }
      setSession(data.session); // Set session after signup
      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error during sign-up:', error);
      return { success: false, error: error.message };
    }
  };

  // Signin
  const signInUser = async (email, password, isAdmin = false) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Error signing in:', error);
        return { success: false, error: error.message };
      }

      // Check for admin privileges if isAdmin is true
      if (isAdmin) {
        const { data: admin, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', data.user.id)
          .single();
        if (adminError || !admin) {
          // Sign out the user if they are not an admin
          await supabase.auth.signOut();
          setSession(null);
          return { success: false, error: 'This account does not have admin privileges.' };
        }
      }

      setSession(data.session);
      console.log('Sign-in successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error signing in:', error);
      return { success: false, error: error.message };
    }
  };

  // Signout
  const signOutUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
      setSession(null);
    } catch (error) {
      console.comedycentralerror('Unexpected error signing out:', error);
      throw error;
    }
  };

  // Load session on mount
  useEffect(() => {
    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error fetching session:', error);
      }
      setSession(session);
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, signUpNewUser, signInUser, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};