import { Search } from 'lucide-react';

interface Props {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
}

const LivestockFilter = ({ searchTerm, onSearchChange, filterStatus, onFilterChange }: Props) => {
  const statusOptions = [
    { value: 'ALL', label: '전체' },
    { value: 'FATTENING', label: '비육' },
    { value: 'PREGNANT', label: '임신' },
    { value: 'SICK', label: '치료' },
    { value: 'CALF', label: '송아지' },
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      {/* 검색창 */}
      <div className="relative w-full md:w-96">
        <input 
          type="text" 
          placeholder="귀표번호(4자리) 또는 별명 검색" 
          className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
      </div>

      {/* 상태 필터 탭 */}
      <div className="flex p-1 bg-gray-100 rounded-lg w-full md:w-auto overflow-x-auto">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all whitespace-nowrap ${
              filterStatus === option.value 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LivestockFilter;