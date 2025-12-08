import api from './api';
import { type HealthRequest } from '../types/healthBreeding';

export const healthApi = {
    // 1. 질병/백신 등록 (POST /api/livestocks/{id}/healths)
    registerHealth: async (id: number, request: HealthRequest): Promise<void> => {
        await api.post(`/api/livestocks/${id}/healths`, request);
    },

    // 2. 회복 처리 (PATCH /api/livestocks/{id}/recover)
    recover: async (id: number): Promise<void> => {
        await api.patch(`/api/livestocks/${id}/recover`);
    },
};