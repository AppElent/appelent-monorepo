import { Box, Button, Container, Divider, Grid, Tab, Tabs, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useTranslate } from '@refinedev/core';
import { getAuth } from 'firebase/auth';
import { useFormik } from 'formik';
import _ from 'lodash';
import { nanoid } from 'nanoid';
import React, { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { Seo } from 'src/components/seo';
import { useKey } from 'src/custom/hooks/use-key';
import useQueryOrLocalStorage from 'src/custom/hooks/use-query-or-localstorage';
import useTabs from 'src/custom/hooks/use-tabs';
import { useConfirm } from 'src/custom/libs/confirmation';
import { useData } from 'src/custom/libs/data-framework';
import { logger } from 'src/custom/libs/logging';
import { generateName } from 'src/custom/libs/random-name-generator';
import {
  getSatisfactoryData,
  //   createSatisfactoryGame,
  //   deleteSatisfactoryGame,
  //   saveSatisfactoryGame,
  getSatisfactoryDataArray,
  SatisfactoryCurrentVersion,
  satisfactoryVersions,
} from 'src/custom/libs/satisfactory/index';
import {
  addFormikArrayItem,
  removeFormikArrayItem,
  setFormikArrayItem,
} from 'src/custom/utils/formik-crud-functions';
import { useMounted } from 'src/hooks/use-mounted';
import { usePageView } from 'src/hooks/use-page-view';
import { useSettings } from 'src/hooks/use-settings';
import { tokens } from 'src/locales/tokens';
import GameSelect from 'src/sections/app/satisfactory/games/game-select';
import TabFactories from 'src/sections/app/satisfactory/games/tab-factories';
import TabGeneral from 'src/sections/app/satisfactory/games/tab-general';
import TabOverview from 'src/sections/app/satisfactory/games/tab-overview';
import TabPowerStations from 'src/sections/app/satisfactory/games/tab-power-stations';
import TabScribble from 'src/sections/app/satisfactory/games/tab-scribble';
import TabTodo from 'src/sections/app/satisfactory/games/tab-todo';
import TabTransport from 'src/sections/app/satisfactory/games/tab-transport';
import TabVehicles from 'src/sections/app/satisfactory/games/tab-vehicles';
import * as Yup from 'yup';

const Page = () => {
  const isMounted = useMounted();
  const auth = getAuth();
  const settings = useSettings();
  const translate = useTranslate();
  const confirm = useConfirm();
  usePageView();

  // Try resolving tab to set from query params
  const tabs = useTabs({ initial: 'general', queryParamName: 'tab' });

  // Load games data
  const gamesData = useData('satisfactory_games');

  // Try resolving default game from localstorage
  const [selectedGameId, setSelectedGameId, deleteSelectedGameId] = useQueryOrLocalStorage('game');

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

  const initialValues = {
    ...selectedGame,
    version: selectedGame?.version || SatisfactoryCurrentVersion,
  };

  const SatisfactoryVersions = satisfactoryVersions.map((v) => v.key);

  const gamesValidation = Yup.object().shape({
    id: Yup.string().required('Required'),
    name: Yup.string().required('Name of game is required'),
    description: Yup.string().strict(true),
    version: Yup.mixed().oneOf(SatisfactoryVersions),
    transport: Yup.object().shape({
      vehicles: Yup.array().of(
        Yup.object().shape({
          id: Yup.string().required('Required'),
          name: Yup.string().required('Name is required'),
          description: Yup.string(),
          type: Yup.string().required('Required'),
          cars: Yup.array().of(
            Yup.object().shape({
              id: Yup.string().required('Required'),
              type: Yup.string(),
            })
          ),
          stops: Yup.array().of(
            Yup.object().shape({
              id: Yup.string().required('Required'),
              direction: Yup.string(),
              station: Yup.string().required('Required'),
              products: Yup.array().of(
                Yup.object().shape({
                  car: Yup.string(),
                  platform: Yup.string(),
                  products: Yup.array().of(Yup.string()),
                })
              ),
            })
          ),
        })
      ),
      stations: Yup.array().of(
        Yup.object().shape({
          id: Yup.string().required('Required'),
          name: Yup.string().required('Name is required'),
          description: Yup.string(),
          type: Yup.string().required('Required'),
          direction: Yup.string().when('type', {
            is: 'train',
            then: () => Yup.string(),
            otherwise: () => Yup.string().required('Direction is required'),
          }),
          platforms: Yup.array().of(
            Yup.object().shape({
              id: Yup.string().required('Required'),
              direction: Yup.string(),
              type: Yup.string(),
              products: Yup.array().of(Yup.string()),
            })
          ),
          factories: Yup.array().of(Yup.string()),
        })
      ),
    }),
    factories: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required('Name is required'),
        id: Yup.string().required('Required'),
        description: Yup.string(),
        finished: Yup.boolean(),
        checked: Yup.boolean(),
        recipes: Yup.array().of(
          Yup.object().shape({
            amount: Yup.string().required('Required'),
            recipe: Yup.string().required('Required'),
            id: Yup.string().required('Required'),
          })
        ),
      })
    ),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    //validationSchema,
    onSubmit: async (values, helpers) => {
      try {
        logger.log('Saving values', values);
        // eslint-disable-next-line unused-imports/no-unused-vars
        let { meta, ...rest } = values;
        // if (!rest.players.find((player) => player.uid === values.owner)) {
        //   rest.players.push({
        //     uid: values.owner,
        //     name: auth.currentUser.displayName,
        //   });
        // }
        if (!rest.playerIds.find((player) => player === values.owner)) {
          rest.players.push(values.owner);
        }
        rest.players = [...new Set(rest.players)];

        // For each station, check if it is a train station. If not, add 1 platform. If it is a train, add train station
        if (rest.transport?.stations?.length > 0) {
          rest.transport.stations = rest.transport?.stations.map((station) => {
            if (station.type !== 'train') {
              if (station.platforms === undefined || station.platforms.length === 0) {
                station.platforms = [{ id: nanoid() }];
              } else if (station.platforms.length > 1) {
                station.platforms = [station.platforms[0]];
              }
            } else {
              //TODO: add train station
            }
            return station;
          });
        }

        // For each vehicle, check if it is a train station. If not, add 1 car
        if (rest.transport?.vehicles?.length > 0) {
          logger.log(rest.transport.vehicles);
        }

        // Fix linebreaks at the end of scribble field
        let endLinebreaks = rest?.scribble?.endsWith('<p><br></p>');
        while (endLinebreaks) {
          rest.scribble = rest.scribble.substring(0, rest.scribble.length - 11);
          endLinebreaks = rest.scribble.endsWith('<p><br></p>');
        }

        //rest.playerIds = rest.players.map((player) => player.uid);
        await gamesData.resource?.actions?.update(values.id, rest);
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
    validationSchema: gamesValidation,
  });

  useEffect(() => logger.log('FORMIK', formik), [formik]);

  useEffect(() => {
    if (Object.keys(formik.errors)?.length > 0) console.error(formik.errors);
  }, [formik.errors]);

  const alertUser = useCallback(
    (e) => {
      if (formik.dirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    },
    [formik.dirty]
  );

  useEffect(() => {
    window.addEventListener('beforeunload', alertUser);
    window.addEventListener('popstate', alertUser);
    return () => {
      window.removeEventListener('beforeunload', alertUser);
      window.removeEventListener('popstate', alertUser);
    };
  }, [formik.dirty, alertUser]);

  useKey({ key: 's', event: 'ctrlKey' }, () => formik.handleSubmit());

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
      label: 'Overview',
      value: 'overview',
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
      label: 'Transport station',
      value: 'transport',
      disabled: !selectedGame,
    },
    {
      label: 'Vehicles',
      value: 'vehicles',
      disabled: !selectedGame,
    },
    {
      label: 'To do list',
      value: 'todo',
      disabled: !selectedGame,
    },
    {
      label: translate(tokens.satisfactory.pages.games.tabs.notepad),
      value: 'scribble',
      disabled: !selectedGame,
    },
  ];

  const onGameChange = useCallback((newId) => {
    //setGameId(newId);
    tabs.setTab(tabsData[0].value);
    setSelectedGameId(newId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    window.scrollTo(0, 0);
    return await gamesData.resource?.actions.delete(id);
  }, [gamesData, selectedGame, deleteSelectedGameId]);

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
                  <Grid
                    container
                    alignItems="center"
                    spacing={2}
                    justifyContent="flex-start"
                    minWidth={350}
                  >
                    <Grid
                      item
                      xs={12}
                      md={7}
                    >
                      <GameSelect
                        games={sortedGames}
                        onGameChange={onGameChange}
                        selectedGame={selectedGame}
                      />
                      {/* <Autocomplete
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
                        sx={{ minWidth: 250 }}
                        value={selectedGame}
                      /> */}
                    </Grid>
                    <Grid
                      item
                      xs
                      lg
                      md={5}
                    >
                      <Button
                        onClick={() => {
                          createNewGame();
                        }}
                        variant="contained"
                      >
                        {translate(tokens.satisfactory.pages.games.addGame)}
                      </Button>
                    </Grid>
                  </Grid>
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
                    disabled={!formik.dirty}
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
                <TabGeneral
                  formik={formik}
                  game={selectedGame}
                  handleDeleteGame={() => {
                    confirm({
                      title: translate(tokens.satisfactory.pages.games.deleteGame),
                      process: () => deleteGame(),
                    });
                  }}
                />
              )}
              {tabs.tab === 'scribble' && (
                <TabScribble
                  formik={formik}
                  game={selectedGame}
                />
              )}
              {tabs.tab === 'overview' && <TabOverview game={selectedGame} />}
              {tabs.tab === 'factories' && (
                <TabFactories
                  formik={formik}
                  game={selectedGame}
                  recipes={satisfactoryRecipes}
                  products={satisfactoryProducts}
                  version={formik.values.version}
                />
              )}
              {tabs.tab === 'transport' && (
                <TabTransport
                  formik={formik}
                  game={selectedGame}
                  recipes={satisfactoryRecipes}
                  products={satisfactoryProducts}
                />
              )}
              {tabs.tab === 'vehicles' && (
                <TabVehicles
                  formik={formik}
                  game={selectedGame}
                  recipes={satisfactoryRecipes}
                  products={satisfactoryProducts}
                />
              )}
              {tabs.tab === 'todo' && (
                <TabTodo
                  todos={formik.values.todos || []}
                  addTodo={addFormikArrayItem(formik, 'todos')}
                  removeTodo={removeFormikArrayItem(formik, 'todos')}
                  setTodo={setFormikArrayItem(formik, 'todos')}
                  formikNamespace={'todos'}
                  players={formik.values.players || []}
                  handleChange={formik.handleChange}
                />
              )}
              {tabs.tab === 'power' && (
                <TabPowerStations
                  powerStations={formik.values.power?.stations || []}
                  // createPowerStation={() => {
                  //   const currentStations = formik.values.power?.stations || [];
                  //   formik.setFieldValue('power.stations', [
                  //     ...currentStations,
                  //     { id: nanoid(), name: generateName() },
                  //   ]);
                  // }}
                  formikNamespace={'power.stations'}
                  createPowerStation={addFormikArrayItem(formik, 'power.stations')}
                  deletePowerStation={removeFormikArrayItem(formik, 'power.stations')}
                  setPowerStation={setFormikArrayItem(formik, 'power.stations')}
                  formik={formik}
                />
              )}
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

//Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
