import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './index.css'
import App from './App.tsx'

import AdminScreen from './screens/AdminScreen.tsx'
import NotFoundScreen from './screens/NotFoundScreen.tsx'
import UserScreen from './screens/UserScreen.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFoundScreen />,
    children: [
      {
        index: true,
        element: <UserScreen />,
      },
      {
        path: '/admintab',
        element: <AdminScreen />,
      }
    ],
  },
]);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={ queryClient }>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
