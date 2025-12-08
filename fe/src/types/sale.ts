export interface SaleRequest {
    saleDate: string; 
    price: number;
    customerName: string;
    weight: number;
    grade: string;
    notes: string;
}

export interface SaleResponse {
    id: number;
    livestockId: number;
    earTag: string;
    saleDate: string;
    price: number;
    customerName: string;
    weight: number;
    grade: string;
    notes: string;
    
    birthDate: string; 
    breed: string; 
}