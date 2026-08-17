import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import { Home } from '../pages/Home';
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
        element: <Home />
      },
      {
        path: 'users/new',
        element: <Home />
      },
      {
        path: 'users/:id',
        element: <Home />
      },
      {
        path: 'users/:id/edit',
        element: <Home />
      },
      {
        path: 'users/:id/delete',
        element: <Home />
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
