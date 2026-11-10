export interface IDashboardResponse {
    user: {
        id: number;
        fullName: string;
    };
    recentConsultations: IRecentConsultation[];
    recentPets: IRecentPet[];
}

export interface IRecentConsultation {
    id: number;
    title: string;
    description: string;
    date: string;
    isSuspended: boolean;
    petId: number;
    petName: string;
    veterinarianId: number;
    veterinarianName: string;
}

export interface IRecentPet {
    id: number;
    name: string;
    speciesName: string;
    breedName: string;
    clientId: number;
    clientName: string;
    isSuspended: boolean;
}
