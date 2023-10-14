import { createContext } from 'react';

export const defaultSettings = {};

export const initialState = {
  ...defaultSettings,
};

export const NotificationContext = createContext({
  ...initialState,
});
