import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { livestockApi } from '../../services/livestockApi';
import { type LivestockDetailResponse } from '../../types/livestock';
import { X, Calendar, MapPin, Stethoscope, Heart, Baby, Venus, Mars, Syringe, Plus, DollarSign } from 'lucide-react';
import StatusBadge from './StatusBadge';
import dayjs from 'dayjs';
import BreedingActionModal from './BreedingActionModal'; 
import HealthActionModal from './HealthActionModal'; 
import MoveLivestockModal from './MoveLivestockModal';
import SaleRegistrationModal from './SaleRegistrationModal';

interface Props {
    livestockId: number;
    onClose: () => void;
    onActionSuccess: () => void; 
}

const getGenderInfo = (gender: string) => {
    const value = gender.toUpperCase();
    let text = value;
    let icon: ReactNode | null = null;
    let color = 'text-purple-600';

    if (value === 'FEMALE' || value === '암') {
        text = '암컷 (FEMALE)';
        icon = <Venus size={18} />;
        color = 'text-red-500';
    } else if (value === 'MALE' || value === '수') {
        text = '수컷 (MALE)';
        icon = <Mars size={18} />;
        color = 'text-blue-500';
    } else if (value === 'CASTRATED' || value === '거세') {
        text = '거세 (CASTRATED)';
        icon = <Mars size={18} />;
        color = 'text-purple-600';
    }
    return { text, icon, color };
};

const getHistoryTypeDisplayName = (type: string) => {
    switch (type) {
        case 'VACCINE': return ' 백신 접종';
        case 'TREAT': return ' 치료 처치';
        case 'ESTRUS': return ' 발정 기록';
        case 'AI': return ' 인공 수정';
        case 'PREG_CHECK': return ' 임신 감정';
        case 'CALVING': return ' 분만';
        default: return type;
    }
};


