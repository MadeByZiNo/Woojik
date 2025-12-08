import { 
  Activity, Thermometer, Syringe, Baby, AlertTriangle, ArrowRight, 
  CheckCircle2, Cloud, CloudRain, Sun, TrendingUp, TrendingDown, MapPin 
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts'; // 그래프 도구 변경 (Area -> Pie)
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

// --- 1. 데이터 영역 ---

// [수정] 체중 데이터 삭제 -> 사육 현황 데이터 (DB status Group By 결과)
const statusData = [
  { name: '비육우 (Fattening)', value: 85, color: '#3b82f6' }, // Blue
  { name: '임신우 (Pregnant)', value: 12, color: '#ec4899' }, // Pink
  { name: '송아지 (Calf)', value: 28, color: '#eab308' },     // Yellow
  { name: '치료 중 (Sick)', value: 3, color: '#ef4444' },     // Red
];

// [시세 데이터] API 연동용 더미
const marketData = [
  { label: '한우 1++ (hanAvg_0)', price: '22,500', diff: 300, trend: 'up' },
  { label: '한우 1+ (hanAvg_1)', price: '19,800', diff: 150, trend: 'down' },
  { label: '한우 1 (hanAvg_2)', price: '17,500', diff: 0, trend: 'same' },
];

// ---------------------------

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      
      {/* 1. 상단 핵심 지표 (KPI) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard title="총 사육두수" value="128" unit="두" icon={<Activity size={24} />} theme="blue" />
        <StatusCard title="치료 중 (SICK)" value="3" unit="두" icon={<Thermometer size={24} />} theme="red" alert />
        <StatusCard title="임신우" value="12" unit="두" icon={<Baby size={24} />} theme="pink" />
        <StatusCard title="출하 가능" value="5" unit="두" icon={<CheckCircle2 size={24} />} theme="green" />
      </section>

      {/* 2. 중단: 사육 현황 & 날씨 & 시세 */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* (왼쪽 2/3) 사육 상태별 현황 (Pie Chart로 교체) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col min-h-[300px]">
           <div className="mb-2">
              <h3 className="text-lg font-bold text-gray-800">사육 형태별 비율</h3>
              <p className="text-sm text-gray-500">현재 농장 개체들의 상태별 점유율입니다.</p>
           </div>
           
           <div className="flex-1 w-full flex items-center justify-center relative">
             <ResponsiveContainer width="100%" height={250}>
               <PieChart>
                 <Pie
                   data={statusData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60} // 도넛 차트 스타일
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {statusData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                   ))}
                 </Pie>
                 <Tooltip 
                    formatter={(value: number) => [`${value}두`, '두수']}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                 />
                 <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-sm text-gray-600 ml-1 mr-4">{value}</span>}
                 />
               </PieChart>
             </ResponsiveContainer>

             {/* 도넛 가운데 총 두수 표시 */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-3xl font-bold text-gray-800">128</span>
                <span className="text-xs text-gray-400 font-medium uppercase">Total</span>
             </div>
           </div>
        </div>

        {/* (오른쪽 1/3) 날씨 & 시세 위젯 */}
        <div className="space-y-4">
          
          {/* 🌤️ 날씨 */}
          <div className="bg-gradient-to-br from-sky-400 to-blue-500 p-6 rounded-xl text-white shadow-md relative overflow-hidden">
             <div className="flex justify-between items-start z-10 relative">
                <div>
                   <div className="flex items-center gap-1 text-blue-50 text-sm font-medium mb-1">
                      <MapPin size={14} /> <span className="font-bold">전남 나주시</span>
                   </div>
                   <h3 className="text-4xl font-bold mt-1">맑음</h3>
                   <p className="text-blue-100 text-sm mt-1">최고 12° / 최저 -2°</p>
                </div>
                <Sun size={52} className="text-yellow-300 animate-pulse" />
             </div>

             <div className="mt-6 flex justify-between text-center border-t border-white/20 pt-4 relative z-10">
                <WeatherDay day="오늘" temp="8°" icon={<Sun size={18} className="text-yellow-300"/>} />
                <WeatherDay day="내일" temp="5°" icon={<Cloud size={18} className="text-gray-200"/>} />
                <WeatherDay day="모레" temp="2°" icon={<CloudRain size={18} className="text-blue-200"/>} />
             </div>
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl"></div>
          </div>

          {/* 💰 시세 (API) */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
               <div>
                 <h3 className="font-bold text-gray-800 flex items-center gap-2">
                   <TrendingUp size={18} className="text-red-500"/> 경락 가격
                 </h3>
                 <span className="text-[10px] text-gray-400">축평원 API 제공</span>
               </div>
               <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold">Today</span>
            </div>
            
            <div className="space-y-3">
              {marketData.map((item, idx) => (
                <MarketPriceRow 
                  key={idx}
                  grade={item.label} 
                  price={item.price} 
                  diff={item.diff} 
                  trend={item.trend} 
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. 하단: 긴급 알림 & 활동 로그 (기존 유지) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            ⚠️ 긴급 조치 필요 <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">2건</span>
          </h3>
          <AlertCard color="orange" title="휴약기간 주의" dDay="D-13" desc="8829호 외 2두가 약물 잔류 기간입니다." />
          <AlertCard color="pink" title="분만 예정 임박" dDay="D-3" desc="1004호 분만 예정일이 3일 남았습니다." />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm h-full min-h-[300px]">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">최근 활동</h3>
            <button className="text-gray-400 hover:text-blue-600 text-sm flex items-center gap-1">전체 <ArrowRight size={14} /></button>
          </div>
          <div className="divide-y divide-gray-50">
             <HistoryRow type="치료" desc="0023호 구제역 백신" time="10분 전" color="blue" />
             <HistoryRow type="번식" desc="9999호 인공수정" time="2시간 전" color="purple" />
             <HistoryRow type="이동" desc="8829호 A-1 → B-3" time="어제" color="gray" />
             <HistoryRow type="판매" desc="1234호 출하 완료" time="어제" color="green" />
          </div>
        </div>
      </section>

    </div>
  );
};

// --- 서브 컴포넌트 ---
// (StatusCard, WeatherDay, MarketPriceRow, AlertCard, HistoryRow는 위 코드와 동일하므로 생략하지 않고 
//  실제 파일에서는 그대로 두시면 됩니다. 필요하면 다시 적어드립니다.)

const StatusCard = ({ title, value, unit, icon, theme, alert }: any) => {
    const themes: any = {
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      red: "bg-red-50 text-red-600 border-red-100",
      pink: "bg-pink-50 text-pink-600 border-pink-100",
      green: "bg-green-50 text-green-600 border-green-100",
    };
    return (
      <div className={`bg-white p-5 rounded-xl border shadow-sm flex items-center justify-between hover:shadow-md transition ${alert ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-200'}`}>
        <div>
          <p className="text-xs font-bold text-gray-500 mb-1">{title}</p>
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
            <span className="text-xs text-gray-400 font-medium mb-1">{unit}</span>
          </div>
        </div>
        <div className={`p-3 rounded-full ${themes[theme]}`}>{icon}</div>
      </div>
    );
};

const WeatherDay = ({ day, temp, icon }: any) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-xs text-blue-100 font-medium">{day}</span>
    {icon}
    <span className="text-sm font-bold">{temp}</span>
  </div>
);

const MarketPriceRow = ({ grade, price, diff, trend }: any) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';
  
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 last:pb-0">
      <span className="text-sm font-bold text-gray-700">{grade}</span>
      <div className="text-right">
        <p className="font-bold text-gray-900 text-sm">
           {price} <span className="text-xs font-normal text-gray-400">원/kg</span>
        </p>
        <div className="flex items-center justify-end gap-1 text-[11px] font-medium">
           {isUp && <TrendingUp size={10} className="text-red-500"/>}
           {isDown && <TrendingDown size={10} className="text-blue-500"/>}
           <span className={`${isUp ? 'text-red-500' : isDown ? 'text-blue-500' : 'text-gray-400'}`}>
             {diff !== 0 ? `${diff}` : '-'}
           </span>
        </div>
      </div>
    </div>
  );
};

