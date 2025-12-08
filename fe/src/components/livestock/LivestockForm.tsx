import { useState, useEffect, useCallback } from 'react';
import { Save, XCircle, AlertCircle } from 'lucide-react';
import { 
    type LivestockRequest, 
    type LivestockUpdateRequest, 
    type LivestockDetailResponse 
} from '../../types/livestock'; 
import { livestockApi } from '../../services/livestockApi';
import { barnApi } from '../../services/barnApi';
import dayjs from 'dayjs';


interface Props {
    mode: 'create' | 'update';
    livestockId?: number; // 수정 모드 시 대상 ID
    onSave: (id?: number) => void; 
    onCancel: () => void;
}

const LivestockForm = ({ mode, livestockId, onSave, onCancel }: Props) => {
    
    const isUpdate = mode === 'update';
    const isCreate = mode === 'create';

    // 💡 축사/방 상태 (API 연동)
    const [barnOptions, setBarnOptions] = useState<any[]>([]);
    const [penOptions, setPenOptions] = useState<any[]>([]);
    const [selectedBarnId, setSelectedBarnId] = useState<number | null>(null);

    // 폼 상태
    const [formData, setFormData] = useState<LivestockRequest | LivestockUpdateRequest | any>({
        // 초기값은 useEffect에서 채워지며, 등록 시 필요한 기본값만 세팅
        gender: 'MALE', breed: '한우', 
        penId: null, earTag: '', name: '', birthDate: '', notes: ''
    });

    const [loading, setLoading] = useState(isUpdate);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialDetail, setInitialDetail] = useState<LivestockDetailResponse | null>(null);


    // --- 1. 축사 목록 로드 ---
    useEffect(() => {
        const loadBarns = async () => {
            try {
                const barns = await barnApi.getAllBarns();
                setBarnOptions(barns);
                // 등록 모드 시 첫 번째 축사를 기본값으로 설정
                if (isCreate && barns.length > 0) {
                    setSelectedBarnId(barns[0].id);
                }
            } catch (err: any) {
                setError("축사 목록 로드 실패: " + err.message);
            }
        };
        loadBarns();
    }, [isCreate]);


    // --- 2. 방 목록 로드 (선택된 축사에 종속) ---
    useEffect(() => {
        if (selectedBarnId === null) {
            setPenOptions([]);
            return;
        }
        const loadPens = async () => {
            try {
                const pens = await barnApi.getPensByBarn(selectedBarnId);
                setPenOptions(pens);
                
                // 등록 모드: 첫 번째 방을 penId 기본값으로 설정
                if (isCreate && pens.length > 0) {
                     setFormData((prev: any) => ({ ...prev, penId: pens[0].id }));
                } else if (isCreate && pens.length === 0) {
                     setFormData((prev: any) => ({ ...prev, penId: null }));
                }
            } catch (err: any) {
                setError("방 목록 로드 실패: " + err.message);
            }
        };
        loadPens();
    }, [selectedBarnId, isCreate]);


    // --- 3. 수정 모드 초기 데이터 로드 ---
    const fetchInitialData = useCallback(async () => {
        if (!livestockId || barnOptions.length === 0) return;
        try {
            setLoading(true);
            const detail = await livestockApi.getDetail(livestockId);
            setInitialDetail(detail);

            // 수정 폼 초기값 세팅
            setFormData({
                name: detail.name || '',
                gender: (detail.gender as 'MALE' | 'FEMALE' | 'CASTRATED'),
                birthDate: detail.birthDate || '', 
                breed: detail.breed || '',
                notes: detail.notes || '',
            });
            
            // 등록 모달과 달리 수정 모드는 위치 변경을 별도 API로 처리하므로 penId는 요청 DTO에 포함하지 않습니다.

        } catch (err: any) {
            setError("개체 정보를 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, [livestockId, barnOptions.length]);
    
    useEffect(() => {
        if (isUpdate && barnOptions.length > 0) {
             fetchInitialData();
        } else if (isCreate && barnOptions.length > 0) {
             setLoading(false);
        }
    }, [isUpdate, fetchInitialData, isCreate, barnOptions.length]);


    // --- 4. 핸들러 ---
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'selectedBarnId') {
            setSelectedBarnId(Number(value));
            setFormData((prev: any) => ({ ...prev, penId: null })); 
            return;
        }

        setFormData((prev: any) => ({ 
            ...prev, 
            [name]: (name === 'penId' && isCreate) ? Number(value) : value 
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        // 필수 필드 검증: 등록 시 귀표, 생일, 초기 위치(penId) 필수
        if (!formData.birthDate || (isCreate && !formData.earTag) || (isCreate && !formData.penId)) {
            setError(isCreate ? "귀표번호, 생년월일, 초기 위치는 필수입니다." : "생년월일은 필수입니다.");
            setIsSubmitting(false);
            return;
        }

        try {
            if (isCreate) {
                const newCowId = await livestockApi.register(formData as LivestockRequest);
                alert(`${formData.earTag} 개체 등록 완료.`);
                onSave(newCowId);
            } else {
                if (!livestockId) throw new Error("수정 대상 ID가 없습니다.");
                await livestockApi.update(livestockId, formData as LivestockUpdateRequest);
                alert(`${initialDetail?.earTag} 정보가 수정되었습니다.`);
                onSave(livestockId); 
            }
        } catch (err: any) {
            setError(err.message || (isCreate ? "등록 중 알 수 없는 오류" : "수정 중 알 수 없는 오류"));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center">정보 로딩 중...</div>;
    
    // --- 렌더링 ---
    return (
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5 h-full">
            
            <h3 className="text-2xl font-bold text-gray-800 border-b pb-3">
                {isCreate ? '신규 개체 등록' : `${initialDetail?.earTag} 정보 수정`}
            </h3>
            
            {error && <ErrorMessage message={error} />}
            
            {/* 1. 귀표번호, 이름, 품종 */}
            <InputField 
                label="귀표번호" name="earTag" 
                value={isUpdate ? initialDetail?.earTag : formData.earTag} 
                onChange={handleChange} readOnly={isUpdate} required={isCreate} placeholder="0023XXXX"
            />
            <div className="grid grid-cols-2 gap-4">
                <InputField label="별칭/이름" name="name" value={formData.name || ''} onChange={handleChange} placeholder="순둥이" />
                <InputField label="품종" name="breed" value={formData.breed || ''} onChange={handleChange} placeholder="한우" />
            </div>
            
            {/* 2. 생년월일, 성별 */}
            <div className="grid grid-cols-2 gap-4">
                <InputField label="생년월일" name="birthDate" value={formData.birthDate} onChange={handleChange} type="date" required />
                <SelectField label="성별" name="gender" value={formData.gender} onChange={handleChange} options={[
                    { value: 'MALE', label: '수컷 (MALE)' },
                    { value: 'FEMALE', label: '암컷 (FEMALE)' },
                    { value: 'CASTRATED', label: '거세 (CASTRATED)' },
                ]} />
            </div>
            
            {/* 3. 초기 위치 (등록 시에만 필요) - 동적 드롭다운 */}
            {isCreate && (
                <div className="grid grid-cols-2 gap-4">
                     <SelectField 
                        label="축사 선택" name="selectedBarnId" 
                        value={String(selectedBarnId || '')} onChange={handleChange} 
                        options={barnOptions.map(b => ({ value: String(b.id), label: b.name }))}
                        required
                    />
                    <SelectField 
                        label="방 선택" name="penId" 
                        value={String(formData.penId || '')} onChange={handleChange} 
                        options={penOptions.length > 0 ? penOptions.map(p => ({ value: String(p.id), label: p.name })) : [{ value: '', label: '선택된 축사에 방 없음' }]}
                        required
                        disabled={!selectedBarnId}
                    />
                </div>
            )}
            
            {/* 4. 특이사항 / 비고 (수정 시에만 필요) */}
            {isUpdate && (
                <TextAreaField label="특이사항 / 비고" name="notes" value={formData.notes || ''} onChange={handleChange} />
            )}

            {/* 푸터 버튼 */}
            <div className="pt-4 border-t mt-auto flex justify-end gap-3">
                 <button type="button" onClick={onCancel} className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition">
                    <XCircle size={20} /> 취소
                 </button>
                <button 
                    type="submit" 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md disabled:bg-gray-400"
                    disabled={isSubmitting}
                >
                    <Save size={20} />
                    {isSubmitting ? '저장 중...' : (isCreate ? '개체 등록 완료' : '정보 저장')}
                </button>
            </div>
        </form>
    );
};

export default LivestockForm;

// --- 폼 서브 컴포넌트 (재사용) ---

const InputField = ({ label, name, value, onChange, type = 'text', readOnly = false, required = false, placeholder }: any) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <input 
            type={type} 
            name={name} 
            value={value} 
            onChange={onChange}
            readOnly={readOnly}
            required={required}
            placeholder={placeholder}
            className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
        />
    </div>
);
const SelectField = ({ label, name, value, onChange, options, disabled = false, required = false }: any) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <select 
            name={name} 
            value={value} 
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`px-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${disabled ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
        >
            {options.length === 0 && <option value="">방이 없습니다.</option>}
            {options.map((opt: any) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);
const TextAreaField = ({ label, name, value, onChange, placeholder }: any) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <textarea 
            name={name} 
            value={value} 
            onChange={onChange}
            placeholder={placeholder}
            rows={4}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
        />
    </div>
);
const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg flex items-center gap-3">
        <AlertCircle size={20} />
        <span className="text-sm font-medium">{message}</span>
    </div>
);