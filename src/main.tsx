import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { TodoProvider } from './context/todoProvider.tsx'
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TodoProvider>
      <RouterProvider router={router} />
    </TodoProvider>
  </StrictMode>,
)
