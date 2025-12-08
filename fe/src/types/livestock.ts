type GenderType = 'MALE' | 'FEMALE' | 'CASTRATED';

export interface LivestockResponse {
  id: number;
  earTag: string;       
  name: string | null;  
  gender: string;       
  status: string;      
  location: string;    
  birthDate: string;   
  months: number;      
}

export interface HealthHistory {
    id: number;
    type: 'VACCINE' | 'TREAT';
    eventDate: string; // LocalDate
    diseaseName: string;
    medicine: string;
    description: string;
    withdrawalPeriod: number;
}

export interface BreedingHistory {
    id: number;
    type: 'ESTRUS' | 'AI' | 'PREG_CHECK' | 'CALVING';
    eventDate: string; // LocalDate
    sireCode: string | null;
    isPregnant: boolean | null;
    expectedDate: string | null;
    notes: string | null;
}

export interface LivestockDetailResponse extends LivestockResponse {
    // 족보
    motherId: number | null;
    motherEarTag: string | null;
    fatherId: number | null;
    fatherEarTag: string | null;

    // 건강/번식 요약
    breed: string | null;
    notes: string | null;
    withdrawalDate: string | null;      // 휴약기간 만료일
    lastTreatment: string | null;       // 최근 치료/백신 이름
    lastTreatmentDate: string | null;   // 최근 치료일
    lastEstrusDate: string | null;      // 마지막 발정일
    lastAiDate: string | null;          // 마지막 수정일
    expectedDate: string | null;        // 분만 예정일
    breedingCount: number | null;       // 산차 (출산 횟수)
    
    // 이력 리스트
    healthHistory: HealthHistory[];
    breedingHistory: BreedingHistory[];

    penId: number; // 현재 펜 ID
    barnId: number; // 현재 축사 ID
}

export interface LivestockRequest {
    earTag: string;
    name: string | null;
    birthDate: string; // YYYY-MM-DD 형식 (LocalDate)
    gender: GenderType;
    breed: string;
    penId: number; // Long -> number
}

export interface LivestockUpdateRequest {
    name: string | null;
    gender: GenderType;
    birthDate: string;
    breed: string;
    notes: string;
}