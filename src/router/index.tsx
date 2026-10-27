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
import { ConsultationEditPage } from '../pages/consultations/ConsultationEditPage';
import { ConsultationCreatePage } from '../pages/consultations/ConsultationCreatePage';
import { ConsultationActionsPage } from '../pages/consultations/ConsultationActionsPage';
import { ConsultationListPage } from '../pages/consultations/ConsultationListPage';
import { LoginPage } from '../pages/auth/LoginPage';
import Protected from './Protected';
import PublicOnly from './PublicOnly';
import RoleRoute from './RoleRoute';
import { CLINICAL_ROLES, CLIENT_ROLES } from '../utils/roles';
import { MyPetConsultationsPage } from '../pages/consultations/MyPetConsultationsPage';
import { MyPetsPage } from '../pages/pets/MyPetsPage';

const routes: RouteObject[] = [
  {
    element: <PublicOnly />,
    children: [
      { path: 'login', element: <LoginPage /> },
    ]
  },

  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <Protected />,
        children: [

          { index: true, element: <Home /> },

          {
            element: <RoleRoute allowedRoles={CLINICAL_ROLES} />,
            children: [

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
                ],
              },
              { path: 'pets/new', element: <PetCreatePage /> },
              { path: 'pets/:id/edit', element: <PetEditPage /> },
              { path: 'pets/:petId/consultations', element: <MyPetConsultationsPage backTo="/pets" /> },

              {
                path: 'consultations',
                element: <ConsultationListPage />,
                children: [
                  { path: ':id', element: <ConsultationActionsPage /> },
                ],
              },
              { path: 'consultations/new', element: <ConsultationCreatePage /> },
              { path: 'consultations/:id/edit', element: <ConsultationEditPage /> },
            ]
          },
          {
            element: <RoleRoute allowedRoles={CLIENT_ROLES} />,
            children: [
              { path: 'my-pets', element: <MyPetsPage /> },
              { path: 'my-pets/:petId/consultations', element: <MyPetConsultationsPage backTo="/my-pets" /> },
            ],
          },
        ]
      },

      { path: 'about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
