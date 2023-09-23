import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

import { logger, setLogger } from 'src/custom/libs/logging';
import Refine from 'src/custom/libs/refine';
import { useHttpsRedirect } from 'src/custom/hooks/use-https-redirect';
import useLocalStorage from './custom/hooks/use-local-storage';
import { ConfirmProvider } from './custom/libs/confirmation';
import { DataFramework } from './custom/libs/data-framework';
import { collection } from 'firebase/firestore';
import { db } from './libs/firebase';
import { useRouter } from './hooks/use-router';

const CustomApp = ({ children }) => {
  // Redirect to HTTPS if condition is TRUE
  useHttpsRedirect(!import.meta.env.DEV);

  //Navigate component
  const navigate = useRouter();

  // Retrieve locally saved user settings
  const [userSettings] = useLocalStorage('user_settings');
  logger.log('User settings', userSettings);

  // Set loglevel
  const LOG_LEVEL = userSettings?.loglevel
    ? userSettings.loglevel
    : import.meta.env.DEV
    ? 'info'
    : 'warn';
  setLogger({ level: LOG_LEVEL });
  logger.log('Environment variables', import.meta.env);
  logger.log('Log level', LOG_LEVEL);

  // Set the options for confirmation dialogs
  const confirmationDialogOptions = {
    confirmationButtonProps: { variant: 'contained', color: 'error' },
    cancellationButtonProps: { variant: 'contained' },
  };

  // set resources for data framework
  const resources = [
    {
      name: 'dummy01',
      options: {
        collection: collection(db, 'dummy'),
        dataProviderName: 'firestore',
      },
    },
    {
      name: 'testdocument',
      options: {
        collection: collection(db, 'dummy'),
        document: 'dumm03',
        dataProviderName: 'firestore',
      },
    },
    {
      name: 'test01',
      key: 'testkey',
      loadData: true,
      options: {
        dataProviderName: 'localStorage',
      },
    },
    {
      name: 'user_settings',
      key: 'user_settings',
      loadData: true,
      options: {
        dataProviderName: 'localStorage',
      },
    },
    {
      name: 'dummy03',
      options: {
        collection: collection(db, 'dummy'),
        dataProviderName: 'firestore',
        postProcess: (data) => {
          var object = data?.reduce(
            (obj, item) => Object.assign(obj, { [item.id]: { ...item } }),
            {}
          );
          return object;
        },
      },
    },
  ];

  return (
    <>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <DataFramework
          logger={logger}
          resources={resources}
        >
          <ConfirmProvider defaultOptions={confirmationDialogOptions}>
            <Refine>{children}</Refine>
          </ConfirmProvider>
        </DataFramework>
      </QueryParamProvider>
    </>
  );
};

export default CustomApp;
