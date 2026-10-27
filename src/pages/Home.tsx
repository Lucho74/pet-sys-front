import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ScreenShell } from '../components/layout/ScreenShell';
import { getVisibleNavItems } from '../components/layout/navigation';
import { ListState } from '../components/common/ListState';
import { CARD_CLASSES, WIDE_GRID_CLASSES } from '../components/common/listStyles';
import { ConsultationDate } from '../components/consultations/ConsultationDate';
import { useAuth } from '../contexts/AuthenticationContext';
import { handleGetAllConsultations } from '../services/consultation/consultationService';
import { handleGetAllPet } from '../services/pets/petService';
import { hasDateTime, todayDate, toInputDate } from '../utils/datetime';
import { CLINICAL_ROLES } from '../utils/roles';

const UPCOMING_LIMIT = 6;

const SECTION_TITLE_CLASSES = 'text-[20px] font-extrabold text-[#27374D] lg:text-[22px]';

interface UpcomingConsultation {
  id: number;
  description: string;
  date: string;
  petName: string;
}

export function Home() {
  const { role } = useAuth();
  const sections = getVisibleNavItems(role).filter((item) => item.to !== '/');
  const isClinical = role !== null && CLINICAL_ROLES.includes(role);

  const [upcoming, setUpcoming] = useState<UpcomingConsultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isClinical) return;

    // Las mascotas solo aportan el nombre: si fallan, las consultas se muestran igual.
    Promise.all([handleGetAllConsultations(), handleGetAllPet().catch(() => [])])
      .then(([consultations, pets]) => {
        const petNames = new Map(pets.map((pet) => [pet.id, pet.name?.trim() || 'Sin nombre']));
        const today = todayDate();

        setUpcoming(
          consultations
            .filter((consultation) => !consultation.isDeleted && hasDateTime(consultation.date))
            .map((consultation) => ({
              id: consultation.id,
              description: consultation.description?.trim() || 'Sin descripción',
              date: toInputDate(consultation.date),
              petName:
                consultation.petId === null ? 'Sin mascota' : petNames.get(consultation.petId) || `Mascota #${consultation.petId}`,
            }))
            .filter((consultation) => consultation.date >= today)
            .toSorted((a, b) => a.date.localeCompare(b.date))
            .slice(0, UPCOMING_LIMIT),
        );
      })
      .catch(() => setError('No se pudieron cargar las próximas consultas.'))
      .finally(() => setIsLoading(false));
  }, [isClinical]);

  return (
    <ScreenShell title="Panel">
      <div className="flex-1 overflow-auto px-4 pb-6 pt-4 lg:px-10 lg:pb-12 lg:pt-6">
        <div className="flex max-w-[1200px] flex-col gap-8 lg:gap-10">
          {isClinical ? (
            <section aria-labelledby="upcoming-title">
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h2 id="upcoming-title" className={SECTION_TITLE_CLASSES}>
                  Próximas consultas
                </h2>
                <Link
                  to="/consultations"
                  className="inline-flex min-h-11 items-center rounded-md text-[15px] font-bold text-[#27374D] underline underline-offset-4 hover:text-[#526D82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D]"
                >
                  Ver todas
                </Link>
              </div>

              {!isLoading && !error && upcoming.length > 0 ? (
                <ul className={WIDE_GRID_CLASSES}>
                  {upcoming.map((consultation) => (
                    <li key={consultation.id} className="flex">
                      <Link to={`/consultations/${consultation.id}`} className={CARD_CLASSES}>
                        <ConsultationDate date={consultation.date} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[16px] font-bold text-[#27374D]">{consultation.petName}</div>
                          <div className="truncate text-[14px] text-[#526D82]">{consultation.description}</div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <ListState
                  isLoading={isLoading}
                  error={error}
                  isEmpty={upcoming.length === 0}
                  loadingLabel="Cargando próximas consultas..."
                  emptyLabel="No hay consultas agendadas desde hoy. Agendá una desde «Consultas»."
                />
              )}
            </section>
          ) : null}

          <nav aria-labelledby="sections-title">
            <h2 id="sections-title" className={`mb-3 ${SECTION_TITLE_CLASSES}`}>
              Secciones
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:gap-4 xl:grid-cols-3">
              {sections.map(({ to, label, description, icon: Icon }) => (
                <li key={to} className="flex">
                  <Link
                    to={to}
                    className="group flex w-full cursor-pointer items-center gap-4 rounded-[20px] border border-[#E3E9EE] bg-white p-4 text-left transition-colors hover:border-[#526D82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#27374D] focus-visible:ring-offset-2 lg:flex-col lg:items-start lg:gap-5 lg:p-7"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8EDF7] lg:h-14 lg:w-14">
                      <Icon size={24} strokeWidth={2.2} className="text-[#27374D]" aria-hidden="true" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[17px] font-extrabold text-[#27374D] lg:text-[20px]">{label}</div>
                      <div className="text-[14px] leading-5 text-[#526D82]">{description}</div>
                    </div>

                    <ChevronRight
                      size={20}
                      strokeWidth={2.4}
                      className="shrink-0 text-[#9DB2BF] transition-colors group-hover:text-[#27374D] lg:hidden"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </ScreenShell>
  );
}
