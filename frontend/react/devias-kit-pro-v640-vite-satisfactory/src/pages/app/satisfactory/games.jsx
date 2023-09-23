import {
  Autocomplete,
  Box,
  Button,
  Container,
  Divider,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { siteSettings } from 'src/config';
import { useRouter } from 'src/hooks/use-router';
import React, { useMemo, useEffect, useCallback } from 'react';
import {
  SatisfactoryCurrentVersion,
  //   createSatisfactoryGame,
  //   deleteSatisfactoryGame,
  //   saveSatisfactoryGame,
  getSatisfactoryDataArray,
  getSatisfactoryData,
} from 'src/custom/libs/satisfactory/index';
import { Stack } from '@mui/system';
import _ from 'lodash';
import useTabs from 'src/custom/hooks/use-tabs';
import { useData } from 'src/custom/libs/data-framework';
import { SatisfactoryGamesGeneral } from 'src/sections/app/satisfactory/games/satisfactory-games-general';
import { getAuth } from 'firebase/auth';
import { useFormik } from 'formik';
import useLocalStorage from 'src/custom/hooks/use-local-storage';
import { useConfirm } from 'src/custom/libs/confirmation';
import { toast } from 'react-hot-toast';
import { SatisfactoryGamesScribble } from 'src/sections/app/satisfactory/games/satisfactory-games-scribble';
import { SatisfactoryGamesFactories } from 'src/sections/app/satisfactory/games/satisfactory-games-factories';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';
import { generateName } from 'src/custom/libs/random-name-generator';
import { useKey } from 'src/custom/hooks/use-key';
import { SplashScreen } from 'src/components/splash-screen';
import { useTranslate } from '@refinedev/core';
import { tokens } from 'src/locales/tokens';
import { Seo } from 'src/components/seo';
import useQueryOrLocalStorage from 'src/custom/hooks/use-query-or-localstorage';
import { useMounted } from 'src/hooks/use-mounted';

const Page = () => {
  const isMounted = useMounted();
  const auth = getAuth();
  const settings = useSettings();
  const translate = useTranslate();
  const confirm = useConfirm();
  usePageView();
  const router = useRouter();

  // Try resolving tab to set from query params
  const tabs = useTabs({ initial: 'general', queryParamName: 'tab' });

  // Load games data
  const gamesData = useData('satisfactory_games');

  // Try resolving default game from localstorage
  const [selectedGameId, setSelectedGameId, deleteSelectedGameId] = useQueryOrLocalStorage('game');
  // const [selectedGameId, setSelectedGameId, deleteSelectedGameId] =
  //   useLocalStorage('satisfactory_game_id');

  // Get game from query parameter
  // const QueryFilter = withDefault(StringParam, selectedGameId);
  // const [gameId, setGameId] = useQueryParam('game', QueryFilter);

  // Set selected game
  const selectedGame = useMemo(() => {
    if (gamesData.data) {
      const found = gamesData.data?.find((oneGame) => oneGame.id === selectedGameId);
      if (!found) {
        return gamesData.data[0];
      }
      return found;
    }
    return undefined;
  }, [gamesData.data, selectedGameId]);

  console.log(999, selectedGameId, selectedGame, gamesData);

  // useEffect(() => {
  //   formik.setValues(selectedGame);
  //   setFormDirty(false);
  // }, [selectedGame]);

  const onGameChange = useCallback((newId) => {
    //setGameId(newId);
    setSelectedGameId(newId);
  }, []);

  const initialValues = {
    ...selectedGame,
    version: selectedGame?.version || SatisfactoryCurrentVersion,
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    //validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        let { meta, ...rest } = values;
        if (!rest.players.find((player) => player.uid === values.owner)) {
          rest.players.push({
            uid: values.owner,
            name: auth.currentUser.displayName,
          });
        }

        // Fix linebreaks at the end of scribble field
        let endLinebreaks = rest?.scribble?.endsWith('<p><br></p>');
        while (endLinebreaks) {
          rest.scribble = rest.scribble.substring(0, rest.scribble.length - 11);
          console.log(rest.scribble);
          endLinebreaks = rest.scribble.endsWith('<p><br></p>');
        }

        rest.playerIds = rest.players.map((player) => player.uid);
        //console.log(values, rest);
        const savedGame = await gamesData.resource?.actions?.update(values.id, rest);
        //await saveSatisfactoryGame(gamesData.meta.path, values.id, rest);
        toast.success(translate(tokens.common.notifications.savedSuccess));
      } catch (err) {
        console.error(err);
        toast.error(translate(tokens.common.notifications.savedError + ':' + err.message));

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  useKey('ctrls', () => formik.handleSubmit());

  const satisfactoryRecipes = _.sortBy(
    getSatisfactoryDataArray('recipes', formik.values.version),
    'name'
  );
  const satisfactoryProducts = getSatisfactoryData('items', formik.values.version);

  const tabsData = [
    {
      label: translate(tokens.satisfactory.pages.games.tabs.general),
      value: 'general',
    },
    {
      label: translate(tokens.satisfactory.pages.games.tabs.factories),
      value: 'factories',
      disabled: !selectedGame,
    },
    {
      label: translate(tokens.satisfactory.pages.games.tabs.power),
      value: 'power',
      disabled: !selectedGame,
    },
    {
      label: translate(tokens.satisfactory.pages.games.tabs.trainstations),
      value: 'trainstations',
      disabled: !selectedGame,
    },
    {
      label: translate(tokens.satisfactory.pages.games.tabs.notepad),
      value: 'scribble',
      disabled: !selectedGame,
    },
  ];

  // useEffect(() => {
  //   let tabToSet = tabs.tab ? tabs.tab : tabsData[0];
  //   if (tabToSet) {
  //     router.replace(
  //       {
  //         query: { ...router.query, tab: tabToSet },
  //       },
  //       undefined,
  //       { shallow: true }
  //     );
  //   }
  // }, [tabs.tab]);

  const createNewGame = async () => {
    let newName = generateName();

    const GAME_TEMPLATE = {
      name: newName,
      owner: auth.currentUser?.uid,
      players: [{ name: auth.currentUser?.displayName, uid: auth.currentUser?.uid }],
      playerIds: [auth.currentUser?.uid],
      version: SatisfactoryCurrentVersion,
      factories: [],
    };
    const createdGame = await gamesData.resource?.actions?.add(GAME_TEMPLATE); //{ id: 'abc123' }; //await createSatisfactoryGame(gamesData.meta.path, GAME_TEMPLATE);
    setSelectedGameId(createdGame.id);
    //setGameId(createdGame.id);
  };

  const deleteGame = useCallback(async () => {
    const id = selectedGame.id;
    deleteSelectedGameId();
    return await gamesData.resource?.actions.delete(id);
  }, [gamesData, selectedGame]);

  if (!selectedGame) {
    if (gamesData.loading) return <></>;
    return (
      <React.Fragment>
        <Seo title={translate(tokens.satisfactory.pages.games.title)} />
        <Box
          textAlign="center"
          sx={{ mt: 20 }}
        >
          <Button
            disabled={gamesData.loading}
            onClick={() => {
              createNewGame();
            }}
            variant="contained"
          >
            {translate(tokens.satisfactory.pages.games.addFirstGame)}
          </Button>
        </Box>
      </React.Fragment>
    );
  }

  const sortedGames = _.sortBy(gamesData.data, 'name');

  return (
    <>
      <Seo title={translate(tokens.satisfactory.pages.games.title)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={settings.stretch ? false : 'xl'}>
          <Stack spacing={3}>
            <Stack spacing={3}>
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                spacing={3}
              >
                <Typography variant="h4">Game: {selectedGame.name}</Typography>

                <Stack
                  direction="row"
                  spacing={2}
                >
                  <Autocomplete
                    getOptionLabel={(option) => option.name}
                    options={sortedGames}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        label={translate(tokens.satisfactory.pages.games.title)}
                        name="game"
                      />
                    )}
                    renderOption={(props, option) => {
                      return (
                        <li
                          {...props}
                          key={option.id}
                        >
                          {option.name}
                        </li>
                      );
                    }}
                    // isOptionEqualToValue={(option, value) =>
                    //   option.name === value.name
                    // }
                    onChange={(e, value) => {
                      if (value) {
                        onGameChange(value.id);
                      }
                    }}
                    // onInputChange={(event, newInputValue) => {
                    //   setInputValue(newInputValue);
                    // }}
                    sx={{ width: 300 }}
                    value={selectedGame}
                  />
                  <Button
                    onClick={() => {
                      createNewGame();
                    }}
                    variant="contained"
                  >
                    {translate(tokens.satisfactory.pages.games.addGame)}
                  </Button>
                </Stack>
              </Stack>
              <div>
                <Stack
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                  spacing={3}
                >
                  <Tabs
                    indicatorColor="primary"
                    onChange={tabs.handleTabChange}
                    scrollButtons="auto"
                    textColor="primary"
                    value={tabs.tab}
                    variant="scrollable"
                  >
                    {tabsData.map((tab) => (
                      <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                        disabled={tab.disabled}
                      />
                    ))}
                  </Tabs>
                  <Button
                    //color="inherit"
                    //disabled={!formik.dirty}
                    size="small"
                    onClick={formik.handleSubmit}
                    variant="contained"
                  >
                    {translate(tokens.common.buttons.save)}
                  </Button>
                </Stack>
                <Divider />
              </div>
            </Stack>
            <Stack spacing={1}>
              {tabs.tab === 'general' && (
                <SatisfactoryGamesGeneral
                  formik={formik}
                  game={selectedGame}
                  handleDeleteGame={() => {
                    confirm({
                      title: translate(tokens.satisfactory.pages.games.deleteGame),
                      process: () => deleteGame(),
                    });
                  }}
                  translate={translate}
                />
              )}
              {tabs.tab === 'scribble' && (
                <SatisfactoryGamesScribble
                  formik={formik}
                  game={selectedGame}
                  translate={translate}
                />
              )}
              {tabs.tab === 'factories' && (
                <SatisfactoryGamesFactories
                  formik={formik}
                  game={selectedGame}
                  recipes={satisfactoryRecipes}
                  products={satisfactoryProducts}
                  translate={translate}
                />
              )}
              {/* {JSON.stringify(selectedGame)} */}
              {/* <SatisfactoryProductDetail product={product} />
              <SatisfactoryProductRecipeTable
                title="Recipes"
                recipes={product.recipes_by}
                products={getSatisfactoryData("items", version)}
              />
              <SatisfactoryProductRecipeTable
                title="Used for"
                recipes={product.recipes_for}
                products={getSatisfactoryData("items", version)}
                conditionFunction={isEquipment(true)}
              />
              <SatisfactoryProductRecipeTable
                title="Equipment"
                recipes={product.recipes_for}
                products={getSatisfactoryData("items", version)}
                conditionFunction={isEquipment(false)}
              /> */}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

//Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
