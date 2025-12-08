// src/components/maps/BarnMapView.tsx

import React, { useState, useEffect } from 'react';
import { mapApi } from '../../services/mapApi'; 
import { AlertCircle } from 'lucide-react';
import type { BarnLayoutResponse } from '../../types/map'; 
import LivestockListModal from '../livestock/LivestockListModal';

// NOTE: 타입은 외부 파일에서 import 됩니다.
interface PenLayoutData {
    penId: number;
    penName: string;
    capacity: number;
    gridRow: number;
    gridCol: number;
    rowSpan: number;
    colSpan: number;
}

interface Props {
    barnId: number;
}

// 💡 셀 크기 정의 (Editor와 통일)
const GRID_CELL_SIZE = 100; // 각 그리드 셀의 크기 (px)
const GRID_GAP = 2; // 격자 간격 (px)
// 컨테이너 패딩 (12px * 2) + 보더 (1px * 2)
const CONTAINER_OFFSET = 12 * 2 + 1 * 2; 

const BarnMapView = ({ barnId }: Props) => {
    const [layoutData, setLayoutData] = useState<BarnLayoutResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [clickedPen, setClickedPen] = useState<{ id: number; name: string } | null>(null);
    useEffect(() => {
        const fetchLayout = async () => {
            if (!barnId) return;
            setLoading(true);
            setError(null);
            try {
                const data: BarnLayoutResponse = await mapApi.getBarnLayout(barnId);
                setLayoutData(data);
            } catch (err: any) {
                console.error("Map data failed to load:", err);
                setError("지도 데이터를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchLayout();
    }, [barnId]);

    const handlePenClick = (penId: number, penName: string) => {
        // 해당 방에 가축이 1마리라도 있어야 모달을 띄움 (선택 사항)
        const count = layoutData?.livestockCounts[penId] || 0;
        if (count > 0) {
            setClickedPen({ id: penId, name: penName });
        } else {
            alert(`"${penName}" 방에 현재 가축이 없습니다.`);
        }
    };

    // --- 렌더링 상태 처리 ---
    if (loading) return <div className="p-8 text-center text-gray-500">지도를 로드 중입니다...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-bold"><AlertCircle size={20} className="inline mr-2" />{error}</div>;
    
    // 🚨 안전한 체크: layoutData와 layouts 배열이 모두 존재하는지 확인
    if (!layoutData || !layoutData.layouts || layoutData.layouts.length === 0) return (
        <div className="p-8 text-center text-gray-500 border border-dashed rounded-lg">
            배치 정보가 등록되지 않았습니다. (Barn ID: {barnId})
        </div>
    );

    // --- 그리드 크기 계산 ---
    const maxRow = Math.max(...layoutData.layouts.map(l => l.gridRow + l.rowSpan - 1));
    const maxCol = Math.max(...layoutData.layouts.map(l => l.gridCol + l.colSpan - 1));
    
    const totalGapWidth = (maxCol > 0 ? maxCol - 1 : 0) * GRID_GAP;
    const calculatedWidth = (maxCol * GRID_CELL_SIZE) + totalGapWidth + CONTAINER_OFFSET;

    // 그리드 스타일
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${maxCol}, ${GRID_CELL_SIZE}px)`, 
        gridTemplateRows: `repeat(${maxRow}, ${GRID_CELL_SIZE}px)`, 
        
        gap: `${GRID_GAP}px`, 
        // 컨테이너 너비를 계산된 값으로 설정
        width: `${calculatedWidth}px`, 
        
        minHeight: '400px', 
        backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
        backgroundSize: `${GRID_CELL_SIZE}px ${GRID_CELL_SIZE}px`,
        border: '1px solid #dee2e6',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: '#fff'
    };

    return (
        <>
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">{layoutData.barnName} 배치도 (모니터링)</h3>
            
            <div className="overflow-x-auto">
                <div 
                    style={gridStyle as React.CSSProperties}
                    className="shadow-md"
                >
                    {layoutData.layouts.map((pen) => {
                        const count = layoutData.livestockCounts[pen.penId] || 0;
                        const occupancy = pen.capacity > 0 ? count / pen.capacity : 0;
                        
                        let bgColor = 'bg-green-100 border-green-400';
                        let statusText = '양호';

                        if (occupancy >= 1) { 
                            bgColor = 'bg-red-200 border-red-500'; 
                            statusText = '⚠️ 과밀';
                        } else if (occupancy >= 0.7) { 
                            bgColor = 'bg-yellow-100 border-yellow-500'; 
                            statusText = '혼잡';
                        }

                        const itemStyle = {
                            gridRow: `${pen.gridRow} / span ${pen.rowSpan}`,
                            gridColumn: `${pen.gridCol} / span ${pen.colSpan}`,
                            position: 'relative' as 'relative', 
                            top: '-12px', 
                            left: '-12px', 
                        };

                        return (
                            <div 
                                key={pen.penId}
                                style={itemStyle as React.CSSProperties}
                                className={`p-2 rounded-md shadow-sm 
                                            flex flex-col justify-center items-center text-center 
                                            ${bgColor} border-2 text-gray-800 transition cursor-pointer hover:shadow-lg`} 
                                onClick={() => handlePenClick(pen.penId, pen.penName)} 
                                title={`수용량: ${pen.capacity}두`}
                            >
                                <div className="font-semibold text-lg">{pen.penName}</div>
                                <div className="text-sm mt-1">
                                    {count}두 / {pen.capacity}두
                                </div>
                                <span className={`text-xs font-bold mt-1 ${occupancy >= 1 ? 'text-red-700' : 'text-green-700'}`}>
                                    {statusText}
                                </span>
                            </div>
                        );
                    })}
                </div>         
            </div>
        </div>
        {/* 🚨 가축 리스트 모달 렌더링 */}
        {clickedPen && (
            <LivestockListModal
                penId={clickedPen.id}
                penName={clickedPen.name}
                onClose={() => setClickedPen(null)}
                onRefresh={() => {}} 
            />
        )}
        </>
    );
};

export default BarnMapView;