import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Users } from '../pages/Users';
import { Pets } from '../pages/Pets';
import About from '../pages/About';
import App from '../App';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'users',
        element: <Users />
      },
      {
        path: 'users/new',
        element: <Users />
      },
      {
        path: 'users/:id',
        element: <Users />
      },
      {
        path: 'users/:id/edit',
        element: <Users />
      },
      {
        path: 'users/:id/delete',
        element: <Users />
      },
      {
        path: 'pets',
        element: <Pets />
      },
      {
        path: 'pets/new',
        element: <Pets />
      },
      {
        path: 'pets/:id',
        element: <Pets />
      },
      {
        path: 'pets/:id/edit',
        element: <Pets />
      },
      {
        path: 'pets/:id/delete',
        element: <Pets />
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: '*',
        element: <div>404 Not Found</div>
      },
    ]
  }
];

export const router = createBrowserRouter(routes);
