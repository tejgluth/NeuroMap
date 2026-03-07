import { createBrowserRouter } from 'react-router-dom'

import RootLayout from '../components/layout/RootLayout'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'map',
        lazy: async () => ({ Component: (await import('../pages/MapPage')).default }),
      },
      {
        path: 'places/:slug',
        lazy: async () => ({ Component: (await import('../pages/PlacePage')).default }),
      },
      {
        path: 'add-review',
        lazy: async () => ({ Component: (await import('../pages/AddReviewPage')).default }),
      },
      {
        path: 'about',
        lazy: async () => ({ Component: (await import('../pages/AboutPage')).default }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
