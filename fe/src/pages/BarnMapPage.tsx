import { useState, useEffect } from 'react';
import { RefreshCw, Map, Settings } from 'lucide-react';
import { barnApi } from '../services/barnApi';
import BarnMapView from '../components/maps/BarnMapView'; 
import BarnLayoutEditor from '../components/maps/BarnLayoutEditor'; 

interface BarnOption {
    id: number;
    name: string;
}

const BarnMapPage = () => {
    const [barnOptions, setBarnOptions] = useState<BarnOption[]>([]);
    const [selectedBarnId, setSelectedBarnId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // 💡 배치 편집기 상태 추가
    const [isEditorOpen, setIsEditorOpen] = useState(false); 

    // 1. 축사 목록 로드 함수
    const fetchBarns = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await barnApi.getAllBarns();
            setBarnOptions(data);
            
            // 데이터 로드 후 선택 상태 처리
            if (data.length > 0) {
                const isCurrentIdValid = selectedBarnId !== null && data.some(b => b.id === selectedBarnId);
                
                if (!isCurrentIdValid) {
                    setSelectedBarnId(data[0].id);
                }
            } else {
                setSelectedBarnId(null);
            }
        } catch (err: any) {
            console.error("축사 목록 로드 실패:", err);
            setError("축사 목록을 불러올 수 없습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 💡 배치 편집 후 맵을 새로고침하는 핸들러
    const handleLayoutSaved = () => {
        setIsEditorOpen(false);
        window.location.reload();
    };

    // 초기 데이터 로드
    useEffect(() => {
        fetchBarns();
    }, []);

    // 드롭다운 변경 핸들러
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBarnId(Number(e.target.value));
    };

    return (
        <>
        <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    축사 배치 지도
                </h2>
                <div className="flex items-center gap-2">
                    {/* 💡 배치 수정 버튼 */}
                    {selectedBarnId !== null && (
                         <button 
                             onClick={() => setIsEditorOpen(true)}
                             className="flex items-center gap-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-md"
                             title="선택된 축사의 배치 편집"
                         >
                             <Settings size={16} /> 배치 수정
                         </button>
                    )}
                    {/* 새로고침 버튼 */}
                    <button 
                        onClick={fetchBarns}
                        className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 transition"
                        title="새로고침"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>
            
            {/* 축사 선택 드롭다운 */}
            <div className="flex items-center gap-3">
                <label htmlFor="barn-select" className="text-lg font-medium text-gray-700">축사 선택:</label>
                {loading ? (
                    <div className="text-gray-500">로딩 중...</div>
                ) : error ? (
                    <div className="text-red-500 font-medium">{error}</div>
                ) : (
                    <select 
                        id="barn-select"
                        onChange={handleSelectChange}
                        value={selectedBarnId || ''}
                        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition"
                        disabled={barnOptions.length === 0}
                    >
                        {barnOptions.map(barn => (
                            <option key={barn.id} value={barn.id}>
                                {barn.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {/* 지도 컴포넌트 렌더링 */}
            {selectedBarnId !== null && barnOptions.length > 0 && (
                <BarnMapView barnId={selectedBarnId} />
            )}
            
            {barnOptions.length === 0 && !loading && !error && (
                <div className="p-10 text-center text-gray-500 border border-dashed rounded-lg">
                    등록된 축사 정보가 없습니다.
                </div>
            )}
        </div>
        
        {/* 💡 배치 편집기 모달 렌더링 */}
        {isEditorOpen && selectedBarnId !== null && (
            <BarnLayoutEditor 
                barnId={selectedBarnId}
                onClose={() => setIsEditorOpen(false)}
                onLayoutSaved={handleLayoutSaved}
            />
        )}
        </>
    );
};

export default BarnMapPage;