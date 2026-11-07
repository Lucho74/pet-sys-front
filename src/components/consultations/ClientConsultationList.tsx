import { formatDate } from '../../utils/datetime';
import { ListState } from '../common/ListState';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
					<ul className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-3">
						{consultations.map((consultation) => (
							<li key={consultation.id}>
								<Card>
									<CardHeader>
										<CardTitle className="whitespace-pre-wrap break-words">{consultation.description}</CardTitle>
										<CardDescription>
											{consultation.date ? formatDate(consultation.date) : 'Sin fecha asignada'}
										</CardDescription>
									</CardHeader>
								</Card>
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