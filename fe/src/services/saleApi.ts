// src/services/saleApi.ts

import api from './api';
import type { SaleRequest, SaleResponse } from '../types/sale'; 

export const saleApi = {

   registerSale: async (livestockId: number, request: SaleRequest): Promise<number> => {
        const response = await api.post<number>(`/api/sales/${livestockId}`, request);
        return response.data;
    },

    getSaleInfo: async (livestockId: number): Promise<SaleResponse> => {
        const response = await api.get<SaleResponse>(`/api/sales/${livestockId}`);
        return response.data;
    },
    

    getSoldLivestockList: async (): Promise<SaleResponse[]> => {
        const response = await api.get<SaleResponse[]>(`/api/sales/sold-list`);
        return response.data;
    },

};