const LivestockDetailModal = ({ livestockId, onClose, onActionSuccess }: Props) => {
    const [data, setData] = useState<LivestockDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'info' | 'health' | 'breeding'>('info');

    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false); 
    const [isBreedingModalOpen, setIsBreedingModalOpen] = useState(false);
    const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false); 

    const fetchDetail = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const detail = await livestockApi.getDetail(livestockId);
            setData(detail);
        } catch (err: any) {
             setError(err.message || "상세 정보를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, [livestockId]);
    
    const handleActionSuccess = () => {
        onClose();
        window.location.reload();
    };

    useEffect(() => {
        if (livestockId) fetchDetail();
    }, [livestockId, fetchDetail]);

    if (loading) return <ModalWrapper onClose={onClose}><div className="p-8 text-center">상세 정보 로딩 중...</div></ModalWrapper>;
    if (error) return <ModalWrapper onClose={onClose}><div className="p-8 text-center text-red-600 font-bold">{error}</div></ModalWrapper>;
    if (!data) return <ModalWrapper onClose={onClose}><div className="p-8 text-center">정보를 찾을 수 없습니다.</div></ModalWrapper>;

    const genderInfo = getGenderInfo(data.gender);
    const formatDate = (dateString: string | null) => (dateString ? dayjs(dateString).format('YYYY.MM.DD') : '-');
    const isSold = data.status === 'SOLD'; 

    return (
        <>
        <ModalWrapper onClose={onClose}>
            {/* 모달 헤더 */}
            <div className="p-6 border-b flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                        {data.earTag}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-gray-500">{data.name || '별칭 없음'}</span>
                        <StatusBadge status={data.status} />
                    </div>
                </div>
                <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"><X size={24} /></button>
            </div>

            <div className="p-4 bg-white border-b flex justify-start gap-3 shrink-0">
                <button 
                    onClick={() => setIsHealthModalOpen(true)}
                    className="flex items-center gap-2 border border-green-600 text-green-600 
                                    px-4 py-2 rounded-lg text-sm font-bold transition hover:bg-green-50"
                    title="건강 조치 등록 폼 열기"
                >
                    <Plus size={16} /> 건강 조치 등록
                </button>
                <button 
                    onClick={() => setIsBreedingModalOpen(true)}
                    className="flex items-center gap-2 border border-pink-600 text-pink-600 
                                    px-4 py-2 rounded-lg text-sm font-bold transition hover:bg-pink-50"
                    title="번식 기록 등록 폼 열기"
                >
                    <Plus size={16} /> 번식 기록 등록
                </button>
                <button 
                    onClick={() => setIsMoveModalOpen(true)}
                    className="flex items-center gap-2 border border-blue-600 text-blue-600 
                               px-4 py-2 rounded-lg text-sm font-bold transition hover:bg-blue-50"
                    title="가축 이동 모달 열기"
                >
                    <MapPin size={16} /> 가축 이동
                </button>
                {!isSold && (
                    <button 
                        onClick={() => setIsSaleModalOpen(true)}
                        className="flex items-center gap-2 bg-green-600 text-white 
                                   px-4 py-2 rounded-lg text-sm font-bold transition hover:bg-green-700"
                        title="판매 등록 폼 열기"
                    >
                        <DollarSign size={16} /> 판매 등록
                    </button>
                )}
                {isSold && (
                    <span className="text-sm font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-lg flex items-center gap-2">
                        <DollarSign size={16} /> 판매 완료됨
                    </span>
                )}
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex border-b text-sm font-medium shrink-0">
                <TabButton name="info" label="기본 정보" active={activeTab} setActive={setActiveTab} icon={<Heart size={16}/>} />
                <TabButton name="health" label={`건강 이력 (${data.healthHistory.length})`} active={activeTab} setActive={setActiveTab} icon={<Stethoscope size={16}/>} />
                <TabButton name="breeding" label={`번식 이력 (${data.breedingHistory.length})`} active={activeTab} setActive={setActiveTab} icon={<Baby size={16}/>} />
            </div>

            {/* 탭 콘텐츠 */}
            <div className="p-6 flex-1 overflow-y-auto">
                {activeTab === 'info' && <InfoTab data={data} genderInfo={genderInfo} formatDate={formatDate} />}
                {activeTab === 'health' && <HistoryTab type="건강" history={data.healthHistory} formatDate={formatDate} />}
                {activeTab === 'breeding' && <HistoryTab type="번식" history={data.breedingHistory} formatDate={formatDate} />}
            </div>
        </ModalWrapper>
        
        {/* 💡 액션 모달 렌더링 */}
        {isBreedingModalOpen && (
            <BreedingActionModal 
                livestockId={livestockId}
                onClose={() => setIsBreedingModalOpen(false)}
                onSuccess={handleActionSuccess}
            />
        )}
        {isHealthModalOpen && (
            <HealthActionModal
                livestockId={livestockId}
                // HealthActionModal에서 현재 SICK 상태인지 확인 가능하도록 데이터 전달
                initialStatus={data?.status || 'FATTENING'} 
                onClose={() => setIsHealthModalOpen(false)}
                onSuccess={handleActionSuccess}
            />
        )}
        {isMoveModalOpen && data && (
            <MoveLivestockModal 
                livestockId={livestockId}
                // 🚨 현재 펜 ID와 현재 축사 ID 전달
                currentPenId={data.penId} 
                currentBarnId={data.barnId} 
                onClose={() => setIsMoveModalOpen(false)}
                onSuccess={handleActionSuccess}
            />
        )}
        {isSaleModalOpen && (
            <SaleRegistrationModal 
                livestockId={livestockId}
                onClose={() => setIsSaleModalOpen(false)}
                onSuccess={handleActionSuccess}
            />
        )}
        </>
    );
};



const ModalWrapper = ({ children, onClose }: { children: ReactNode, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {children}
        </div>
    </div>
);

// 기본 정보 탭 (InfoTab)
const InfoTab = ({ data, genderInfo, formatDate }: any) => (
    <div className="space-y-8">
        
        {/* 1. 기본 정보 & 상태 */}
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">기본 정보</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
            <InfoRow icon={<MapPin size={18}/>} label="현재 위치" value={data.location} />
            <InfoRow icon={<Calendar size={18}/>} label="생년월일 / 월령" value={`${formatDate(data.birthDate)} (${data.months}개월)`} />
            <InfoRow icon={<span className="font-bold">B</span>} label="품종" value={data.breed || '한우'} />
            <InfoRow icon={genderInfo.icon} label="성별" value={genderInfo.text} color={genderInfo.color} />
        </div>

        {/* 2. 건강 및 안전 요약 */}
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mt-6">건강 및 안전 요약</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
            <InfoRow 
                icon={<Syringe size={18}/>} 
                label="휴약 만료일" 
                value={data.withdrawalDate ? formatDate(data.withdrawalDate) : '해당 없음'} 
                color={data.withdrawalDate && dayjs(data.withdrawalDate).isAfter(dayjs()) ? 'text-red-500' : 'text-green-500'} 
            />
            <InfoRow 
                icon={<Stethoscope size={18}/>} 
                label="최근 치료/백신" 
                value={data.lastTreatment || '-'} 
                desc={data.lastTreatmentDate ? `${formatDate(data.lastTreatmentDate)}` : ''} 
            />
             <InfoRow 
                icon={<Heart size={18}/>} 
                label="최근 상태" 
                value={data.status === 'SICK' ? '치료 필요' : '양호'} 
                color={data.status === 'SICK' ? 'text-red-500' : 'text-green-500'} 
            />
        </div>

        {/* 3. 번식 상태 요약 (암소/거세만 중요) */}
        {(data.gender.toUpperCase() === 'FEMALE' || data.gender.toUpperCase() === 'CASTRATED') && (
            <>
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mt-6">번식 및 산차 정보</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                    <InfoRow label="현재 산차" value={`${data.breedingCount || 0}차`} icon={<Baby size={18}/>} />
                    <InfoRow label="마지막 수정일" value={formatDate(data.lastAiDate)} icon={<Stethoscope size={18}/>} />
                    <InfoRow label="분만 예정일" value={formatDate(data.expectedDate)} icon={<Calendar size={18}/>} />
                    <InfoRow label="마지막 발정일" value={formatDate(data.lastEstrusDate)} icon={<Heart size={18}/>} />
                </div>
            </>
        )}

        {/* 4. 족보 및 특이사항 */}
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mt-6">족보 및 특이사항</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
            <InfoRow label="모 (MOTHER)" value={data.motherEarTag || '알 수 없음'} icon={<span className="font-bold text-red-500">M</span>} />
            <InfoRow label="부 (FATHER)" value={data.fatherEarTag || '알 수 없음'} icon={<span className="font-bold text-blue-500">F</span>} />
        </div>
        
        <p className="mt-4 bg-gray-50 p-4 rounded-lg text-gray-600 whitespace-pre-wrap">
            <span className="font-bold text-gray-800 block mb-1">상세 비고:</span>
            {data.notes || '특이사항 없음'}
        </p>

    </div>
);

// 이력 리스트 탭 (HistoryTab)
const HistoryTab = ({ type, history, formatDate }: any) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">{type} 기록</h3>
        {history.length === 0 ? (
            <div className="text-center py-10 text-gray-400">등록된 {type} 이력이 없습니다.</div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {history.map((item: any) => (
                    <div key={item.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-xs font-medium text-gray-500">{formatDate(item.eventDate)}</p>
                        <h4 className="text-lg font-bold text-gray-800 mt-1">
                            {/* ENUM 치환 적용 */}
                            {getHistoryTypeDisplayName(item.diseaseName ? 'TREAT' : item.type)}
                        </h4>
                        {item.diseaseName && <p className="text-sm text-gray-600">병명: {item.diseaseName}</p>}
                        {item.sireCode && <p className="text-sm text-gray-600">종모우: {item.sireCode}</p>}
                        {item.medicine && <p className="text-sm text-red-500">약품: {item.medicine} ({item.withdrawalPeriod}일 휴약)</p>}
                        {item.expectedDate && <p className="text-sm text-pink-600">분만예정일: {formatDate(item.expectedDate)}</p>}
                        {item.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">비고: {item.description}</p>}
                    </div>
                ))}
            </div>
        )}
    </div>
);

// 탭 버튼 컴포넌트
const TabButton = ({ name, label, active, setActive, icon, disabled = false }: any) => (
    <button 
        onClick={() => setActive(name)}
        disabled={disabled}
        className={`px-6 py-3 flex items-center gap-2 transition-colors ${
            active === name 
                ? 'border-b-2 border-blue-600 text-blue-600' 
                : disabled 
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-500 hover:text-gray-700'
        }`}
    >
        {icon}
        {label}
    </button>
);

const InfoRow = ({ icon, label, value, desc, color = 'text-gray-700' }: any) => (
    <div className="flex items-start gap-4">
        <div className={`mt-1 shrink-0 ${color}`}>{icon}</div>
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
            <p className={`text-xl font-bold ${color} tracking-tight`}>
                {value}
                {desc && <span className="text-sm font-normal text-gray-500 ml-2">{desc}</span>}
            </p>
        </div>
    </div>
);


export default LivestockDetailModal;