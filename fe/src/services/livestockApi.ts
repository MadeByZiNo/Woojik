import api from './api';
import type { LivestockResponse, LivestockDetailResponse,
    LivestockRequest, LivestockUpdateRequest
 } from '../types/livestock';

export const livestockApi = {

  // 전체 조회
  // GET /api/livestocks
  getManageableLivestock: async (): Promise<LivestockResponse[]> => {
    const response = await api.get<LivestockResponse[]>('/api/livestocks');
    console.log(response);
    return response.data;
  },

  // 상세 조회
  // GET /api/livestocks/{id}
  getDetail: async (id: number): Promise<LivestockDetailResponse> => {
    const response = await api.get<LivestockDetailResponse>(`/api/livestocks/${id}`);
    return response.data;
    },

    register: async (request: LivestockRequest): Promise<number> => {
        const response = await api.post<number>('/api/livestocks', request);
        return response.data;
    },


    update: async (id: number, request: LivestockUpdateRequest): Promise<void> => {
        await api.put(`/api/livestocks/${id}`, request);
    },

   getListByPen: async (penId: number): Promise<LivestockResponse[]> => {
        const response = await api.get<LivestockResponse[]>(`/api/livestocks/by-pen/${penId}`);
        return response.data;
    },

    moveLivestock: async (livestockId: number, destinationPenId: number): Promise<void> => {
        await api.post(`/api/livestocks/${livestockId}/move`, { destinationPenId });
    }
}