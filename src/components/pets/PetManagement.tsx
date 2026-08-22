import { Link } from 'react-router-dom';
import { ChevronLeft, House, PawPrint } from 'lucide-react';
import { ActionSheet } from './ActionSheet';
import { DeleteDialog } from './DeleteDialog';
import { Form } from './Form';
import { List } from './List';
import { usePetsCrud } from './usePetsCrud';

export function PetManagement() {
  const {
    pets,
    form,
    formError,
    fieldErrors,
    loadError,
    isLoadingPets,
    isLoadingPet,
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
    savePet,
    requestDelete,
    cancelDelete,
    confirmDelete,
    goToPets,
    goToPet,
  } = usePetsCrud();

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
                <PawPrint size={13} strokeWidth={2} className="text-[#DDE6ED]" />
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
              {isListScreen ? 'Sysadmin' : screen === 'edit' ? 'Editar' : 'Nueva'}
            </div>
            <div className="text-[26px] font-bold tracking-[-0.3px] text-[#DDE6ED]">
              {isListScreen ? 'Mascotas' : screen === 'edit' ? 'Editar mascota' : 'Nueva mascota'}
            </div>
          </div>
        </div>

        {isListScreen ? (
          <List
            pets={pets}
            isLoading={isLoadingPets}
            error={loadError}
            onSelect={goToPet}
            onCreate={openCreate}
          />
        ) : null}

        {isFormScreen ? (
          <Form
            form={form}
            formError={formError}
            fieldErrors={fieldErrors}
            isLoading={isLoadingPet}
            isSaving={isSaving}
            onNameChange={setField('name')}
            onSpecieChange={setField('specie')}
            onBreedChange={setField('breed')}
            onBirthDateChange={setField('birthDate')}
            onClientIdChange={setField('clientId')}
            onCancel={cancelForm}
            onSave={savePet}
            saveLabel={screen === 'edit' ? 'Guardar cambios' : 'Crear mascota'}
          />
        ) : null}

        {showSheet && selected ? (
          <ActionSheet
            selected={selected}
            onClose={goToPets}
            onEdit={openEditSelected}
            onDelete={requestDelete}
          />
        ) : null}

        {showDeleteConfirm && selected ? (
          <DeleteDialog
            selectedName={selected.name}
            isDeleting={isDeleting}
            onCancel={cancelDelete}
            onConfirm={confirmDelete}
          />
        ) : null}
      </div>
    </div>
  );
}
