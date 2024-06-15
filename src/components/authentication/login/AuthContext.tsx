import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useNavigate, useLocation } from 'react-router-dom';
import supabase from '../SupabaseClient';
import UnauthorizedPage from '@/pages/UnauthorizedPage'; // Import the unauthorized page component
import './AuthContext.css';

interface AuthContextType {
  session: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session) {
        const { error, data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error.message);
          await supabase.auth.signOut();
          setSession(null);
          setIsAuthorized(false);
        } else if (data.role !== 'professor') {
          console.error('Access denied: Only professors can sign in');
          await supabase.auth.signOut();
          setSession(null);
          setIsAuthorized(false);
        }
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session && location.pathname === '/login') {
        const { error, data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error.message);
          await supabase.auth.signOut();
          setSession(null);
          setIsAuthorized(false);
        } else if (data.role !== 'professor') {
          console.error('Access denied: Only professors can sign in');
          await supabase.auth.signOut();
          setSession(null);
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
          navigate('/dashboard/app');
        }
      } else if (!session && location.pathname !== '/login') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Error logging in:', error.message);
    } else {
      const { session } = data;
      const { error: roleError, data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (roleError) {
        console.error('Error fetching user role:', roleError.message);
        await supabase.auth.signOut();
        setSession(null);
        setIsAuthorized(false);
      } else if (profile.role !== 'professor') {
        console.error('Access denied: Only professors can sign in');
        await supabase.auth.signOut();
        setSession(null);
        setIsAuthorized(false);
      } else {
        setSession(session);
        setIsAuthorized(true);
        navigate('/dashboard/app');
      }
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
    } else {
      setSession(null);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {!session ? (
        <>
          <section>
            <div className='air air1'></div>
            <div className='air air2'></div>
            <div className='air air3'></div>
            <div className='air air4'></div>
          </section>
          <div className='container'>
            <div className='title'>
              <p>Electrical Simulator ⚡</p>
            </div>
            <div className="auth-container">
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={[]}
                theme='dark'
              />
            </div>
          </div>
        </>
      ) : isAuthorized ? (
        children
      ) : (
        <UnauthorizedPage />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
