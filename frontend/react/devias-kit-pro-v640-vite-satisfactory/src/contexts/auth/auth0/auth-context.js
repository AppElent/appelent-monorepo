import { createContext } from 'react';
import { Issuer } from 'src/utils/auth';

export const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

export const AuthContext = createContext({
  ...initialState,
  issuer: Issuer.Auth0,
  loginWithRedirect: () => Promise.resolve(),
  handleRedirectCallback: () => Promise.resolve(undefined),
  logout: () => Promise.resolve(),
});
