import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/layout/MainLayout'; 
import BarnMapPage from './pages/BarnMapPage'; 
import LivestockListPage from './pages/LivestockListPage';
import DashboardPage from './pages/DashboardPage';
import SoldLivestockListPage from './pages/SoldLivestockListPage';
const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="list" element={<LivestockListPage />} /> 
                    <Route path="map" element={<BarnMapPage />} />
                    <Route path="sales" element={<SoldLivestockListPage />} />
                    {/* 404 처리 */}
                    <Route path="*" element={<div className="p-8 text-xl text-red-500">404: 페이지를 찾을 수 없습니다.</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;