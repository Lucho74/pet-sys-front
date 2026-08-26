import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import App from '../App';
import { Home } from '../pages/Home';
import About from '../pages/About';
import { NotFound } from '../pages/NotFound';
import { UsersListPage } from '../pages/users/UsersListPage';
import { UserCreatePage } from '../pages/users/UserCreatePage';
import { UserEditPage } from '../pages/users/UserEditPage';
import { UserActionsPage } from '../pages/users/UserActionsPage';
import { UserDeletePage } from '../pages/users/UserDeletePage';
import { PetsListPage } from '../pages/pets/PetsListPage';
import { PetCreatePage } from '../pages/pets/PetCreatePage';
import { PetEditPage } from '../pages/pets/PetEditPage';
import { PetActionsPage } from '../pages/pets/PetActionsPage';
import { PetDeletePage } from '../pages/pets/PetDeletePage';
import { ConsultationDeletePage } from '../pages/consultations/ConsultationDeletePage';
import { ConsultationEditPage } from '../pages/consultations/ConsultationEditPage';
import { ConsultationCreatePage } from '../pages/consultations/ConsultationCreatePage';
import { ConsultationActionsPage } from '../pages/consultations/ConsultationActionsPage';
import { ConsultationsListPage } from '../pages/consultations/ConsultationListPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },

      {
        path: 'users',
        element: <UsersListPage />,
        children: [
          { path: ':id', element: <UserActionsPage /> },
          { path: ':id/delete', element: <UserDeletePage /> },
        ],
      },
      { path: 'users/new', element: <UserCreatePage /> },
      { path: 'users/:id/edit', element: <UserEditPage /> },

      {
        path: 'pets',
        element: <PetsListPage />,
        children: [
          { path: ':id', element: <PetActionsPage /> },
          { path: ':id/delete', element: <PetDeletePage /> },
        ],
      },
      { path: 'pets/new', element: <PetCreatePage /> },
      { path: 'pets/:id/edit', element: <PetEditPage /> },

      {
        path: 'consultations',
        element: <ConsultationsListPage />,
        children: [
          { path: ':id', element: <ConsultationActionsPage /> },
          { path: ':id/delete', element: <ConsultationDeletePage /> },
        ],
      },
      { path: 'consultations/new', element: <ConsultationCreatePage /> },
      { path: 'consultations/:id/edit', element: <ConsultationEditPage /> },

      { path: 'pets/new', element: <PetCreatePage /> },
      { path: 'pets/:id/edit', element: <PetEditPage /> },

      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
