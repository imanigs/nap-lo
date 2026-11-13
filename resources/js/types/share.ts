export interface Share {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface SharedWithUser {
    id: number;
    name: string;
    owner: string;
    role: string;
}

export interface SharedByUser {
    id: number;
    name: string;
    shares: Share[];
}

export interface ShareSearch {
    user?: { name: string; email: string };
    error?: string;
}
