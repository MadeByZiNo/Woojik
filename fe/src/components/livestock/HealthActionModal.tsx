import { useState } from 'react';
import { X, Save, Stethoscope, Syringe, CheckCircle2, AlertCircle } from 'lucide-react';
import { healthApi } from '../../services/healthApi';
import { type HealthRequest, type HealthType } from '../../types/healthBreeding';
import dayjs from 'dayjs';

// --- 폼 타입 및 Props ---

interface ActionProps {
    livestockId: number;
    initialStatus: string; // 현재 상태 (회복 버튼 조건용)
    onClose: () => void;
    onSuccess: () => void; // 액션 성공 시 상세 모달 갱신 콜백
}

const HealthActionModal = ({ livestockId, initialStatus, onClose, onSuccess }: ActionProps) => {
    const isSick = initialStatus === 'SICK';
    const [activeTab, setActiveTab] = useState<'register' | 'recover'>('register'); // 등록 폼 vs 회복 처리
    
    // --- 폼 상태 ---
    const [formData, setFormData] = useState<HealthRequest>({
        type: 'TREAT', // 기본값: 치료
        date: dayjs().format('YYYY-MM-DD'),
        diseaseName: '',
        medicine: '',
        description: '',
        withdrawalPeriod: 0,
    });

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'withdrawalPeriod' ? Number(value) : value 
        }));
    };
    
    // 건강 등록 (치료/백신) 처리
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        if (!formData.date || (!formData.diseaseName && formData.type === 'TREAT')) {
             setError("접종일과 병명/목적은 필수입니다.");
             setIsSubmitting(false);
             return;
        }

        try {
            await healthApi.registerHealth(livestockId, formData);
            alert(`개체 ${livestockId}번에 ${formData.type === 'TREAT' ? '치료' : '백신'} 기록 등록 완료`);
            onSuccess();
        } catch (err: any) {
            setError(err.message || "건강 기록 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // 회복 처리 (PATCH)
    const handleRecover = async () => {
        if (!window.confirm("현재 개체의 상태를 '완치(SICK 해제)'로 변경하시겠습니까?")) return;
        setIsSubmitting(true);
        try {
            await healthApi.recover(livestockId);
            alert(`개체 ${livestockId}번 회복 처리 완료.`);
            onSuccess();
        } catch (err: any) {
            setError(err.message || "회복 처리 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                
                {/* 헤더 */}
                <div className="p-5 border-b flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">건강 조치 등록</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
                </div>

                {/* 탭 네비게이션 */}
                <div className="flex border-b text-sm font-medium shrink-0">
                    <ActionTab name="register" label="치료/백신 등록" active={activeTab} setActive={setActiveTab} icon={<Stethoscope size={16}/>} />
                    {isSick && (
                        <ActionTab name="recover" label="완치 처리" active={activeTab} setActive={setActiveTab} icon={<CheckCircle2 size={16}/>} />
                    )}
                </div>
                
                {/* 폼 콘텐츠 */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {error && <ErrorMessage message={error} />}

                    {/* 1. 등록 폼 */}
                    {activeTab === 'register' && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                             <div className="grid grid-cols-2 gap-4">
                                <SelectField label="구분" name="type" value={formData.type} onChange={handleChange} options={[
                                    { value: 'TREAT', label: '치료 (TREAT)' },
                                    { value: 'VACCINE', label: '백신 (VACCINE)' },
                                ]} required/>
                                <InputField label="접종/진료일" name="date" value={formData.date} onChange={handleChange} type="date" required />
                            </div>

                            <InputField label="병명/목적" name="diseaseName" value={formData.diseaseName} onChange={handleChange} required placeholder="구제역, 설사 등" />
                            <InputField label="약품명" name="medicine" value={formData.medicine} onChange={handleChange} placeholder="항생제 X-5, A형 백신" />

                            <div className="grid grid-cols-2 gap-4">
                                <InputField label="휴약 기간 (일)" name="withdrawalPeriod" value={formData.withdrawalPeriod} onChange={handleChange} type="number" min="0" required />
                                <div />
                            </div>

                            <TextAreaField label="증상 및 처치 내용" name="description" value={formData.description} onChange={handleChange} />
                            
                            <div className="pt-4 border-t mt-auto flex justify-end">
                                <button 
                                    type="submit" 
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md disabled:bg-gray-400"
                                    disabled={isSubmitting}
                                >
                                    <Save size={20} />
                                    {isSubmitting ? '처리 중...' : '기록 등록'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* 2. 회복 처리 */}
                    {activeTab === 'recover' && isSick && (
                        <div className="text-center py-10">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">✅ 완치 처리</h3>
                            <p className="text-gray-600 mb-6">
                                이 개체의 **SICK** 상태를 **완치(FATTENING)** 상태로 변경합니다.<br/>
                                휴약 기간이 남아있더라도 SICK 상태는 해제됩니다.
                            </p>
                            <button 
                                onClick={handleRecover}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 mx-auto rounded-xl font-bold transition shadow-md disabled:bg-gray-400"
                                disabled={isSubmitting}
                            >
                                <CheckCircle2 size={20} />
                                {isSubmitting ? '처리 중...' : '완치 처리 (상태 변경)'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HealthActionModal;

// --- 폼 서브 컴포넌트 재정의 (이전 응답에서 정의됨) ---
// (재사용을 위해 HealthActionModal에 포함)
const InputField = ({ label, name, value, onChange, type = 'text', readOnly = false, required = false, placeholder, min }: any) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <input type={type} name={name} value={value} onChange={onChange} readOnly={readOnly} required={required} placeholder={placeholder} min={min}
            className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${readOnly ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
        />
    </div>
);
const SelectField = ({ label, name, value, onChange, options, required }: any) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <select name={name} value={value} onChange={onChange} required={required}
            className="px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
             {options.map((opt: any) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
        </select>
    </div>
);
const TextAreaField = ({ label, name, value, onChange, placeholder }: any) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={4}
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
const ActionTab = ({ name, label, active, setActive, icon }: any) => (
    <button 
        onClick={() => setActive(name)}
        className={`px-4 py-2 flex items-center gap-2 transition-all ${
            active === name 
                ? 'bg-white text-green-600 border-b-2 border-green-600' 
                : 'text-gray-500 hover:text-gray-700'
        }`}
    >
        {icon}
        {label}
    </button>
);