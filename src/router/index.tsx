import { createBrowserRouter } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import App from '../App';
import { Home } from '../pages/Home';
import { NotFound } from '../pages/NotFound';
import { UsersListPage } from '../pages/users/UsersListPage';
import { UserCreatePage } from '../pages/users/UserCreatePage';
import { UserDetailPage } from '../pages/users/UserDetailPage';
import { UserEditPage } from '../pages/users/UserEditPage';
import { PetsListPage } from '../pages/pets/PetsListPage';
import { PetCreatePage } from '../pages/pets/PetCreatePage';
import { PetDetailPage } from '../pages/pets/PetDetailPage';
import { PetEditPage } from '../pages/pets/PetEditPage';
import { ConsultationEditPage } from '../pages/consultations/ConsultationEditPage';
import { ConsultationCreatePage } from '../pages/consultations/ConsultationCreatePage';
import { ConsultationDetailPage } from '../pages/consultations/ConsultationDetailPage';
import { ConsultationListPage } from '../pages/consultations/ConsultationListPage';
import { LoginPage } from '../pages/auth/LoginPage';
import Protected from './Protected';
import PublicOnly from './PublicOnly';
import RoleRoute from './RoleRoute';
import { CLINICAL_ROLES, CLIENT_ROLES, PROFILE_EDIT_ROLES, PROFILE_VIEW_ROLES } from '../utils/roles';
import { MyPetsPage } from '../pages/pets/MyPetsPage';
import { SpeciesPage } from '../pages/species/SpeciesPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { ProfileEditPage } from '../pages/profile/ProfileEditPage';

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

              { path: 'users', element: <UsersListPage /> },
              { path: 'users/new', element: <UserCreatePage /> },
              { path: 'users/:id', element: <UserDetailPage /> },
              { path: 'users/:id/edit', element: <UserEditPage /> },

              { path: 'pets', element: <PetsListPage /> },
              { path: 'pets/new', element: <PetCreatePage /> },
              { path: 'pets/:id', element: <PetDetailPage backTo="/pets" /> },
              { path: 'pets/:id/edit', element: <PetEditPage /> },

              { path: 'species', element: <SpeciesPage /> },

              { path: 'consultations', element: <ConsultationListPage /> },
              { path: 'consultations/new', element: <ConsultationCreatePage /> },
              { path: 'consultations/:id', element: <ConsultationDetailPage /> },
              { path: 'consultations/:id/edit', element: <ConsultationEditPage /> },
            ]
          },
          {
            element: <RoleRoute allowedRoles={CLIENT_ROLES} />,
            children: [
              { path: 'my-pets', element: <MyPetsPage /> },
              { path: 'my-pets/:id', element: <PetDetailPage backTo="/my-pets" /> },
              { path: 'my-pets/:petId/consultations/:id', element: <ConsultationDetailPage /> },
            ],
          },
          {
            element: <RoleRoute allowedRoles={PROFILE_VIEW_ROLES} />,
            children: [
              { path: 'profile', element: <ProfilePage /> },
            ],
          },
          {
            element: <RoleRoute allowedRoles={PROFILE_EDIT_ROLES} />,
            children: [
              { path: 'profile/edit', element: <ProfileEditPage /> },
            ],
          },
        ]
      },

      { path: '*', element: <NotFound /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
