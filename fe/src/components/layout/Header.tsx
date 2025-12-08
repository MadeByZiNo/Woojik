import { Bell } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const today = dayjs().format('YYYY년 MM월 DD일 (ddd)');

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
      {/* 페이지 타이틀 */}
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      
      {/* 우측 정보 영역 */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500 font-medium bg-gray-50 px-3 py-1 rounded-full">
          {today}
        </span>
      </div>
    </header>
  );
};

export default Header;