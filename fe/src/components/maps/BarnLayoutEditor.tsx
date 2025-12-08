import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Rnd, type DraggableData } from 'react-rnd';
import type { PenLayoutData, BarnLayoutResponse } from '../../types/map'; 
import { X, Save, Maximize, Trash2, MapPin, AlertCircle, PlusCircle, Check, XCircle } from 'lucide-react'; 
import { mapApi } from '../../services/mapApi'; 

// --- 설정 및 타입 ---

const GRID_SIZE = 100; // 그리드 1칸 크기 (px)
const MAX_GRID_W = 20; // 캔버스 가로 최대 칸 수 (넉넉하게)
const MAX_GRID_H = 20; // 캔버스 세로 최대 칸 수

interface PlacedPen extends PenLayoutData {
  // 내부 로직용 좌표 (0-based index)
  x: number; 
  y: number;
  w: number;
  h: number;
}

interface Props {
  barnId: number;
  onClose: () => void;
  onLayoutSaved: () => void;
}


// 백엔드 데이터(1-based) -> 내부용 데이터(0-based)
const toInternalLayout = (data: PenLayoutData[]): PlacedPen[] => {
  return data.map(p => ({
    ...p,
    x: p.gridCol - 1,
    y: p.gridRow - 1,
    w: p.colSpan,
    h: p.rowSpan,
  }));
};

// 내부용 데이터 -> 백엔드 전송용 데이터
const toBackendLayout = (layout: PlacedPen[]): PenLayoutData[] => {
  return layout.map(p => ({
    penId: p.penId,
    penName: p.penName,
    capacity: p.capacity,
    gridCol: p.x + 1, // 0 -> 1
    gridRow: p.y + 1, // 0 -> 1
    colSpan: p.w,
    rowSpan: p.h,
  }));
};

// --- 3. 메인 컴포넌트 ---

