export const paths = {
  index: '/demo/',
  checkout: '/demo/checkout',
  contact: '/demo/contact',
  pricing: '/demo/pricing',
  auth: {
    auth0: {
      callback: '/demo/auth/auth0/callback',
      login: '/demo/auth/auth0/login'
    },
    jwt: {
      login: '/demo/auth/jwt/login',
      register: '/demo/auth/jwt/register'
    },
    firebase: {
      login: '/demo/auth/firebase/login',
      register: '/demo/auth/firebase/register'
    },
    amplify: {
      confirmRegister: '/demo/auth/amplify/confirm-register',
      forgotPassword: '/demo/auth/amplify/forgot-password',
      login: '/demo/auth/amplify/login',
      register: '/demo/auth/amplify/register',
      resetPassword: '/demo/auth/amplify/reset-password'
    }
  },
  authDemo: {
    forgotPassword: {
      classic: '/demo/auth-demo/forgot-password/classic',
      modern: '/demo/auth-demo/forgot-password/modern'
    },
    login: {
      classic: '/demo/auth-demo/login/classic',
      modern: '/demo/auth-demo/login/modern'
    },
    register: {
      classic: '/demo/auth-demo/register/classic',
      modern: '/demo/auth-demo/register/modern'
    },
    resetPassword: {
      classic: '/demo/auth-demo/reset-password/classic',
      modern: '/demo/auth-demo/reset-password/modern'
    },
    verifyCode: {
      classic: '/demo/auth-demo/verify-code/classic',
      modern: '/demo/auth-demo/verify-code/modern'
    }
  },
  dashboard: {
    index: '/demo/dashboard',
    academy: {
      index: '/demo/dashboard/academy',
      courseDetails: '/demo/dashboard/academy/courses/:courseId'
    },
    account: '/demo/dashboard/account',
    analytics: '/demo/dashboard/analytics',
    blank: '/demo/dashboard/blank',
    blog: {
      index: '/demo/dashboard/blog',
      postDetails: '/demo/dashboard/blog/:postId',
      postCreate: '/demo/dashboard/blog/create'
    },
    calendar: '/demo/dashboard/calendar',
    chat: '/demo/dashboard/chat',
    crypto: '/demo/dashboard/crypto',
    customers: {
      index: '/demo/dashboard/customers',
      details: '/demo/dashboard/customers/:customerId',
      edit: '/demo/dashboard/customers/:customerId/edit'
    },
    ecommerce: '/demo/dashboard/ecommerce',
    fileManager: '/demo/dashboard/file-manager',
    invoices: {
      index: '/demo/dashboard/invoices',
      details: '/demo/dashboard/invoices/:orderId'
    },
    jobs: {
      index: '/demo/dashboard/jobs',
      create: '/demo/dashboard/jobs/create',
      companies: {
        details: '/demo/dashboard/jobs/companies/:companyId'
      }
    },
    kanban: '/demo/dashboard/kanban',
    logistics: {
      index: '/demo/dashboard/logistics',
      fleet: '/demo/dashboard/logistics/fleet'
    },
    mail: '/demo/dashboard/mail',
    orders: {
      index: '/demo/dashboard/orders',
      details: '/demo/dashboard/orders/:orderId'
    },
    products: {
      index: '/demo/dashboard/products',
      create: '/demo/dashboard/products/create'
    },
    social: {
      index: '/demo/dashboard/social',
      profile: '/demo/dashboard/social/profile',
      feed: '/demo/dashboard/social/feed'
    }
  },
  components: {
    index: '/demo/components',
    dataDisplay: {
      detailLists: '/demo/components/data-display/detail-lists',
      tables: '/demo/components/data-display/tables',
      quickStats: '/demo/components/data-display/quick-stats'
    },
    lists: {
      groupedLists: '/demo/components/lists/grouped-lists',
      gridLists: '/demo/components/lists/grid-lists'
    },
    forms: '/demo/components/forms',
    modals: '/demo/components/modals',
    charts: '/demo/components/charts',
    buttons: '/demo/components/buttons',
    typography: '/demo/components/typography',
    colors: '/demo/components/colors',
    inputs: '/demo/components/inputs'
  },
  docs: {
    analytics: {
      configuration: '/demo/docs/analytics-configuration',
      eventTracking: '/demo/docs/analytics-event-tracking',
      introduction: '/demo/docs/analytics-introduction'
    },
    auth: {
      amplify: '/demo/docs/auth-amplify',
      auth0: '/demo/docs/auth-auth0',
      firebase: '/demo/docs/auth-firebase',
      jwt: '/demo/docs/auth-jwt'
    },
    changelog: '/demo/docs/changelog',
    contact: '/demo/docs/contact',
    dependencies: '/demo/docs/dependencies',
    deployment: '/demo/docs/deployment',
    environmentVariables: '/demo/docs/environment-variables',
    gettingStarted: '/demo/docs/getting-started',
    guards: {
      auth: '/demo/docs/guards-auth',
      guest: '/demo/docs/guards-guest',
      roleBased: '/demo/docs/guards-role-based'
    },
    furtherSupport: '/demo/docs/further-support',
    internationalization: '/demo/docs/internationalization',
    mapbox: '/demo/docs/mapbox',
    redux: '/demo/docs/redux',
    routing: '/demo/docs/routing',
    rtl: '/demo/docs/rtl',
    serverCalls: '/demo/docs/server-calls',
    settings: '/demo/docs/settings',
    theming: '/demo/docs/theming',
    welcome: '/demo/docs/welcome'
  },
  401: '/demo/401',
  404: '/demo/404',
  500: '/demo/500'
};
