import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCards, useGetAllDecks, useAddCardToDeck } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import AlarmModal from "../../components/AlarmModal";
// import gridIcon from "./../../assets/feed/grid.svg";
// import listIcon from "./../../assets/feed/list.svg";

function Feed() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // const [viewMode, setViewMode] = useState("grid");
  // const [cardSize, setCardSize] = useState("medium");
  // const [searchMode, setSearchMode] = useState("and");
  // const [showFilter, setShowFilter] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [isInventoryOpen, setIsInventoryOpen] = useState(true);
  
  // 덱 선택 관련 상태
  const [showDeckList, setShowDeckList] = useState(null);

  // 로그인 필요 모달 상태
  const [showLoginModal, setShowLoginModal] = useState(false);

  // API에서 카드 데이터 가져오기 - 로그인 여부와 관계없이 호출
  const { data, isLoading, isError, error } = useGetCards();

  // 덱 목록 가져오기 - 로그인한 경우에만
  const { data: decksData } = useGetAllDecks({
    enabled: isAuthenticated,
  });

  // 덱에 카드 추가 mutation
  const { mutate: addCardToDeck } = useAddCardToDeck();

  // 실제 카드 데이터 추출
  const cards = data?.data?.data || [];
  const decks = decksData?.data?.data || [];

  console.log("=== 덱 목록 ===", decks);

  // 로그인 체크 함수
  const requireLogin = (callback) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return false;
    }
    if (callback) callback();
    return true;
  };

  // 좋아요 클릭 핸들러
  const handleLikeClick = (e, cardId) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    
    console.log("좋아요 클릭:", cardId);
    // TODO: 좋아요 API 호출
  };

  // 인벤토리 담기 클릭 핸들러
  const handleInventoryClick = (e, card) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    
    const isAlreadyInInventory = inventory.some(item => item.cardId === card.cardId);
    
    if (isAlreadyInInventory) {
      setInventory(inventory.filter(item => item.cardId !== card.cardId));
    } else {
      setInventory([...inventory, card]);
    }
  };

  // 덱 추가 버튼 클릭 핸들러
  const handleDeckButtonClick = (e, cardId) => {
    e.stopPropagation();
    if (!requireLogin()) return;
    
    setShowDeckList(showDeckList === cardId ? null : cardId);
  };

  // 덱에 카드 추가 핸들러
  const handleAddToDeck = (e, deckId, cardId) => {
    e.stopPropagation();
    
    addCardToDeck(
      { deckId, cardIds: [cardId] },
      {
        onSuccess: () => {
          alert("덱에 카드가 추가되었습니다!");
          setShowDeckList(null);
        },
        onError: (err) => {
          alert("카드 추가 실패: " + (err.response?.data?.message || err.message));
        },
      }
    );
  };

  // 인벤토리에서 카드 제거
  const handleRemoveFromInventory = (cardId) => {
    setInventory(inventory.filter(item => item.cardId !== cardId));
  };

  // 인벤토리에 있는지 확인
  const isInInventory = (cardId) => {
    return inventory.some(item => item.cardId === cardId);
  };

  // 데이터 로딩 중
  if (isLoading) {
    return (
      <div className="w-full min-h-full bg-white flex items-center justify-center">
        <p>카드 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="w-full min-h-full bg-white flex items-center justify-center">
        <p className="text-red-500">에러 발생: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full bg-white">
      <main className={`${inventory.length > 0 ? "pb-24" : ""}`}>
        {/* 위쪽 구역 */}
        <section>
          {/* 헤더 & 버튼 */}
          <div className="flex justify-between items-center h-[100px] px-10">
            <div>
              <h2 className="text-xl font-bold">한국적 디자인 카드 아카이브</h2>
              <p className="text-gray-600">
                태그와 카드로 연결된 위키트리 지식 네트워크
              </p>
            </div>

            {/* 버튼 그룹 - 추후 구현 예정 */}
            {/* <div className="flex gap-3 items-center">
              <div className="flex border border-black rounded-xl divide-x divide-black overflow-hidden">
                <div
                  className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-2 ${viewMode === "grid"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                    }`}
                  onClick={() => setViewMode("grid")}
                >
                  <img
                    src={gridIcon}
                    alt="grid"
                    className={`w-4 h-4 ${viewMode === "grid" ? "invert" : ""}`}
                  />
                  그리드
                </div>
                <div
                  className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-2 ${viewMode === "list"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                    }`}
                  onClick={() => setViewMode("list")}
                >
                  <img
                    src={listIcon}
                    alt="list"
                    className={`w-4 h-4 ${viewMode === "list" ? "invert" : ""}`}
                  />
                  리스트
                </div>
              </div>

              <div className="flex border border-black rounded-xl divide-x divide-black overflow-hidden">
                <div
                  className={`px-4 py-3 cursor-pointer transition-colors ${cardSize === "small"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                    }`}
                  onClick={() => setCardSize("small")}
                >
                  소형
                </div>
                <div
                  className={`px-4 py-3 cursor-pointer transition-colors ${cardSize === "medium"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                    }`}
                  onClick={() => setCardSize("medium")}
                >
                  중형
                </div>
                <div
                  className={`px-4 py-3 cursor-pointer transition-colors ${cardSize === "large"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                    }`}
                  onClick={() => setCardSize("large")}
                >
                  대형
                </div>
              </div>

              <div className="border border-black rounded-xl overflow-hidden">
                <div
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  필터
                </div>
              </div>
            </div> */}
          </div>

          {/* 태그 검색 */}
          <div className="flex justify-between items-center px-10 mb-5">
            <p className="font-semibold">태그 검색</p>
            {/* 검색 모드 - 추후 구현 예정 */}
            {/* <div className="flex gap-3 items-center">
              <p>검색 모드</p>
              <div className="flex border border-black rounded-xl divide-x divide-black overflow-hidden">
                <div
                  className={`px-4 py-2 cursor-pointer transition-colors ${searchMode === "and"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                    }`}
                  onClick={() => setSearchMode("and")}
                >
                  AND
                </div>
                <div
                  className={`px-4 py-2 cursor-pointer transition-colors ${searchMode === "or"
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                    }`}
                  onClick={() => setSearchMode("or")}
                >
                  OR
                </div>
              </div>
            </div> */}
          </div>

          {/* 태그 입력 */}
          <div className="mx-10 mb-5">
            <input
              className="w-full h-[50px] px-4 border rounded-xl bg-gray-100 outline-none focus:bg-white focus:border-blue-500"
              placeholder="태그를 입력하세요..."
            />
          </div>

          {/* 인기 태그 */}
          <div className="mx-10 mb-5">
            <p className="mb-2 font-semibold">인기 태그 :</p>
            <div className="flex gap-2 flex-wrap">
              <div className="border rounded-xl px-3 py-1 hover:bg-gray-100 cursor-pointer">
                훈구문발
              </div>
              <div className="border rounded-xl px-3 py-1 hover:bg-gray-100 cursor-pointer">
                청화백자 매병
              </div>
              <div className="border rounded-xl px-3 py-1 hover:bg-gray-100 cursor-pointer">
                백자 백색
              </div>
              <div className="border rounded-xl px-3 py-1 hover:bg-gray-100 cursor-pointer">
                청화 코발트
              </div>
              <div className="border rounded-xl px-3 py-1 hover:bg-gray-100 cursor-pointer">
                백자토
              </div>
              <div className="border rounded-xl px-3 py-1 hover:bg-gray-100 cursor-pointer">
                조선시대
              </div>
            </div>
          </div>
        </section>

        {/* 구분선 */}
        <div className="mx-10 mb-5 border-t border-gray-300"></div>

        {/* 카드 그리드 */}
        <section className="px-10 py-5">          

          {cards.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              등록된 카드가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-6 gap-6">
              {cards.map((card) => (
                <div
                  key={card.cardId}
                  className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer aspect-[3/4]"
                  onClick={() => navigate(`/feed/${card.cardId}`)}
                  onMouseEnter={() => setHoveredCard(card.cardId)}
                  onMouseLeave={() => {
                    setHoveredCard(null);
                    if (showDeckList === card.cardId) {
                      setShowDeckList(null);
                    }
                  }}
                >
                  {card.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={card.cardName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      이미지 없음
                    </div>
                  )}
                  
                  {/* 호버 오버레이 */}
                  <div 
                    className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 transition-opacity duration-200 ${
                      hoveredCard === card.cardId ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    {/* 카드 정보 */}
                    <div className="flex items-center gap-3 text-white text-sm">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {card.likeCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>#</span>
                        {card.tagCount}
                      </span>
                    </div>

                    {/* 액션 버튼들 */}
                    <div className="flex items-center gap-2 relative">
                      {/* 좋아요 버튼 */}
                      <button
                        onClick={(e) => handleLikeClick(e, card.cardId)}
                        className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>

                      {/* 인벤토리 담기 버튼 */}
                      <button
                        onClick={(e) => handleInventoryClick(e, card)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          isInInventory(card.cardId) 
                            ? "bg-green-600 hover:bg-green-700" 
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {isInInventory(card.cardId) ? (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        )}
                      </button>

                      {/* 덱에 추가 버튼 */}
                      <div className="relative">
                        <button
                          onClick={(e) => handleDeckButtonClick(e, card.cardId)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            showDeckList === card.cardId
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-blue-500 hover:bg-blue-600"
                          }`}
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </button>

                        {/* 덱 리스트 드롭다운 */}
                        {showDeckList === card.cardId && (
                          <div 
                            className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                              <p className="text-xs font-semibold text-gray-600">덱에 추가</p>
                            </div>
                            {decks.length === 0 ? (
                              <div className="px-3 py-4 text-center text-sm text-gray-400">
                                생성된 덱이 없습니다
                              </div>
                            ) : (
                              <div className="max-h-40 overflow-y-auto">
                                {decks.map((deck) => (
                                  <button
                                    key={deck.id}
                                    onClick={(e) => handleAddToDeck(e, deck.id, card.cardId)}
                                    className="w-full px-3 py-2 text-left text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2"
                                  >
                                    <span className="text-base">📚</span>
                                    <span className="truncate">{deck.title}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                            <div className="border-t border-gray-200">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate("/myDeck");
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-blue-500 hover:bg-blue-50 transition-colors flex items-center gap-2"
                              >
                                <span>+</span>
                                <span>새 덱 만들기</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 기본 하단 정보 (호버 아닐 때만 표시) */}
                  <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-200 ${
                    hoveredCard === card.cardId ? "opacity-0" : "opacity-100"
                  }`}>
                    <div className="h-20 bg-gradient-to-t from-black/90 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="font-semibold text-white drop-shadow-lg text-sm truncate">
                        {card.cardName}
                      </p>
                      <div className="flex gap-2 text-white/70 text-xs mt-1">
                        <span>♡ {card.likeCount}</span>
                        <span>👁 {card.viewCount}</span>
                        <span># {card.tagCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 하단 인벤토리 바 - 로그인한 경우에만 표시 */}
      {isAuthenticated && inventory.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="flex items-center h-20 px-6">
            {/* 왼쪽: 토글 버튼 & 카운트 */}
            <div className="flex items-center gap-3 mr-6">
              <button
                onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg 
                  className={`w-5 h-5 text-gray-600 transition-transform ${isInventoryOpen ? "" : "rotate-180"}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <span className="text-sm text-gray-600 font-medium">
                {inventory.length}개
              </span>
            </div>

            {/* 중앙: 카드 썸네일 리스트 */}
            <div className="flex-1 flex items-center gap-2 overflow-x-auto py-2">
              {inventory.map((card) => (
                <div 
                  key={card.cardId} 
                  className="relative flex-shrink-0 group"
                >
                  <div 
                    className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-green-500 transition-colors"
                    onClick={() => navigate(`/feed/${card.cardId}`)}
                  >
                    {card.imageUrl ? (
                      <img
                        src={card.imageUrl}
                        alt={card.cardName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        🖼
                      </div>
                    )}
                  </div>
                  {/* 삭제 버튼 */}
                  <button
                    onClick={() => handleRemoveFromInventory(card.cardId)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* 오른쪽: 액션 버튼들 */}
            <div className="flex items-center gap-2 ml-6">
              <button 
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors"
                title="저장"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 로그인 필요 모달 */}
      <AlarmModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={() => navigate("/login")}
        title="로그인 필요"
        content="이 기능을 사용하려면 로그인이 필요합니다."
        type="confirm"
        confirmText="로그인"
        cancelText="취소"
      />
    </div>
  );
}

export default Feed;