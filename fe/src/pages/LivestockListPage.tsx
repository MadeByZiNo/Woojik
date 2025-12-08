import { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react'; 
import type { LivestockResponse } from '../types/livestock'; 
import LivestockFilter from '../components/livestock/LivestockFilter';
import LivestockTable from '../components/livestock/LivestockTable';
import LivestockDetailModal from '../components/livestock/LivestockDetailModal';
import LivestockForm from '../components/livestock/LivestockForm';
import { livestockApi } from '../services/livestockApi';

const LivestockListPage = () => {
    // 1. 상태 정의
    const [allLivestock, setAllLivestock] = useState<LivestockResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [error, setError] = useState<string | null>(null);
    
    const [selectedCowId, setSelectedCowId] = useState<number | null>(null); 
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); 
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); 

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await livestockApi.getManageableLivestock();
            setAllLivestock(data);
        } catch (err: any) {
            console.error('개체 목록 로딩 실패:', err);
            setError(err.message || "데이터를 불러오는데 실패했습니다. 네트워크 상태를 확인하세요.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    const filteredList = useMemo(() => {
        return allLivestock.filter(cow => {
            const matchesSearch = cow.earTag.includes(searchTerm) || (cow.name && cow.name.includes(searchTerm));
            const matchesFilter = filterStatus === 'ALL' || cow.status === filterStatus;
            return matchesSearch && matchesFilter;
        });
    }, [allLivestock, searchTerm, filterStatus]);


    const handleFormSave = () => {
        fetchData(); 
        setIsRegisterModalOpen(false); 
        setIsUpdateModalOpen(false); 
        setSelectedCowId(null); 
    };

    // 6. 이벤트 핸들러
    const handleRowClick = (id: number) => {
        setSelectedCowId(id); // 상세 모달 열기
    };

    const handleEditClick = (id: number) => {
        setSelectedCowId(id);      
        setIsUpdateModalOpen(true); // 수정 폼 띄우기
    };

    const handleCloseDetailModal = () => {
        setSelectedCowId(null);
    };

    const handleCloseUpdateForm = () => {
        setIsUpdateModalOpen(false);
        setSelectedCowId(null);
    };

    return (
        <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                 <div>
                    <h2 className="text-2xl font-bold text-gray-900">개체 관리</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        전체 <span className="font-bold text-blue-600">{allLivestock.length}</span>두 중 
                        <span className="font-bold text-gray-800"> {filteredList.length}</span>두 표시됨
                    </p>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={() => setIsRegisterModalOpen(true)}      
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-md">
                        <Plus size={16} />
                        신규 입식
                    </button>
                    <button onClick={fetchData} className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition" title="새로고침">
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* 2. 필터 컴포넌트 (생략) */}
            <LivestockFilter 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filterStatus={filterStatus}
                onFilterChange={setFilterStatus}
            />

            {error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                    <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                       <AlertCircle className="text-red-500" size={48} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">데이터를 불러오지 못했습니다</h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                        {error} <br/>
                        <span className="text-sm text-gray-400">네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.</span>
                    </p>
                    <button onClick={fetchData} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-sm flex items-center gap-2">
                        <RefreshCw size={16} /> 다시 시도
                    </button>
                </div>
            ) : (
                <LivestockTable 
                    data={filteredList} 
                    loading={loading} 
                    onRowClick={handleRowClick}      
                    onEditClick={handleEditClick}    
                />
            )}
            
            {/* 4. 상세 모달 (View 전용) */}
            {selectedCowId !== null && !isUpdateModalOpen && !isRegisterModalOpen && (
                <LivestockDetailModal 
                    livestockId={selectedCowId} 
                    onClose={handleCloseDetailModal} 
                />
            )}

            {isRegisterModalOpen && (
                 <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <LivestockForm 
                            mode="create" 
                            onCancel={() => setIsRegisterModalOpen(false)}
                            onSave={handleFormSave} 
                        />
                    </div>
                </div>
            )}
            
            {isUpdateModalOpen && selectedCowId !== null && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <LivestockForm 
                            mode="update" 
                            livestockId={selectedCowId} // 수정할 ID 전달
                            onCancel={handleCloseUpdateForm} // 🟢 수정: 취소 시 ID도 클리어
                            onSave={handleFormSave} // 🟢 수정: 저장 시 ID도 클리어
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default LivestockListPage;