const AlertCard = ({ color, title, dDay, desc }: any) => {
    const colors: any = {
        orange: { bg: 'bg-white', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', icon: 'bg-orange-50 text-orange-500' },
        pink: { bg: 'bg-white', border: 'border-pink-200', badge: 'bg-pink-100 text-pink-700', icon: 'bg-pink-50 text-pink-500' }
    };
    const c = colors[color];
    return (
        <div className={`${c.bg} p-5 rounded-xl border ${c.border} shadow-sm flex items-start gap-4 hover:shadow-md transition`}>
            <div className={`${c.icon} p-3 rounded-full shrink-0`}>
                <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900">{title}</h4>
                    <span className={`${c.badge} text-xs font-bold px-2 py-1 rounded`}>{dDay}</span>
                </div>
                <p className="text-gray-600 text-sm mt-1">{desc}</p>
            </div>
        </div>
    );
}

const HistoryRow = ({ type, desc, time, color }: any) => {
    const colors: any = {
      blue: "bg-blue-100 text-blue-700",
      purple: "bg-purple-100 text-purple-700",
      gray: "bg-gray-100 text-gray-700",
      green: "bg-green-100 text-green-700",
    };
    return (
      <div className="p-4 hover:bg-gray-50 transition flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold px-2 py-1 rounded min-w-[32px] text-center ${colors[color]}`}>
            {type}
          </span>
          <span className="text-sm text-gray-700 truncate">{desc}</span>
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
      </div>
    );
};

export default DashboardPage;