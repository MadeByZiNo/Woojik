import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
  const location = useLocation();

  const getTitle = (path: string) => {
    if (path === '/') return '대시보드';
    if (path.startsWith('/list')) return '개체 관리';
    if (path.startsWith('/map')) return '축사 지도';
    if (path.startsWith('/settings')) return '시스템 설정';
    return 'Woojik Admin';
  };

  const title = getTitle(location.pathname);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />

        <main className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto pb-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;