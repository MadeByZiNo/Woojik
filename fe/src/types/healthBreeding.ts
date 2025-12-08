export type HealthType = 'VACCINE' | 'TREAT';

export interface HealthRequest {
    type: HealthType;
    date: string;      
    diseaseName: string;
    medicine: string;
    description: string;
    withdrawalPeriod: number;
}

// --- 번식 (Breeding) 요청 타입 ---
export interface EstrusRequest {
    date: string;
    notes: string | null;
}

export interface BreedingAiRequest {
    date: string;
    sireCode: string;
    notes: string | null;
}

export interface PregnancyCheckRequest {
    date: string;
    isPregnant: boolean;
    notes: string | null;
}

export interface CalvingRequest {
    date: string;
    calfEarTag: string;
    calfName: string | null;
    calfGender: 'MALE' | 'FEMALE';
}