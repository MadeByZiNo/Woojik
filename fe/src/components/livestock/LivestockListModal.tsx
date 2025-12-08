// src/components/maps/LivestockListModal.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { livestockApi } from '../../services/livestockApi';
import { X, AlertCircle, List, PawPrint, Search } from 'lucide-react';
import LivestockDetailModal from '../livestock/LivestockDetailModal'; // 상세 모달 임포트
import type { LivestockResponse } from '../../types/livestock'; // 가축 리스트 타입 가정

// --- DTO 및 Props ---

// NOTE: LivestockResponse 타입은 외부 types/livestock.ts 파일에서 정의된 것으로 가정합니다.
interface FilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    filterStatus: string;
    onFilterChange: (status: string) => void;
}

interface Props {
    penId: number;
    penName: string;
    onClose: () => void;
    onRefresh: () => void;
}


// --- 헬퍼 함수 ---

// 💡 상태 ENUM 값을 사용자 친화적인 문자열로 변환하는 헬퍼 함수
const getStatusDisplayName = (status: string) => {
    switch (status) {
        case 'FATTENING': return '비육';
        case 'PREGNANT': return '임신';
        case 'SICK': return '치료';
        case 'CALF': return '송아지';
        default: return status;
    }
};


// --- 기본 Modal Wrapper (재사용) ---
const ModalWrapper = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"> 
            {children}
        </div>
    </div>
);

// --- 필터 컴포넌트 (LivestockFilterComponent) 정의 ---
const LivestockFilterComponent = ({ searchTerm, onSearchChange, filterStatus, onFilterChange }: FilterProps) => {
    // 🚨 사용자 요청에 따른 상태값 정의
    const statusOptions = [
        { value: 'ALL', label: '전체' },
        { value: 'FATTENING', label: '비육' },
        { value: 'PREGNANT', label: '임신' },
        { value: 'SICK', label: '치료' },
        { value: 'CALF', label: '송아지' },
    ];

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center shrink-0">
            {/* 검색창 */}
            <div className="relative w-full md:w-auto flex-1">
                <input 
                    type="text" 
                    placeholder="귀표번호(4자리) 또는 별명 검색" 
                    className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
            </div>

            {/* 상태 필터 탭 */}
            <div className="flex p-1 bg-gray-100 rounded-lg w-full md:w-auto overflow-x-auto">
                {statusOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onFilterChange(option.value)}
                        className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
                            filterStatus === option.value 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};


// --- 메인 컴포넌트: LivestockListModal ---

const LivestockListModal = ({ penId, penName, onClose, onRefresh }: Props) => {
    const [livestockList, setLivestockList] = useState<LivestockResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedLivestockId, setSelectedLivestockId] = useState<number | null>(null);

    // 필터 상태
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    const fetchLivestockList = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const list = await livestockApi.getListByPen(penId); 
            setLivestockList(list);
        } catch (err: any) {
            setError(err.message || "가축 목록을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, [penId]);

    useEffect(() => {
        fetchLivestockList();
    }, [fetchLivestockList]);
    
    // 상세 모달에서 작업 성공 시 리스트/부모 새로고침
    const handleActionSuccess = () => {
        fetchLivestockList();
        onRefresh(); 
    };

    // 🚨 필터링 로직 (useMemo로 최적화)
    const filteredList = useMemo(() => {
        return livestockList.filter(livestock => {
            
            // 1. 상태 필터링 (FATTENING, SICK, CALF 등 상태 문자열 비교)
            if (filterStatus !== 'ALL' && livestock.status !== filterStatus) {
                return false;
            }
            
            // 2. 검색어 필터링 (귀표번호 또는 별칭)
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const matchesEarTag = livestock.earTag.toLowerCase().includes(searchLower);
                const matchesName = livestock.name && livestock.name.toLowerCase().includes(searchLower);

                if (!(matchesEarTag || matchesName)) {
                    return false;
                }
            }
            
            return true;
        });
    }, [livestockList, filterStatus, searchTerm]);


    // 상세 모달 렌더링
    if (selectedLivestockId !== null) {
        return (
            <LivestockDetailModal
                livestockId={selectedLivestockId}
                onClose={() => setSelectedLivestockId(null)} 
                onActionSuccess={handleActionSuccess}
            />
        );
    }
    
    // 메인 리스트 렌더링
    return (
        <ModalWrapper onClose={onClose}>
            <div className="p-6 border-b flex flex-col justify-start gap-4 shrink-0">
                <div className='flex justify-between items-center'>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <List size={20} /> '{penName}' 방 가축 목록 ({filteredList.length}두)
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"><X size={24} /></button>
                </div>
                
                {/* 🚨 필터 컴포넌트 렌더링 */}
                <LivestockFilterComponent 
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filterStatus={filterStatus}
                    onFilterChange={setFilterStatus}
                />
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {loading && <div className="text-center py-5 text-gray-500">로딩 중...</div>}
                {error && <div className="text-red-500 font-bold p-3 bg-red-50 rounded"><AlertCircle size={16} className="inline mr-1" />{error}</div>}
                
                {!loading && filteredList.length === 0 && (
                    <div className="text-center py-10 text-gray-400 border border-dashed rounded-lg">
                        {livestockList.length === 0 ? "현재 이 방에 가축이 없습니다." : "필터링된 결과가 없습니다."}
                    </div>
                )}
                
                {filteredList.map((livestock) => (
                    <div 
                        key={livestock.id} 
                        className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition flex justify-between items-center"
                        onClick={() => setSelectedLivestockId(livestock.id)}
                    >
                        <div>
                            <p className="text-lg font-bold text-gray-800 tracking-tight">{livestock.earTag}</p>
                            {/* 🚨 상태 변환 함수 적용 */}
                            <p className="text-sm text-gray-500">{livestock.name || '별칭 없음'} / {getStatusDisplayName(livestock.status)}</p> 
                        </div>
                    </div>
                ))}
            </div>
        </ModalWrapper>
    );
};

export default LivestockListModal;