import { useEffect, useReducer, useState } from "react";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { RTL } from "../components/rtl";
import { SplashScreen } from "../components/splash-screen";
import { Toaster } from "../components/toaster";
import {
  SettingsConsumer,
  SettingsProvider,
} from "../contexts/settings-context";
import { AuthConsumer, AuthProvider } from "../contexts/auth/firebase-context";
import { gtmConfig, siteSettings } from "../config";
import { gtm } from "../libs/gtm";

import { store } from "../store";
import { createTheme } from "../theme";
import { createEmotionCache } from "../utils/create-emotion-cache";
// Remove if nprogress is not used
import "../libs/nprogress";
// Remove if mapbox is not used
import "../libs/mapbox";
// Remove if locales are not use
import "../locales/i18n";
import { SettingsButton } from "../components/settings-button";
import { SettingsDrawer } from "../components/settings-drawer";

import CustomApp from "libs/custom-app";
import { initialGlobalData, reducer } from "libs/global-data";

const clientSideEmotionCache = createEmotionCache();

const useAnalytics = () => {
  useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);
};

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [data, dispatch] = useReducer(reducer, initialGlobalData);

  console.log("Globaldata", data);

  // useEffect(() => {
  //   dispatch({ type: "INITIALIZE", payload: dispatch });
  // }, []);
  // console.log(data);

  useAnalytics();

  const getLayout = Component.getLayout ?? ((page) => page);

  console.log("Environment variables", process.env.NEXT_PUBLIC_GITHUB_SHA);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{siteSettings.title}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <AuthConsumer>
              {(auth) => (
                <SettingsProvider>
                  <SettingsConsumer>
                    {(settings) => {
                      // Prevent theme flicker when restoring custom settings from browser storage
                      if (!settings.isInitialized) {
                        // return null;
                      }

                      const theme = createTheme({
                        colorPreset: settings.colorPreset,
                        contrast: settings.contrast,
                        direction: settings.direction,
                        paletteMode: settings.paletteMode,
                        responsiveFontSizes: settings.responsiveFontSizes,
                      });

                      // Prevent guards from redirecting
                      const showSlashScreen = !auth.isInitialized;

                      return (
                        <CustomApp globalData={{ data, dispatch }}>
                          <ThemeProvider theme={theme}>
                            <Head>
                              <meta
                                name="color-scheme"
                                content={settings.paletteMode}
                              />
                              <meta
                                name="theme-color"
                                content={theme.palette.neutral[900]}
                              />
                            </Head>
                            <RTL direction={settings.direction}>
                              <CssBaseline />
                              {showSlashScreen ? (
                                <SplashScreen />
                              ) : (
                                <>
                                  {getLayout(<Component {...pageProps} />)}
                                  <SettingsButton
                                    onClick={settings.handleDrawerOpen}
                                  />
                                  <SettingsDrawer
                                    canReset={settings.isCustom}
                                    onClose={settings.handleDrawerClose}
                                    onReset={settings.handleReset}
                                    onUpdate={settings.handleUpdate}
                                    open={settings.openDrawer}
                                    values={{
                                      colorPreset: settings.colorPreset,
                                      contrast: settings.contrast,
                                      direction: settings.direction,
                                      paletteMode: settings.paletteMode,
                                      responsiveFontSizes:
                                        settings.responsiveFontSizes,
                                      stretch: settings.stretch,
                                      layout: settings.layout,
                                      navColor: settings.navColor,
                                    }}
                                  />
                                </>
                              )}
                              <Toaster />
                            </RTL>
                          </ThemeProvider>
                        </CustomApp>
                      );
                    }}
                  </SettingsConsumer>
                </SettingsProvider>
              )}
            </AuthConsumer>
          </AuthProvider>
        </LocalizationProvider>
      </ReduxProvider>
    </CacheProvider>
  );
};

export default App;
