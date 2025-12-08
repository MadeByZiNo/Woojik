import api from './api';
import type { 
    BarnLayoutResponse,
    LayoutSaveRequest   
} from '../types/map'; 


export const mapApi = {


    getBarnLayout: async (barnId: number): Promise<BarnLayoutResponse> => {
        const response = await api.get<BarnLayoutResponse>(`/api/map/barns/${barnId}/layout`);
        return response.data;
    },

    saveLayout: async (barnId: number, request: LayoutSaveRequest): Promise<void> => {

        await api.post(`/api/map/barns/${barnId}/layout`, request);
    },
};