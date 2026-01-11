import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../../context/InventoryContext";

function Inventory() {
  const navigate = useNavigate();
  const { inventory, removeFromInventory, clearInventory } = useInventory();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("최근추가");
  const [selectMode, setSelectMode] = useState(false);
  const [selectedCards, setSelectedCards] = useState([]);

  const totalCards = inventory.length;

  // 검색 필터링
  const filteredCards = inventory.filter((card) =>
    card.cardName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 정렬
  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === "이름순") {
      return (a.cardName || "").localeCompare(b.cardName || "");
    }
    return 0;
  });

  // 카드 선택 핸들러
  const handleCardSelect = (cardId) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  // 선택된 카드 삭제
  const handleDeleteSelected = () => {
    if (selectedCards.length === 0) {
      alert("삭제할 카드를 선택해주세요.");
      return;
    }
    if (window.confirm(`선택한 ${selectedCards.length}개의 카드를 인벤토리에서 삭제하시겠습니까?`)) {
      selectedCards.forEach(cardId => {
        removeFromInventory(cardId);
      });
      setSelectedCards([]);
      setSelectMode(false);
    }
  };

  // 전체 선택
  const handleSelectAll = () => {
    if (selectedCards.length === sortedCards.length) {
      setSelectedCards([]);
    } else {
      setSelectedCards(sortedCards.map(card => card.cardId));
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-[2400px] mx-auto px-10 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">내 인벤토리</h1>
          <p className="text-sm text-gray-500">
            작업용으로 모아둔 카드들을 관리하세요. 총 {totalCards}개
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="인벤토리 내 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option>최근추가</option>
              <option>이름순</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* 선택 모드 토글 */}
          <button
            onClick={() => {
              setSelectMode(!selectMode);
              setSelectedCards([]);
            }}
            className={`h-[42px] px-4 text-sm rounded-lg transition-colors flex items-center gap-2 ${
              selectMode
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>선택 모드</span>
          </button>

          {/* 전체 선택 버튼 */}
          {selectMode && sortedCards.length > 0 && (
            <button
              onClick={handleSelectAll}
              className="h-[42px] px-4 text-sm rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {selectedCards.length === sortedCards.length ? "전체 해제" : "전체 선택"}
            </button>
          )}

          {/* 선택 삭제 버튼 */}
          {selectMode && selectedCards.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="h-[42px] px-4 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>{selectedCards.length}개 삭제</span>
            </button>
          )}

          {/* 전체 비우기 버튼 */}
          {!selectMode && inventory.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("인벤토리를 모두 비우시겠습니까?")) {
                  clearInventory();
                }
              }}
              className="h-[42px] px-4 text-sm rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>전체 비우기</span>
            </button>
          )}
        </div>

        {/* 카드 목록 */}
        {sortedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">
              {searchTerm ? "검색 결과가 없습니다" : "인벤토리가 비어있습니다"}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              {searchTerm ? "다른 검색어를 입력해보세요" : "카드 피드에서 카드를 추가하여 작업용 인벤토리를 구성하세요"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigate("/feed")}
                className="px-6 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                피드로 이동
              </button>
            )}
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
            {sortedCards.map((card) => (
              <div
                key={card.cardId}
                className={`break-inside-avoid group cursor-pointer ${
                  selectMode && selectedCards.includes(card.cardId) ? "ring-2 ring-blue-500 rounded-lg" : ""
                }`}
                onClick={() => selectMode ? handleCardSelect(card.cardId) : navigate(`/feed/${card.cardId}`)}
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-100 transition-shadow hover:shadow-lg">
                  {/* 선택 체크박스 */}
                  {selectMode && (
                    <div className="absolute top-2 left-2 z-10">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedCards.includes(card.cardId)
                          ? "bg-blue-500 border-blue-500"
                          : "bg-white/80 border-gray-300"
                      }`}>
                        {selectedCards.includes(card.cardId) && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 삭제 버튼 (선택 모드가 아닐 때만 표시) */}
                  {!selectMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`"${card.cardName}" 카드를 인벤토리에서 삭제하시겠습니까?`)) {
                          removeFromInventory(card.cardId);
                        }
                      }}
                      className="absolute top-2 right-2 z-10 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}

                  {card.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={card.cardName}
                      className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      이미지 없음
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* 카드 정보 */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
                    <h3 className="text-white text-sm font-medium mb-1 truncate">{card.cardName}</h3>
                    <div className="flex items-center gap-3 text-white/80 text-xs">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {card.likeCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {card.viewCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>#</span>
                        {card.tagCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;