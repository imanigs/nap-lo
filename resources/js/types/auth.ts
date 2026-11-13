type User = {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_notifications: boolean;
};

export type Auth = {
    user: User | null;
};
