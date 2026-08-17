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
                <svg width="8" height="14" viewBox="0 0 8 14" className="shrink-0">
                  <path d="M7 1L1 7l6 6" stroke="#9DB2BF" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Atrás
              </button>
            ) : (
              <div className="flex h-[22px] w-[22px] items-center justify-center rounded-[6px] bg-[#526D82]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" stroke="#DDE6ED" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="12" cy="8" r="4" stroke="#DDE6ED" strokeWidth="2" />
                </svg>
              </div>
            )}

            {isListScreen ? <div className="h-[22px] w-[22px]" /> : null}
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
            isLoading={isLoadingUser}
            isSaving={isSaving}
            onFullNameChange={setField('fullName')}
            onEmailChange={setField('email')}
            onPhoneChange={setField('phone')}
            onPasswordChange={setField('password')}
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
