import api from './api';
import type { BarnOption, PenOption } from '../types/barn';
export const barnApi = {
    // 전체 축사 목록 조회
    getAllBarns: async (): Promise<BarnOption[]> => {
        const response = await api.get<BarnOption[]>('/api/barns');
        return response.data;
    },

    // 특정 축사 ID로 방 목록 조회
    getPensByBarn: async (barnId: number): Promise<PenOption[]> => {
        const response = await api.get<PenOption[]>(`/api/barns/${barnId}/pens`);
        return response.data;
    },
};