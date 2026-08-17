import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  handleAddUser,
  handleDeleteUser,
  handleGetAllUser,
  handleGetByIdUser,
  handleUpdateUser,
} from '../../services/users/userService';
import type { IUserRequest, IUserResponse } from '../../services/users/IUser';
import type { User, UserFormState } from './types';

const emptyForm = (): UserFormState => ({
  fullName: '',
  email: '',
  phone: '',
  password: '',
});

const toUser = (userFromApi: IUserResponse): User => ({
  id: Number(userFromApi.id),
  fullName: userFromApi.fullName?.trim() || 'Sin nombre',
  email: userFromApi.email?.trim() || '',
  phone: userFromApi.phone?.trim() || '',
  password: userFromApi.password?.trim() || '',
});

const toRequest = (form: UserFormState): IUserRequest => ({
  fullName: form.fullName,
  email: form.email,
  phone: form.phone,
  password: form.password || '123456',
});

export function useUsersCrud() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserFormState>(emptyForm());
  const [error, setError] = useState('');

  const pathParts = location.pathname.split('/').filter(Boolean);
  const selectedId = pathParts[0] === 'users' && pathParts[1] && !Number.isNaN(Number(pathParts[1]))
    ? Number(pathParts[1])
    : null;

  const screen: 'list' | 'create' | 'edit' =
    pathParts[0] === 'users' && pathParts[1] === 'new'
      ? 'create'
      : pathParts[0] === 'users' && pathParts[2] === 'edit'
        ? 'edit'
        : 'list';

  const selectedUser = users.find((user) => user.id === selectedId) ?? null;
  const isListScreen = screen === 'list';
  const isFormScreen = screen === 'create' || screen === 'edit';
  const showSheet = pathParts[0] === 'users' && pathParts[1] && !Number.isNaN(Number(pathParts[1])) && pathParts.length === 2;
  const showDeleteConfirm = pathParts[0] === 'users' && pathParts[1] && !Number.isNaN(Number(pathParts[1])) && pathParts[2] === 'delete';

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const response = await handleGetAllUser();
        if (!isMounted) return;
        setUsers(response.map(toUser));
      } catch {
        if (!isMounted) return;
        setUsers([]);
      }
    };

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (screen !== 'edit' || selectedId === null) return;

    let isMounted = true;

    const loadOneUser = async () => {
      try {
        const userFromApi = await handleGetByIdUser(String(selectedId));
        if (!isMounted) return;

        const user = toUser(userFromApi);
        setForm({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          password: user.password,
        });
      } catch {
        if (!isMounted) return;
        setError('No se pudo cargar el usuario.');
      }
    };

    loadOneUser();

    return () => {
      isMounted = false;
    };
  }, [screen, selectedId]);

  const setField = (field: keyof UserFormState) => (value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm());
    setError('');
  };

  const openCreate = () => {
    resetForm();
    navigate('/users/new');
  };

  const openEditSelected = () => {
    if (!selectedUser) return;

    setForm({
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      phone: selectedUser.phone,
      password: selectedUser.password,
    });
    setError('');
    navigate(`/users/${selectedUser.id}/edit`);
  };

  const cancelForm = () => {
    setError('');
    navigate('/users');
  };

  const goToUsers = () => navigate('/users');
  const goToUser = (userId: number) => navigate(`/users/${userId}`);

  const saveUser = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !form.password.trim()) {
      setError('Completa nombre, correo, teléfono y contraseña.');
      return;
    }

    try {
      if (screen === 'edit' && selectedId !== null) {
        const updated = await handleUpdateUser(String(selectedId), toRequest(form));
        setUsers((current) => current.map((user) => (user.id === selectedId ? toUser(updated) : user)));
        setError('');
        navigate('/users');
        return;
      }

      const created = await handleAddUser(toRequest(form));
      setUsers((current) => [...current, toUser(created)]);
      setError('');
      navigate('/users');
    } catch {
      setError('No se pudo guardar el usuario.');
    }
  };

  const requestDelete = () => {
    if (selectedId === null) return;
    navigate(`/users/${selectedId}/delete`);
  };

  const cancelDelete = () => {
    if (selectedId === null) {
      navigate('/users');
      return;
    }

    navigate(`/users/${selectedId}`);
  };

  const confirmDelete = async () => {
    if (selectedId === null) {
      navigate('/users');
      return;
    }

    try {
      await handleDeleteUser(String(selectedId));
      setUsers((current) => current.filter((user) => user.id !== selectedId));
      navigate('/users');
    } catch {
      setError('No se pudo eliminar el usuario.');
      navigate('/users');
    }
  };

  return {
    users,
    form,
    formError: error,
    screen,
    selected: selectedUser,
    showSheet,
    showDeleteConfirm,
    isListScreen,
    isFormScreen,
    openCreate,
    openEditSelected,
    cancelForm,
    setField,
    saveUser,
    requestDelete,
    cancelDelete,
    confirmDelete,
    goToUsers,
    goToUser,
  };
}