const BarnLayoutEditor = ({ barnId, onClose, onLayoutSaved }: Props) => {
  const [placedPens, setPlacedPens] = useState<PlacedPen[]>([]); // 배치된 방
  const [unplacedPens, setUnplacedPens] = useState<PenLayoutData[]>([]); // 미배치 방
  
  const [livestockCounts, setLivestockCounts] = useState<{[key: number]: number}>({});
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🚨 추가: 새 방 추가 폼 상태
  const [isAddingNewPen, setIsAddingNewPen] = useState(false);
  const [newPenData, setNewPenData] = useState({ name: '', capacity: 10 });
  
  // 드래그 중인 객체 추적 (왼쪽 -> 오른쪽 이동용)
  const draggingItemRef = useRef<PenLayoutData | null>(null);

  // 🚨 추가: 새 방에 할당할 임시 ID 추적 (음수 사용)
  const nextTempId = useRef(-1); 

  // --- 데이터 로드 (API 호출 부분 수정) ---
  useEffect(() => {
    const fetchLayout = async () => {
      if (!barnId) return;
      setLoading(true);
      try {
        const data: BarnLayoutResponse = await mapApi.getBarnLayout(barnId);
        
        setPlacedPens(toInternalLayout(data.layouts));
        setUnplacedPens(data.unplacedPens);
        setLivestockCounts(data.livestockCounts);

      } catch (err: any) {
        setError(err.message || "기존 배치 데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchLayout();
  }, [barnId]);


  // --- 핵심 로직: 충돌 감지 및 쳐내기 (Kick-out) ---
  
  const findCollisions = (target: PlacedPen, excludeId: number) => {
    return placedPens.filter((p) => {
      if (p.penId === excludeId) return false;
      // 사각형 겹침 공식 (AABB)
      return (
        target.x < p.x + p.w &&
        target.x + target.w > p.x &&
        target.y < p.y + p.h &&
        target.y + target.h > p.y
      );
    });
  };

  const updatePlacement = (newItem: PlacedPen) => {
    // 1. 충돌 검사
    const collisions = findCollisions(newItem, newItem.penId);

    // 🚨 충돌 대상 중 가축이 있는 방이 있는지 확인
    const collidingPensWithLivestock = collisions.filter(
      (c) => livestockCounts[c.penId] && livestockCounts[c.penId] > 0
    );

    if (collidingPensWithLivestock.length > 0) {
      const penNames = collidingPensWithLivestock.map(c => c.penName).join(', ');
      alert(`배치 실패: ${penNames} 방에 가축이 남아있어 덮어쓸 수 없습니다.`);
      return; // 업데이트 중단
    }

    // 2. 배치 목록 업데이트 (충돌 대상 제거 및 새 항목 추가)
    setPlacedPens((prev) => {
      const survivors = prev.filter(
        (p) => !collisions.some((c) => c.penId === p.penId) && p.penId !== newItem.penId
      );
      return [...survivors, newItem];
    });

    // 3. 충돌난 녀석들은 미배치 목록으로 강퇴 (가축이 없는 경우만)
    if (collisions.length > 0) {
      setUnplacedPens((prev) => {
        const kickedOut = toBackendLayout(collisions); 
        return [...prev, ...kickedOut];
      });
    }
  };

  // --- 이벤트 핸들러 ---
  
  // 🚨 신규 기능: 새 방 생성 및 목록 추가
  const handleCreateNewPen = () => {
    if (!newPenData.name.trim()) {
      alert("방 이름을 입력해주세요.");
      return;
    }
    const capacityValue = Number(newPenData.capacity);
    if (isNaN(capacityValue) || capacityValue <= 0) {
        alert("유효한 수용량을 입력해주세요.");
        return;
    }

    const newPen: PenLayoutData = {
      penId: nextTempId.current,
      penName: newPenData.name.trim(),
      capacity: capacityValue,
      gridRow: 1, gridCol: 1, rowSpan: 1, colSpan: 1, // 기본 크기
    };

    setUnplacedPens(prev => [newPen, ...prev]);
    nextTempId.current -= 1;
    
    // 폼 초기화 및 닫기
    setNewPenData({ name: '', capacity: 10 });
    setIsAddingNewPen(false);
  };
  
  // 🚨 신규 기능: 미배치 방 완전 삭제 (세션에서 제거)
  const handleDeleteUnplacedPen = (id: number, name: string) => {
    if (window.confirm(`"${name}" 방을 편집기 목록에서 완전히 제거하고 저장하지 않겠습니까?`)) {
      setUnplacedPens(prev => prev.filter(p => p.penId !== id));
    }
  };

  // 1. 왼쪽 사이드바 -> 드래그 시작
  const handleDragStartFromSidebar = (e: React.DragEvent, item: PenLayoutData) => {
    draggingItemRef.current = item;
    e.dataTransfer.effectAllowed = 'move';
  };

  // 2. 캔버스에 드롭 (신규 배치)
  const handleDropOnGrid = (e: React.DragEvent) => {
    e.preventDefault();
    const item = draggingItemRef.current;
    if (!item) return;

    // 좌표 계산 (생략) ...
    const gridRect = e.currentTarget.getBoundingClientRect();
    const scrollTop = e.currentTarget.scrollTop;
    const scrollLeft = e.currentTarget.scrollLeft;

    const rawX = e.clientX - gridRect.left + scrollLeft;
    const rawY = e.clientY - gridRect.top + scrollTop;

    const dropX = Math.floor(rawX / GRID_SIZE);
    const dropY = Math.floor(rawY / GRID_SIZE);

    // 새 아이템 생성
    const newPlaced: PlacedPen = { 
      ...item, 
      x: dropX, 
      y: dropY, 
      w: item.colSpan || 1, 
      h: item.rowSpan || 1 
    };

    updatePlacement(newPlaced);

    // 미배치 목록에서 제거
    setUnplacedPens((prev) => prev.filter((p) => p.penId !== item.penId));
    draggingItemRef.current = null;
  };

  // 3. 내부 이동/리사이징 (Rnd)
  const handleRndDragStop = (id: number, d: DraggableData) => {
    const target = placedPens.find(p => p.penId === id);
    if (!target) return;
    
    const newX = Math.round((d.x + 1) / GRID_SIZE);
    const newY = Math.round((d.y + 1) / GRID_SIZE);

    if (newX !== target.x || newY !== target.y) {
      updatePlacement({ ...target, x: newX, y: newY });
    }
  };

  const handleRndResizeStop = (id: number, ref: HTMLElement, pos: { x: number; y: number }) => {
    const target = placedPens.find(p => p.penId === id);
    if (!target) return;

    const newW = Math.round(ref.offsetWidth / GRID_SIZE);
    const newH = Math.round(ref.offsetHeight / GRID_SIZE);
    const newX = Math.round((pos.x + 1) / GRID_SIZE);
    const newY = Math.round((pos.y + 1) / GRID_SIZE);

    updatePlacement({ ...target, x: newX, y: newY, w: newW, h: newH });
  };

  // 4. 배치된 방 삭제 (캔버스 -> 미배치 목록 복귀)
  const handleRemove = (id: number) => {
    const target = placedPens.find(p => p.penId === id);
    if (!target) return;

    const count = livestockCounts[id] || 0;
    if (count > 0) {
      alert(`배치 삭제 불가: ${target.penName} 방에 현재 ${count}마리의 가축이 남아있습니다. 가축을 먼저 이동시키세요.`);
      return;
    }

    setPlacedPens(prev => prev.filter(p => p.penId !== id));
    // 미배치 목록으로 복귀
    setUnplacedPens(prev => [...prev, ...toBackendLayout([target])]);
  };

  // 5. 저장
  const handleSaveLayout = async () => {
    if (placedPens.length === 0) {
      alert("배치된 방이 없습니다.");
      return;
    }
    setIsSubmitting(true);
    try {
      const finalLayouts = toBackendLayout(placedPens);
      
      await mapApi.saveLayout(barnId, { barnId, layouts: finalLayouts });
      
      alert("성공적으로 저장되었습니다.");
      onLayoutSaved();
      onClose();
    } catch (err: any) {
      setError(err.message || "배치 정보 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- 렌더링 ---
  if (loading) return <ModalWrapper onClose={onClose}><div className="p-8 text-center text-gray-600">데이터 로딩 중...</div></ModalWrapper>;

  return (
    <ModalWrapper onClose={onClose}>
      <div className="flex flex-col h-full bg-white">
        
        {/* 헤더 */}
        <div className="p-5 border-b flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Maximize size={20}/> 축사 배치 편집
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition"><X size={24} /></button>
        </div>

        {/* 에러 메시지 */}
        {error && <div className="p-4"><ErrorMessage message={error} /></div>}

        <div className="flex-1 flex overflow-hidden">
          
          {/* LEFT: 미배치 방 목록 및 추가 버튼 */}
          <div className="w-72 border-r p-4 flex flex-col gap-3 shrink-0 bg-gray-50 overflow-y-auto">
            <h4 className="text-sm font-bold text-gray-600 flex justify-between items-center">
              미배치 방 <span className="text-blue-600">{unplacedPens.length}</span>
            </h4>
                {/* 🚨 새 방 추가 버튼 */}
                <button 
                    onClick={() => setIsAddingNewPen(prev => !prev)}
                    className="flex items-center justify-center gap-2 px-3 py-3 border-2 border-dashed border-green-500 text-green-700 bg-white rounded-lg font-bold hover:bg-green-50 transition"
                >
                    <PlusCircle size={20} /> 새 방 추가
                </button>
                
                {/* 🚨 새 방 입력 폼 */}
                {isAddingNewPen && (
                    <div className="bg-white p-3 border border-green-300 rounded-lg shadow-inner space-y-2">
                        <input 
                            type="text"
                            placeholder="방 이름 (필수)"
                            value={newPenData.name}
                            onChange={(e) => setNewPenData(p => ({ ...p, name: e.target.value }))}
                            className="w-full px-2 py-1 border rounded text-sm focus:ring-green-500"
                        />
                         <input 
                            type="number"
                            placeholder="수용 두수 (숫자)"
                            value={newPenData.capacity}
                            onChange={(e) => setNewPenData(p => ({ ...p, capacity: Number(e.target.value) }))}
                            min="1"
                            className="w-full px-2 py-1 border rounded text-sm focus:ring-green-500"
                        />
                        <div className="flex justify-end gap-1">
                            <button 
                                onClick={handleCreateNewPen}
                                className="p-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm flex items-center"
                                title="추가"
                            >
                                <Check size={16}/>
                            </button>
                            <button 
                                onClick={() => setIsAddingNewPen(false)}
                                className="p-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 text-sm flex items-center"
                                title="취소"
                            >
                                <XCircle size={16}/>
                            </button>
                        </div>
                    </div>
                )}

            {unplacedPens.map((pen) => (
              <div 
                key={pen.penId}
                className="bg-white border border-dashed border-gray-300 p-3 rounded-lg shadow-sm cursor-grab hover:border-blue-400 hover:shadow-md transition active:cursor-grabbing select-none relative group"
                draggable
                onDragStart={(e) => handleDragStartFromSidebar(e, pen)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MapPin size={16} className="text-gray-500"/>
                  <span className="font-medium text-gray-700">{pen.penName}</span>
                </div>
                <div className="text-xs text-gray-500 pl-6">
                  수용: {pen.capacity}두 ({pen.colSpan}x{pen.rowSpan}) 
                </div>
                {/* 🚨 완전 삭제 버튼 */}
                <button
                    onClick={() => handleDeleteUnplacedPen(pen.penId, pen.penName)}
                    className="absolute top-1 right-1 p-1 text-red-500 bg-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 transition"
                    title="이 방을 목록에서 완전히 삭제합니다."
                >
                    <Trash2 size={16} />
                </button>
              </div>
            ))}
             {unplacedPens.length === 0 && (
                <div className="text-center text-gray-400 text-sm mt-10">모두 배치됨</div>
             )}
          </div>

          {/* RIGHT: Grid 캔버스 영역 */}
          <div 
            className="flex-1 overflow-auto bg-gray-100 relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDropOnGrid}
          >
            {/* 그리드 배경 (모눈종이) */}
            <div 
              style={{ 
                width: MAX_GRID_W * GRID_SIZE, 
                height: MAX_GRID_H * GRID_SIZE,
                backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`
              }}
              className="bg-white border m-4 shadow-sm relative"
            >
              {placedPens.map((item) => {
                const count = livestockCounts[item.penId] || 0;
                const hasLivestock = count > 0;
                
                return (
                  <Rnd
                    key={item.penId}
                    size={{ width: item.w * GRID_SIZE, height: item.h * GRID_SIZE }}
                    position={{ x: item.x * GRID_SIZE - 1, y: item.y * GRID_SIZE - 1 }}
                    onDragStop={(_e, d) => handleRndDragStop(item.penId, d)}
                    onResizeStop={(e, dir, ref, delta, pos) => handleRndResizeStop(item.penId, ref, pos)}
                    dragGrid={[GRID_SIZE, GRID_SIZE]}
                    resizeGrid={[GRID_SIZE, GRID_SIZE]}
                    bounds="parent"
                    className="group"
                  >
                    {/* 아이템 디자인 (Tailwind 적용) */}
                    <div 
                        className={`w-full h-full border-2 rounded-lg flex flex-col items-center justify-center shadow-md relative select-none transition-colors 
                                    ${hasLivestock ? 'bg-red-100 border-red-500 cursor-not-allowed' : 'bg-blue-100 border-blue-500 hover:bg-blue-200'} `}
                        title={hasLivestock ? `${count}마리 잔류. 삭제 불가` : '배치 수정 가능'}
                    >
                      <span className="font-bold text-lg text-gray-900">{item.penName}</span>
                      <span className={`text-sm mt-1 ${hasLivestock ? 'text-red-700 font-bold' : 'text-blue-700'}`}>
                        {hasLivestock ? `🚨 ${count}두 잔류` : `수용: ${item.capacity}두`}
                      </span>
                      
                      {/* 삭제 버튼 - 소가 있으면 비활성화 */}
                      <button 
                        className={`absolute top-1 right-1 p-1 bg-white rounded-full transition-opacity shadow-sm 
                                    ${hasLivestock 
                                      ? 'text-gray-400 opacity-80 cursor-not-allowed' 
                                      : 'text-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-50'}`
                                    }
                        disabled={hasLivestock}
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={() => handleRemove(item.penId)}
                      >
                        <Trash2 size={14}/>
                      </button>
                      
                      {/* 좌표 디버깅용 */}
                      <span className="absolute bottom-1 right-2 text-[10px] text-blue-400 opacity-50">
                        {item.x+1}, {item.y+1}
                      </span>
                    </div>
                  </Rnd>
                );
              })}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="p-4 border-t flex justify-end gap-3 shrink-0 bg-white">
          <button 
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition"
          >
            <X size={20} /> 닫기
          </button>
          <button 
            onClick={handleSaveLayout}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-md disabled:bg-gray-400"
          >
            <Save size={20} />
            {isSubmitting ? '저장 중...' : '배치 저장'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default BarnLayoutEditor;

const ModalWrapper = ({ children, onClose }: { children: React.ReactNode, onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] overflow-hidden flex flex-col shadow-2xl">
      {children}
      {/* 🚨 경고: 이 컴포넌트는 ModalWrapper 내부에 정의되어 있으며, 이 컴포넌트의 사용은 이전 코드 흐름을 유지하기 위함입니다. */}
    </div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="bg-red-50 border border-red-300 text-red-700 p-3 rounded-lg flex items-center gap-3">
    <AlertCircle size={20} />
    <span className="text-sm font-medium">{message}</span>
  </div>
);