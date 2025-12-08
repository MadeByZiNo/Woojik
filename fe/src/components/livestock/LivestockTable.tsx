import { Edit, MapPin, Calendar } from 'lucide-react'; // Edit 아이콘 추가
import type { LivestockResponse } from '../../types/livestock';
import StatusBadge from './StatusBadge';

interface Props {
    data: LivestockResponse[];
    loading: boolean;
    onRowClick: (id: number) => void;      // 💡 행 클릭 (상세 조회)
    onEditClick: (id: number) => void;     // 💡 버튼 클릭 (수정 폼)
}

const LivestockTable = ({ data, loading, onRowClick, onEditClick }: Props) => {
    
    // ... (getGenderTextAndStyle 헬퍼 함수 유지) ...
    const getGenderTextAndStyle = (gender: string) => {
        const value = gender.toUpperCase();
        let text = value;
        let style = "bg-gray-100 text-gray-600";

        if (value === 'FEMALE' || value === '암') {
            text = '암컷';
            style = 'bg-red-50 text-red-600';
        } else if (value === 'MALE' || value === '수') {
            text = '수컷';
            style = 'bg-blue-50 text-blue-600';
        } else if (value === 'CASTRATED' || value === '거세') {
            text = '거세';
            style = 'bg-purple-50 text-purple-600';
        }
        return { text, style };
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                        {/* ... (테이블 헤더 유지) ... */}
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            /* ... (로딩 UI 유지) ... */
                            [...Array(5)].map((_, i) => (<tr key={i} className="animate-pulse">
                                <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-12"></div></td>
                                <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                                <td className="px-6 py-4"><div className="h-6 bg-gray-100 rounded w-16"></div></td>
                                <td className="px-6 py-4"></td>
                            </tr>))
                        ) : data.length > 0 ? (
                            // 데이터 렌더링
                            data.map((cow) => {
                                const { text: genderText, style: genderStyle } = getGenderTextAndStyle(cow.gender);
                                
                                return (
                                    <tr 
                                        key={cow.id} 
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => onRowClick(cow.id)} // 💡 행 클릭 (Detail)
                                    >
                                        {/* ... (나머지 <td> 유지) ... */}
                                        <td className="px-6 py-4">
                                            {/* ... 귀표번호 ... */}
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900 text-lg">{cow.earTag}</span>
                                                {cow.name && <span className="text-sm text-gray-400">{cow.name}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded text-xs font-bold ${genderStyle}`}>
                                                {genderText}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <span className="text-sm">{cow.birthDate}</span>
                                                <span className="text-sm font-bold text-gray-900">({cow.months}개월)</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-gray-600">{cow.location}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={cow.status} />
                                        </td>
                                        {/* 관리 (수정 버튼) */}
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation(); // 💡 행 클릭 이벤트 중단!
                                                    onEditClick(cow.id); // 💡 수정 폼 열기 호출
                                                }}
                                                className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition"
                                                title="정보 수정"
                                            >
                                                <Edit size={18} /> {/* 💡 Edit 아이콘 사용 */}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            /* ... (데이터 없음 UI 유지) ... */
                            <tr>
                                <td colSpan={6} className="py-20 text-center text-gray-400">
                                    <p>검색 결과가 없습니다.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LivestockTable;