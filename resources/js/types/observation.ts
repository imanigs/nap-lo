export interface ObservationRatingOption {
    value: number;
    label: string;
}

export interface ObservationRatings {
    health_rating: ObservationRatingOption[];
    disposition_rating: ObservationRatingOption[];
    performance_rating: ObservationRatingOption[];
    bcs_rating: ObservationRatingOption[];
}

export interface Observation {
    id: number;
    date: string;
    height_cm: number | null;
    weight_kg: number | null;
    health_rating: ObservationRatingOption | null;
    disposition_rating: ObservationRatingOption | null;
    performance_rating: ObservationRatingOption | null;
    bcs_rating: ObservationRatingOption | null;
    notes: string | null;
}
