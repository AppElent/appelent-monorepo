import { useCallback, useEffect, useMemo, useState } from 'react';

import { SatisfactoryCurrentVersion } from '.';
import { getRecipesByProduct, CONFIG_TEMPLATE, RESULT_TEMPLATE } from './statistics';
import useLocalStorage from 'src/custom/hooks/use-local-storage';
import { nanoid } from 'nanoid';
import { generateName } from '../random-name-generator';

function createCustomTimeout(seconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

export const useSatisfactoryPlanner = (initialConfig) => {
  const defaultConfig = useMemo(
    () => ({
      ...CONFIG_TEMPLATE,
      ...initialConfig,
    }),
    []
  );

  const defaultResult = RESULT_TEMPLATE;
  const [storageState, setStorageState, deleteStorageState] = useLocalStorage(
    'satisfactory_planner_data',
    []
  );
  //const [currentConfig, setCurrentConfig] = useState();

  const currentConfig = useMemo(
    () => storageState.currentConfig || storageState.configs?.[0]?.id,
    [storageState.currentConfig]
  );

  const setCurrentConfig = useCallback(
    (configId) => setStorageState((prev) => ({ ...prev, currentConfig: configId })),
    [setStorageState]
  );

  useEffect(() => {
    // If configs change, check if the current config still exists. If not, remove setting
    if (
      storageState.currentConfig &&
      !storageState?.configs?.find((c) => c.id === storageState.currentConfig)
    ) {
      setStorageState((prev) => ({ ...prev, currentConfig: undefined }));
    }
  }, [storageState?.configs, storageState.currentConfig, deleteStorageState, setStorageState]);

  const config = useMemo(() => {
    return currentConfig
      ? storageState?.configs?.find((state) => state.id === currentConfig)
      : storageState?.configs?.[0];
  }, [currentConfig, storageState]);

  //const [config, setConfigBase] = useState(defaultConfig);
  const [result, setResult] = useState(defaultResult);

  const timeoutSecs = (config?.updateSeconds || 3) * 1000;

  const setConfig = useCallback(
    (key, value) => {
      const newArray = storageState?.configs?.map((state) => {
        if (state.id === currentConfig) {
          if (!['id', 'name'].includes(key)) {
            return { ...state, [key]: value, dirty: true };
          }
          return { ...state, [key]: value };
        } else {
          return state;
        }
      });
      setStorageState({ ...storageState, configs: newArray });
    },
    [setStorageState, currentConfig, storageState]
  );

  const addConfig = useCallback(
    (name) => {
      const id = nanoid();
      setStorageState((prev) => {
        return {
          ...prev,
          configs: [
            ...(prev?.configs || []),
            { id, name: name || 'New factory', ...defaultConfig },
          ],
          currentConfig: id,
        };
      });
      //setCurrentConfig(id);
    },
    [setStorageState, defaultConfig]
  );

  const cloneConfig = useCallback(
    (oldId) => {
      const id = nanoid();
      const oldConfig = storageState?.configs?.find((s) => s.id === oldId);
      setStorageState((prev) => {
        return {
          ...prev,
          configs: [
            ...(prev?.configs || []),
            { ...oldConfig, id, name: `${oldConfig.name} (copy)` },
          ],
          currentConfig: id,
        };
      });
      //setCurrentConfig(id);
    },
    [setStorageState, defaultConfig]
  );

  const removeConfig = useCallback(
    (id) => {
      const idToDelete = id || currentConfig;

      console.log(
        idToDelete,
        storageState,
        storageState.configs?.filter((c) => c.id !== idToDelete)
      );
      setStorageState((prev) => ({
        ...prev,
        configs: prev.configs?.filter((c) => c.id !== idToDelete),
      }));
    },
    [currentConfig, setStorageState, storageState]
  );

  const resetConfig = useCallback(
    (id) => {
      const idToReset = id || currentConfig;
      const newArray = storageState?.configs?.map((state) => {
        if (state.id === idToReset) {
          return { id: state.id, name: state.name, ...defaultConfig };
        } else {
          return state;
        }
      });
      setStorageState({ ...storageState, configs: newArray });
    },
    [currentConfig, storageState, setStorageState, defaultConfig]
  );

  const calculate = useCallback(async () => {
    if (config?.autoUpdate && config?.dirty) {
      setResult((prev) => ({ ...prev, loading: true }));
      console.log('Config gets a new update', config);
      //setResult((prev) => ({ ...prev, loading: true }));
      //Calculate
      //console.log(config);
      //await createCustomTimeout(5);
      //const calculated = getRecipesByProduct(config.products, config.recipes, config.version);
      //console.log(calculated);

      setResult(getRecipesByProduct(config, undefined));
    }
  }, [config]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      calculate();
    }, timeoutSecs);

    return () => clearTimeout(delayDebounceFn);
  }, [config, calculate, timeoutSecs]);

  const configObject = useMemo(
    () => ({
      config,
      setConfig,
      resetConfig,
      addConfig,
      cloneConfig,
      setCurrentConfig,
      removeConfig,
      configs: storageState.configs,
    }),
    [
      addConfig,
      cloneConfig,
      config,
      removeConfig,
      resetConfig,
      setConfig,
      setCurrentConfig,
      storageState.configs,
    ]
  );

  const preferredRecipes = useMemo(
    () => ({
      recipeLists: storageState.recipeLists || [],
      removeRecipeList: (id) => {
        if (id && storageState?.recipeLists) {
          setStorageState((prev) => ({
            ...prev,
            recipeLists: prev.recipeLists.filter((recipe) => recipe.id !== id),
          }));
        }
      },
      addRecipeList: () =>
        setStorageState((prev) => ({
          ...prev,
          recipeLists: [...prev.recipeLists, { id: nanoid() }],
        })),
      setRecipeList: (id, value) =>
        setStorageState((prev) => {
          const foundList = prev.recipeLists?.findIndex((r) => r.id === id);

          if (foundList > -1) {
            let newLists = [...prev.recipeLists];
            newLists[foundList] = value;
            prev.recipeLists[foundList] = value;
            return {
              ...prev,
              recipeLists: [...newLists],
            };
          } else {
            return prev;
          }
        }),
    }),
    [setStorageState, storageState.recipeLists]
  );

  const returnObject = useMemo(
    () => ({
      config: configObject,
      preferredRecipes,
      result,
    }),
    [configObject, preferredRecipes, result]
  );
  return returnObject;
};

//export default useSatisfactoryPlanner;
