import { Link } from 'react-router-dom';
import { ChevronLeft, House, User } from 'lucide-react';
import { ActionSheet } from './ActionSheet';
import { DeleteDialog } from './DeleteDialog';
import { Form } from './Form';
import { List } from './List';
import { useUsersCrud } from './useUsersCrud';

export function UserManagement() {
  const {
    users,
    form,
    formError,
    fieldErrors,
    loadError,
    isLoadingUsers,
    isLoadingUser,
    isSaving,
    isDeleting,
    screen,
    selected,
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
  } = useUsersCrud();

  return (
    <div className="flex min-h-screen w-full bg-[#e9edf1]">
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#DDE6ED] font-sans">
        <div className="flex-none bg-[#27374D] px-5 pb-4 pt-14">
          <div className="flex items-center justify-between">
            {isFormScreen ? (
              <button
                type="button"
                onClick={cancelForm}
                className="flex cursor-pointer items-center gap-1 text-[15px] font-medium text-[#DDE6ED]"
              >
                <ChevronLeft size={16} strokeWidth={2.5} className="shrink-0 text-[#9DB2BF]" />
                Atrás
              </button>
            ) : (
              <div className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-[#526D82]">
                <User size={13} strokeWidth={2} className="text-[#DDE6ED]" />
              </div>
            )}

            {isListScreen ? (
              <Link
                to="/"
                aria-label="Volver al panel"
                className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] text-[#9DB2BF] transition-colors hover:bg-[#526D82] hover:text-[#DDE6ED]"
              >
                <House size={17} strokeWidth={2} />
              </Link>
            ) : null}
          </div>

          <div className="mt-3.5 flex flex-col gap-0.5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#9DB2BF]">
              {isListScreen ? 'Sysadmin' : screen === 'edit' ? 'Editar' : 'Nuevo'}
            </div>
            <div className="text-[26px] font-bold tracking-[-0.3px] text-[#DDE6ED]">
              {isListScreen ? 'Usuarios' : screen === 'edit' ? 'Editar usuario' : 'Nuevo usuario'}
            </div>
          </div>
        </div>

        {isListScreen ? (
          <List
            users={users}
            isLoading={isLoadingUsers}
            error={loadError}
            onSelect={goToUser}
            onCreate={openCreate}
          />
        ) : null}

        {isFormScreen ? (
          <Form
            form={form}
            formError={formError}
            fieldErrors={fieldErrors}
            canChangeRole={screen !== 'edit'}
            isLoading={isLoadingUser}
            isSaving={isSaving}
            onFullNameChange={setField('fullName')}
            onEmailChange={setField('email')}
            onPhoneChange={setField('phone')}
            onPasswordChange={setField('password')}
            onRoleNameChange={setField('roleName')}
            onDniChange={setField('dni')}
            onCancel={cancelForm}
            onSave={saveUser}
            saveLabel={screen === 'edit' ? 'Guardar cambios' : 'Crear usuario'}
          />
        ) : null}

        {showSheet && selected ? (
          <ActionSheet
            selected={selected}
            onClose={goToUsers}
            onEdit={openEditSelected}
            onDelete={requestDelete}
          />
        ) : null}

        {showDeleteConfirm && selected ? (
          <DeleteDialog
            selectedName={selected.fullName}
            isDeleting={isDeleting}
            onCancel={cancelDelete}
            onConfirm={confirmDelete}
          />
        ) : null}
      </div>
    </div>
  );
}
