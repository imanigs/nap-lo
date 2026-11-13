export interface Horse {
    id: number;
    name: string;
    gender: string;
    birth_date: string | null;
    status: string | null;
    breed: string | null;
    picture: string | null;
    notes: string | null;
}

export interface GenderOption {
    value: string;
    label: string;
}
