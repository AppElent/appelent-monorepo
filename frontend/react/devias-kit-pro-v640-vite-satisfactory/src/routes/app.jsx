import { lazy,Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as DashboardLayout } from 'src/layouts/app';

const OverviewPage = lazy(() => import('src/pages/app/index'));
const AccountPage = lazy(() => import('src/pages/app/account'));

// Satisfactory
const GamesPage = lazy(() => import('src/pages/app/satisfactory/games'));
const ProductsPage = lazy(() => import('src/pages/app/satisfactory/products'));
const ProductsDetailPage = lazy(() => import('src/pages/app/satisfactory/product-detail'));
const Recipes = lazy(() => import('src/pages/app/satisfactory/recipes'));
const Calculations = lazy(() => import('src/pages/app/satisfactory/calculations'));
const FactoryPlanner = lazy(() => import('src/pages/app/satisfactory/factory-planner'));

export const appRoutes = [
  {
    path: 'app',
    element: (
      <DashboardLayout>
        <Suspense>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      {
        index: true,
        element: <OverviewPage />,
      },
      {
        path: 'account',
        element: <AccountPage />,
      },
      {
        path: 'satisfactory',
        children: [
          {
            index: true,
            element: <GamesPage />,
          },
          {
            path: 'games',
            element: <GamesPage />,
          },
          {
            path: 'products',
            element: <ProductsPage />,
          },
          {
            path: 'products',
            children: [
              {
                path: ':productId',
                element: <ProductsDetailPage />,
              },
            ],
          },
          {
            path: 'recipes',
            element: <Recipes />,
          },
          {
            path: 'calculations',
            element: <Calculations />,
          },
          {
            path: 'planner',
            element: <FactoryPlanner />,
          },
        ],
      },
    ],
  },
];
