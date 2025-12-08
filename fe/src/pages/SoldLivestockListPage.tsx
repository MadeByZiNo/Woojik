// SoldLivestockListPage.tsx

import React, { useState, useEffect } from 'react';
import { saleApi } from '../services/saleApi';
import type { SaleResponse } from '../types/sale';
import { DollarSign, List, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import SaleDetailViewModal from '../components/sale/SaleDetailViewModal'; 

const SoldLivestockListPage = () => {
    const [salesList, setSalesList] = useState<SaleResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSale, setSelectedSale] = useState<SaleResponse | null>(null); 

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const data = await saleApi.getSoldLivestockList();
                setSalesList(data);
            } catch (err: any) {
                setError(err.message || "판매 이력 목록을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);
    
    // 테이블 렌더링 로직
    if (loading) return <div className="p-8 text-center">판매 이력 로딩 중...</div>;
    if (error) return <div className="p-8 text-red-500 font-bold flex items-center gap-2"><AlertCircle size={20}/> {error}</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
                 완료 가축 이력 ({salesList.length}건)
            </h1>

            {salesList.length === 0 ? (
                <div className="text-center py-20 text-gray-500 border border-dashed rounded-lg">
                    등록된 판매 이력이 없습니다.
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">귀표번호</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">품종 / 생년월일</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">판매 일자</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">판매 가격</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구매자</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {salesList.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedSale(sale)}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.earTag}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {sale.breed} / {dayjs(sale.birthDate).format('YYYY.MM.DD')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{dayjs(sale.saleDate).format('YYYY.MM.DD')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">{sale.price.toLocaleString()} 원</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sale.customerName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* 판매 상세 정보 모달 렌더링 */}
            {selectedSale && (
                <SaleDetailViewModal 
                    saleInfo={selectedSale}
                    onClose={() => setSelectedSale(null)}
                />
            )}
        </div>
    );
};

export default SoldLivestockListPage;