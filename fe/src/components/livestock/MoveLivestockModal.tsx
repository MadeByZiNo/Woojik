// src/components/livestock/MoveLivestockModal.tsx

import React, { useState, useEffect } from 'react';
import { livestockApi } from '../../services/livestockApi';
import { barnApi } from '../../services/barnApi'; 
import { X, Check } from 'lucide-react';
import { type PenOption} from '../../types/barn';

const ModalWrapper = ({ children, onClose }: any) => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl">
            {children}
        </div>
    </div>
);

interface Props {
    livestockId: number;
    currentPenId: number;
    currentBarnId: number; // 🚨 필수: 펜 옵션을 조회하기 위해 필요
    onClose: () => void;
    onSuccess: () => void;
}

const MoveLivestockModal = ({ livestockId, currentPenId, currentBarnId, onClose, onSuccess }: Props) => {
    const [destinationPenId, setDestinationPenId] = useState<number | null>(null);
    const [penOptions, setPenOptions] = useState<PenOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 펜 목록 조회 (현재 축사에 있는 모든 펜)
    useEffect(() => {
        const fetchPenOptions = async () => {
            try {
                const data = await barnApi.getPensByBarn(currentBarnId);
                setPenOptions(data);
            } catch (err) {
                setError("이동 가능한 방 목록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchPenOptions();
    }, [currentBarnId]);

    const handleMove = async () => {
        if (!destinationPenId) {
            setError("이동할 방을 선택해주세요.");
            return;
        }
        if (destinationPenId === currentPenId) {
            setError("현재 위치와 동일한 방입니다.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            await livestockApi.moveLivestock(livestockId, destinationPenId);
            alert("가축이 성공적으로 이동되었습니다.");
            onSuccess(); // 부모 데이터 새로고침
            onClose();
        } catch (err: any) {
            setError(err.message || "이동 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ModalWrapper onClose={onClose}>
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">가축 이동</h3>
                <button onClick={onClose} className="p-1"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-4">
                {loading && <div className='text-center'>목록 로딩 중...</div>}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">이동할 방 선택:</label>
                    <select
                        onChange={(e) => setDestinationPenId(Number(e.target.value))}
                        value={destinationPenId || ''}
                        className="w-full p-2 border rounded-lg"
                        disabled={loading || isSubmitting}
                    >
                        <option value="">-- 방 선택 --</option>
                        {penOptions.map(pen => (
                            <option key={pen.id} value={pen.id} disabled={pen.id === currentPenId}>
                                {pen.name} {pen.id === currentPenId && "(현재 위치)"}
                            </option>
                        ))}
                    </select>
                </div>
                
                <p className='text-xs text-gray-500'>* 미배치 상태의 방으로도 이동 가능합니다.</p>
            </div>
            
            <div className="p-4 border-t flex justify-end">
                <button
                    onClick={handleMove}
                    disabled={!destinationPenId || isSubmitting}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold disabled:bg-gray-400"
                >
                    <Check size={18} /> {isSubmitting ? '이동 중...' : '이동 실행'}
                </button>
            </div>
        </ModalWrapper>
    );
};

export default MoveLivestockModal;