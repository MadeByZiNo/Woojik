import { useState } from 'react';
import { X, Save, Heart, Baby, Stethoscope, AlertCircle, Plus, Calendar, CheckSquare } from 'lucide-react';
import { breedingApi } from '../../services/breedingApi';
import { type EstrusRequest, type BreedingAiRequest, type PregnancyCheckRequest, type CalvingRequest } from '../../types/healthBreeding';
import dayjs from 'dayjs';

// --- 폼 타입 및 Props ---

interface ActionProps {
    livestockId: number;
    onClose: () => void;
    onSuccess: () => void;
}

const BreedingActionModal = ({ livestockId, onClose, onSuccess }: ActionProps) => {
    const [activeTab, setActiveTab] = useState<'estrus' | 'ai' | 'preg_check' | 'calving'>('estrus');

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                
                {/* 헤더 */}
                <div className="p-5 border-b flex justify-between items-center shrink-0">
                    <h2 className="text-xl font-bold text-gray-900"> 번식 기록 등록</h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
                </div>

                {/* 탭 네비게이션 */}
                <div className="flex border-b text-sm font-medium shrink-0 bg-gray-50">
                    <ActionTab name="estrus" label="발정 등록" active={activeTab} setActive={setActiveTab} icon={<Heart size={16}/>} />
                    <ActionTab name="ai" label="수정 등록" active={activeTab} setActive={setActiveTab} icon={<Stethoscope size={16}/>} />
                    <ActionTab name="preg_check" label="임신 감정" active={activeTab} setActive={setActiveTab} icon={<CheckSquare size={16}/>} />
                    <ActionTab name="calving" label="분만 등록" active={activeTab} setActive={setActiveTab} icon={<Baby size={16}/>} />
                </div>
                
                {/* 폼 콘텐츠 */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {activeTab === 'estrus' && <EstrusForm livestockId={livestockId} onSuccess={onSuccess} onClose={onClose} />}
                    {activeTab === 'ai' && <AiForm livestockId={livestockId} onSuccess={onSuccess} onClose={onClose} />}
                    {activeTab === 'preg_check' && <PregnancyCheckForm livestockId={livestockId} onSuccess={onSuccess} onClose={onClose} />}
                    {activeTab === 'calving' && <CalvingForm livestockId={livestockId} onSuccess={onSuccess} onClose={onClose} />}
                </div>

            </div>
        </div>
    );
};

export default BreedingActionModal;

// --- 폼 서브 컴포넌트 (ActionForm) ---

