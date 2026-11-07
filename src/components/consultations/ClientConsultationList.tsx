import { formatDate } from '../../utils/datetime';
import { ListState } from '../common/ListState';
import { READONLY_CARD_CLASSES, WIDE_GRID_CLASSES } from '../common/listStyles';

interface ClientConsultationItem {
	id: number;
	description: string;
	date: string;
}

interface ClientConsultationListProps {
	consultations: ClientConsultationItem[];
	isLoading: boolean;
	error: string;
}

export function ClientConsultationList({ consultations, isLoading, error }: ClientConsultationListProps) {
	const hasConsultations = !isLoading && !error && consultations.length > 0;

	return (
		<div className="flex-1 overflow-auto px-4 pb-[100px] pt-4 lg:px-10 lg:pb-12 lg:pt-8">
			<div className="flex h-full w-full flex-col">
				{hasConsultations ? (
					<ul className={WIDE_GRID_CLASSES}>
						{consultations.map((consultation) => (
							<li key={consultation.id} className="flex">
								<div className={READONLY_CARD_CLASSES}>
									<div className="min-w-0 flex-1 text-left">
										<div className="whitespace-pre-wrap break-words text-[15px] font-semibold text-[#27374D]">
											{consultation.description}
										</div>
										<div className="truncate text-[13px] text-[#526D82]">
											{consultation.date ? formatDate(consultation.date) : 'Sin fecha asignada'}
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				) : (
					<ListState
						isLoading={isLoading}
						error={error}
						isEmpty={consultations.length === 0}
						loadingLabel="Cargando consultas..."
						emptyLabel="Esta mascota todavía no tiene consultas."
					/>
				)}
			</div>
		</div>
	);
}