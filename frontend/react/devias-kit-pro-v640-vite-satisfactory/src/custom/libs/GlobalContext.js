import { createContext, useContext } from 'react';

export const GlobalContext = createContext();

export const useGlobalData = () => useContext(GlobalContext);
