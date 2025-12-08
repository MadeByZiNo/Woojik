export interface PenLayoutData {
    penId: number;
    penName: string;
    capacity: number;
    gridRow: number; // 시작 행 
    gridCol: number; // 시작 열 
    rowSpan: number; // 높이
    colSpan: number; // 너비
}


export interface BarnLayoutResponse {
    barnId: number;
    barnName: string;
    layouts: PenLayoutData[];
    unplacedPens: PenLayoutData[]; 
    livestockCounts: { [penId: number]: number }; 
}

export interface LayoutSaveRequest {
    barnId: number;
    layouts: PenLayoutData[];
}