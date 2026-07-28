import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { Home } from '../pages/Home';
import About from '../pages/About';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '*',
    element: <h1>404 - Página no encontrada</h1>,
  },
];

export const router = createBrowserRouter(routes);
