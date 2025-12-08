import React from 'react';
import { X, Calendar, DollarSign, User, Home } from 'lucide-react';
import type { SaleResponse } from '../../types/sale';
import dayjs from 'dayjs';

interface Props {
    saleInfo: SaleResponse;
    onClose: () => void;
}

const SaleInfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-start gap-3">
        <div className={`mt-1 shrink-0 text-blue-600`}>{icon}</div>
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
            <p className="text-lg font-bold text-gray-800 tracking-tight">
                {value}
            </p>
        </div>
    </div>
);

const SaleDetailViewModal = ({ saleInfo, onClose }: Props) => {
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <DollarSign size={20}/> 판매 상세 정보 ({saleInfo.earTag})
                    </h3>
                    <button onClick={onClose} className="p-1"><X size={20}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <SaleInfoRow label="판매 일자" value={dayjs(saleInfo.saleDate).format('YYYY.MM.DD')} icon={<Calendar size={18}/>} />
                        <SaleInfoRow label="판매 가격" value={`${saleInfo.price.toLocaleString()} 원`} icon={<DollarSign size={18}/>} />
                        <SaleInfoRow label="구매자" value={saleInfo.customerName} icon={<User size={18}/>} />
                        <SaleInfoRow label="판매 등급" value={saleInfo.grade} icon={<span className="font-bold">G</span>} />
                        <SaleInfoRow label="판매 체중" value={`${saleInfo.weight} kg`} icon={<span className="font-bold">W</span>} />
                        <SaleInfoRow label="품종 / 생년월일" value={`${saleInfo.breed} / ${dayjs(saleInfo.birthDate).format('YYYY.MM.DD')}`} icon={<Home size={18}/>} />
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">비고:</p>
                        <p className="text-gray-800 whitespace-pre-wrap">{saleInfo.notes || '특이사항 없음'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaleDetailViewModal;