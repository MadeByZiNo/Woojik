import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Map, DollarSign, LogOut, User } from 'lucide-react';
import { type ReactNode } from 'react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <span className="text-2xl font-bold text-blue-600 tracking-tight">Woojik</span>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <MenuLabel label="메뉴" />
        <NavItem to="/" icon={<Home size={20} />} label="홈 (대시보드)" />
        <NavItem to="/list" icon={<ClipboardList size={20} />} label="개체 관리" />
        <NavItem to="/map" icon={<Map size={20} />} label="축사 지도" />
        <NavItem to="/sales" icon={<DollarSign size={20} />} label="판매 이력" />
        <div className="my-4 border-t border-gray-100"></div>
      </nav>

      {/* 하단 프로필 영역 */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <User size={18} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-gray-700 truncate">김우직 사장님</p>
            <p className="text-xs text-gray-500 truncate">woojik@farm.com</p>
          </div>
          <button className="text-gray-400 hover:text-red-500 transition p-1 hover:bg-red-50 rounded">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};


const MenuLabel = ({ label }: { label: string }) => (
  <p className="px-4 text-xs font-bold text-gray-400 mb-2 mt-2 uppercase tracking-wider">{label}</p>
);

const NavItem = ({ to, icon, label }: { to: string; icon: ReactNode; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? 'bg-blue-50 text-blue-700 shadow-sm'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default Sidebar;