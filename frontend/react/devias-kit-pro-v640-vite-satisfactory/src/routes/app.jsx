import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { Layout as DashboardLayout } from 'src/layouts/app';

const OverviewPage = lazy(() => import('src/pages/app/index'));

// Satisfactory
const GamesPage = lazy(() => import('src/pages/app/satisfactory/games'));
const ProductsPage = lazy(() => import('src/pages/app/satisfactory/products'));
const ProductsDetailPage = lazy(() => import('src/pages/app/satisfactory/product-detail'));

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
        ],
      },
    ],
  },
];