// 1. 발정 등록 폼
const EstrusForm = ({ livestockId, onSuccess, onClose }: any) => {
    const [formData, setFormData] = useState<EstrusRequest>({ date: dayjs().format('YYYY-MM-DD'), notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await breedingApi.registerEstrus(livestockId, formData);
            alert(`발정 기록 등록 완료.`);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "발정 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-gray-800">발정 발생 기록</h4>
            {error && <ErrorMessage message={error} />}
            <InputField label="발정일" name="date" value={formData.date} onChange={(e: any) => setFormData(p => ({...p, date: e.target.value}))} type="date" required />
            <TextAreaField label="특이사항" name="notes" value={formData.notes || ''} onChange={(e: any) => setFormData(p => ({...p, notes: e.target.value}))} placeholder="강발정 여부 등"/>
            <SubmitButton isSubmitting={isSubmitting} label="발정 기록 저장" />
        </form>
    );
};

// 2. 인공수정 등록 폼
const AiForm = ({ livestockId, onSuccess, onClose }: any) => {
    const [formData, setFormData] = useState<BreedingAiRequest>({ date: dayjs().format('YYYY-MM-DD'), sireCode: '', notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await breedingApi.registerAi(livestockId, formData);
            alert(`인공수정 기록 등록 완료.`);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "인공수정 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-gray-800">인공수정 기록</h4>
            {error && <ErrorMessage message={error} />}
            <InputField label="수정일" name="date" value={formData.date} onChange={(e: any) => setFormData(p => ({...p, date: e.target.value}))} type="date" required />
            <InputField label="종모우 코드" name="sireCode" value={formData.sireCode} onChange={(e: any) => setFormData(p => ({...p, sireCode: e.target.value}))} placeholder="KPN-XXXX" required/>
            <TextAreaField label="특이사항" name="notes" value={formData.notes || ''} onChange={(e: any) => setFormData(p => ({...p, notes: e.target.value}))}/>
            <SubmitButton isSubmitting={isSubmitting} label="수정 기록 저장" />
        </form>
    );
};

// 3. 임신 감정 폼
const PregnancyCheckForm = ({ livestockId, onSuccess, onClose }: any) => {
    const [formData, setFormData] = useState<PregnancyCheckRequest>({ date: dayjs().format('YYYY-MM-DD'), isPregnant: true, notes: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await breedingApi.registerPregnancyCheck(livestockId, formData);
            alert(`임신 감정 기록 등록 완료.`);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "임신 감정 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-gray-800">임신 감정 기록</h4>
            {error && <ErrorMessage message={error} />}
            <InputField label="감정일" name="date" value={formData.date} onChange={(e: any) => setFormData(p => ({...p, date: e.target.value}))} type="date" required />
            <SelectField label="감정 결과" name="isPregnant" value={String(formData.isPregnant)} onChange={(e: any) => setFormData(p => ({...p, isPregnant: e.target.value === 'true'}))} options={[
                { value: 'true', label: '✅ 임신 확인' },
                { value: 'false', label: '❌ 비임신' },
            ]} required/>
            <TextAreaField label="수의사 소견" name="notes" value={formData.notes || ''} onChange={(e: any) => setFormData(p => ({...p, notes: e.target.value}))}/>
            <SubmitButton isSubmitting={isSubmitting} label="감정 기록 저장" />
        </form>
    );
};

// 4. 분만 등록 폼
const CalvingForm = ({ livestockId, onSuccess, onClose }: any) => {
    const [formData, setFormData] = useState<CalvingRequest>({ date: dayjs().format('YYYY-MM-DD'), calfEarTag: '', calfName: '', calfGender: 'FEMALE' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await breedingApi.registerCalving(livestockId, formData);
            alert(`분만 기록 및 송아지 입식 완료.`);
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "분만 등록 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h4 className="text-lg font-bold text-gray-800">분만 기록</h4>
            {error && <ErrorMessage message={error} />}
            <InputField label="분만일" name="date" value={formData.date} onChange={(e: any) => setFormData(p => ({...p, date: e.target.value}))} type="date" required />
            <h5 className="text-base font-semibold text-gray-700 border-t pt-2">송아지 정보 (자동 입식)</h5>
            <InputField label="송아지 귀표" name="calfEarTag" value={formData.calfEarTag} onChange={(e: any) => setFormData(p => ({...p, calfEarTag: e.target.value}))} required/>
            <div className="grid grid-cols-2 gap-4">
                <InputField label="송아지 이름" name="calfName" value={formData.calfName || ''} onChange={(e: any) => setFormData(p => ({...p, calfName: e.target.value}))}/>
                <SelectField label="송아지 성별" name="calfGender" value={formData.calfGender} onChange={(e: any) => setFormData(p => ({...p, calfGender: e.target.value}))} options={[
                    { value: 'FEMALE', label: '암컷' },
                    { value: 'MALE', label: '수컷' },
                ]} required/>
            </div>
            <SubmitButton isSubmitting={isSubmitting} label="분만 기록 저장" />
        </form>
    );
};

// --- 공통 서브 컴포넌트 ---
const InputField = ({ label, name, value, onChange, type = 'text', required = false, placeholder, min }: any) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} min={min}
            className={`px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
        />
    </div>
);
const SelectField = ({ label, name, value, onChange, options, required }: any) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
        <select name={name} value={value} onChange={onChange} required={required}
            className="px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
        >
             {options.map((opt: any) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
        </select>
    </div>
);
const TextAreaField = ({ label, name, value, onChange, placeholder }: any) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors resize-none"
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
                ? 'bg-white text-pink-600 border-b-2 border-pink-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
        }`}
    >
        {icon}
        {label}
    </button>
);
const SubmitButton = ({ isSubmitting, label }: { isSubmitting: boolean, label: string }) => (
    <div className="pt-4 border-t mt-auto flex justify-end">
        <button 
            type="submit" 
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md disabled:bg-gray-400"
            disabled={isSubmitting}
        >
            <Save size={20} />
            {isSubmitting ? '처리 중...' : label}
        </button>
    </div>
);