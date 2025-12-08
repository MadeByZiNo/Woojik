import React, { useState } from 'react';
import { X, Save, DollarSign } from 'lucide-react';
import { saleApi } from '../../services/saleApi'; 
import type { SaleRequest } from '../../types/sale';
import dayjs from 'dayjs';

// --- 가정된 공통 컴포넌트 ---
const ModalWrapper = ({ children, onClose }: any) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl">
            {children}
        </div>
    </div>
);

// InputField 컴포넌트 (타입 명확화)
const InputField = ({ label, type, value, onChange, required = false, min = 0 }: any) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input 
            type={type} 
            value={value} 
            onChange={onChange}
            required={required}
            min={min}
            className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
    </div>
);


// --- 메인 컴포넌트 ---

interface Props {
    livestockId: number;
    onClose: () => void;
    onSuccess: () => void; // 🚨 handleSaleSuccess 대신 사용되는 콜백 함수
}

const SaleRegistrationModal = ({ livestockId, onClose, onSuccess }: Props) => {
    const [saleRequest, setSaleRequest] = useState<SaleRequest>({
        saleDate: dayjs().format('YYYY-MM-DD'),
        price: 0, 
        customerName: '', 
        weight: 0.0, 
        grade: '', 
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    type ChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

    const handleChange = (field: keyof SaleRequest, value: any) => {
        setSaleRequest(prev => ({ ...prev, [field]: value }));
    };

    const handleRegisterSale = async () => {
        if (saleRequest.price <= 0 || !saleRequest.customerName.trim() || !saleRequest.saleDate) {
            setError("판매 가격, 구매자 이름, 판매 일자는 필수 입력 항목입니다.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await saleApi.registerSale(livestockId, saleRequest);
            alert("판매 등록  변경 완료.");
            onSuccess(); 
            onClose();
        } catch (err: any) {
            console.error("Sale registration failed:", err);
            setError(err.response?.data?.message || "판매 등록 중 오류가 발생했습니다. (휴약 기간 또는 중복 판매 확인)");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div className="p-4 border-b flex justify-between items-center shrink-0">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign size={22}/> 판매 등록 (ID: {livestockId})
                </h3>
                <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-900"><X size={20}/></button>
            </div>
            
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {error && <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">{error}</div>}

                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <InputField label="판매 일자" type="date" required={true} value={saleRequest.saleDate} 
                                onChange={(e: ChangeEvent) => handleChange('saleDate', e.target.value)} />
                    <InputField label="판매 가격 (원)" type="number" required={true} min={1} value={saleRequest.price} 
                                onChange={(e: ChangeEvent) => handleChange('price', Number(e.target.value))} />
                    <InputField label="구매자 이름" type="text" required={true} value={saleRequest.customerName} 
                                onChange={(e: ChangeEvent) => handleChange('customerName', e.target.value)} />
                    <InputField label="판매 체중 (kg)" type="number" value={saleRequest.weight} 
                                onChange={(e: ChangeEvent) => handleChange('weight', Number(e.target.value))} />
                    <InputField label="판매 등급" type="text" value={saleRequest.grade} 
                                onChange={(e: ChangeEvent) => handleChange('grade', e.target.value)} />
                </div>
                
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">상세 비고</label>
                    <textarea 
                        value={saleRequest.notes} 
                        onChange={(e: ChangeEvent) => handleChange('notes', e.target.value)}
                        rows={3}
                        className="w-full p-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
            
            <div className="p-4 border-t flex justify-end shrink-0">
                <button 
                    onClick={handleRegisterSale}
                    disabled={isSubmitting || saleRequest.price <= 0 || !saleRequest.customerName.trim()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
                >
                    <Save size={18} /> {isSubmitting ? '등록 중...' : '판매 등록 실행'}
                </button>
            </div>
        </ModalWrapper>
    );
};

export default SaleRegistrationModal;