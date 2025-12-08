import api from './api';
import type { EstrusRequest, BreedingAiRequest, PregnancyCheckRequest, CalvingRequest } from '../types/healthBreeding';

export const breedingApi = {
    // 1. 발정 등록 (POST /api/livestocks/{id}/estrus)
    registerEstrus: async (id: number, request: EstrusRequest): Promise<void> => {
        await api.post(`/api/livestocks/${id}/estrus`, request);
    },

    // 2. 인공수정 등록 (POST /api/livestocks/{id}/ai)
    registerAi: async (id: number, request: BreedingAiRequest): Promise<number> => {
        const response = await api.post<number>(`/api/livestocks/${id}/ai`, request);
        return response.data;
    },

    // 3. 임신 감정 등록 (POST /api/livestocks/{id}/pregnancy-checks)
    registerPregnancyCheck: async (id: number, request: PregnancyCheckRequest): Promise<void> => {
        await api.post(`/api/livestocks/${id}/pregnancy-checks`, request);
    },

    // 4. 분만 등록 (POST /api/livestocks/{id}/births)
    registerCalving: async (id: number, request: CalvingRequest): Promise<void> => {
        await api.post(`/api/livestocks/${id}/births`, request);
    },
};