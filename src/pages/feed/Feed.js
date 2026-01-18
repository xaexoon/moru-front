import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCards, useGetAllDecks, useAddCardToDeck, useLikeCard } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import { useInventory } from "../../context/InventoryContext";
import AlarmModal from "../../components/AlarmModal";

function Feed() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { inventory, toggleInventory, isInInventory, removeFromInventory } = useInventory();

  const [hoveredCard, setHoveredCard] = useState(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(true);
  const [showDeckList, setShowDeckList] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 좋아요 상태 관리 (로그인한 경우에만 로컬 스토리지 사용)
  const [likedCards, setLikedCards] = useState(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('likedCards');
    return saved ? JSON.parse(saved) : [];
  });

  // 모달 상태
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    content: '',
    type: 'alarm',
    onConfirm: null,
  });

  // 카드 조회 - 로그인 없이도 가능
  const { data, isLoading, isError, error } = useGetCards();
  
  // 덱 조회 - 로그인한 경우에만 호출
  const { data: decksData } = useGetAllDecks({ 
    enabled: isAuthenticated  // 로그인 시에만 API 호출
  });
  
  // 좋아요 - 로그인한 경우에만 사용
  const { mutate: likeCard, isPending: isLiking } = useLikeCard();
  
  // 덱에 카드 추가 - 로그인한 경우에만 사용
  const { mutate: addCardToDeck } = useAddCardToDeck();

  const cards = data?.data?.data || [];
  const decks = decksData?.data?.data || [];

  // 좋아요 상태가 변경되면 로컬 스토리지에 저장 (로그인한 경우에만)
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('likedCards', JSON.stringify(likedCards));
    }
  }, [likedCards, isAuthenticated]);

  // 로그인 상태 변경 시 좋아요 상태 로드
  useEffect(() => {
    if (isAuthenticated) {
      const saved = localStorage.getItem('likedCards');
      setLikedCards(saved ? JSON.parse(saved) : []);
    } else {
      setLikedCards([]);
    }
  }, [isAuthenticated]);

  const filteredCards = cards.filter(card =>
    card.cardName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 좋아요 여부 확인
  const isLikedCard = (cardId) => {
    return likedCards.includes(cardId);
  };

  // 모달 열기 헬퍼 함수
  const showModal = ({ title, content, type = 'alarm', onConfirm = null }) => {
    setModal({
      isOpen: true,
      title,
      content,
      type,
      onConfirm,
    });
  };

  // 모달 닫기
  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // 좋아요 클릭 핸들러
  const handleLikeClick = (e, cardId) => {
    e.stopPropagation();

    // 로그인 체크
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    likeCard(cardId, {
      onSuccess: (response) => {
        console.log("좋아요 응답:", response);
        
        setLikedCards(prev => {
          if (prev.includes(cardId)) {
            return prev.filter(id => id !== cardId);
          } else {
            return [...prev, cardId];
          }
        });
      },
      onError: (err) => {
        showModal({
          title: '오류',
          content: err.response?.data?.message || '좋아요 처리 중 오류가 발생했습니다.',
        });
      },
    });
  };

  const handleInventoryClick = (card) => {
    // 로그인 체크
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    toggleInventory(card);
  };

  const handleDeckButtonClick = (cardId) => {
    // 로그인 체크
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowDeckList(showDeckList === cardId ? null : cardId);
  };

  const handleAddToDeck = (deckId, cardId) => {
    addCardToDeck(
      { deckId, cardIds: [cardId] },
      {
        onSuccess: () => {
          showModal({
            title: '추가 완료',
            content: '덱에 카드가 추가되었습니다!',
          });
          setShowDeckList(null);
        },
        onError: (err) => {
          showModal({
            title: '추가 실패',
            content: err.response?.data?.message || err.message,
          });
        },
      }
    );
  };

  // 카드 상세 페이지 이동 - 로그인 체크 추가
  const handleCardClick = (cardId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    navigate(`/feed/${cardId}`);
  };

  // 마우스 오버 핸들러 (로그인한 경우에만 동작)
  const handleMouseEnter = (cardId) => {
    if (isAuthenticated) {
      setHoveredCard(cardId);
    }
  };

  const handleMouseLeave = () => {
    if (isAuthenticated) {
      setHoveredCard(null);
      if (showDeckList) {
        setShowDeckList(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">카드를 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500">에러 발생: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-[2400px] mx-auto px-10 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">한국적 디자인 카드 아카이브</h1>
          <p className="text-sm text-gray-500">태그와 카드로 연결된 위키트리 지식 네트워크</p>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4 mb-6">
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
              placeholder="카드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Card Grid */}
        {filteredCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">카드가 없습니다</p>
            <p className="text-gray-400 text-sm">등록된 카드가 없습니다.</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
            {filteredCards.map((card) => (
              <div
                key={card.cardId}
                className="break-inside-avoid group cursor-pointer"
                onMouseEnter={() => handleMouseEnter(card.cardId)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  {/* 이미지 영역 */}
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

                  {/* 호버 오버레이 - 로그인한 경우에만 표시 */}
                  {isAuthenticated && hoveredCard === card.cardId && (
                    <div
                      className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3 cursor-pointer"
                      onClick={() => handleCardClick(card.cardId)}
                    >
                      {/* 카드 정보 */}
                      <div className="flex items-center gap-3 text-white text-sm pointer-events-none">
                        <span className="flex items-center gap-1">
                          <svg 
                            className="w-4 h-4" 
                            fill={isLikedCard(card.cardId) ? "currentColor" : "none"} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          {card.likeCount || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <span>#</span>
                          {card.tagCount || 0}
                        </span>
                      </div>

                      {/* 액션 버튼들 */}
                      <div
                        className="flex items-center gap-2 relative pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* 좋아요 버튼 */}
                        <button
                          onClick={(e) => handleLikeClick(e, card.cardId)}
                          disabled={isLiking}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${
                            isLikedCard(card.cardId)
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-white/20 hover:bg-red-500"
                          }`}
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            fill={isLikedCard(card.cardId) ? "currentColor" : "none"}
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>

                        {/* 인벤토리 버튼 */}
                        <button
                          onClick={() => handleInventoryClick(card)}
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

                        {/* 덱 추가 버튼 */}
                        <div className="relative">
                          <button
                            onClick={() => handleDeckButtonClick(card.cardId)}
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

                          {showDeckList === card.cardId && (
                            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-10">
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
                                      onClick={() => handleAddToDeck(deck.id, card.cardId)}
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
                                  onClick={() => navigate("/myDeck")}
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
                  )}

                  {/* 기본 하단 정보 - 항상 표시 (호버 오버레이가 없을 때) */}
                  {!(isAuthenticated && hoveredCard === card.cardId) && (
                    <div
                      className="absolute inset-0 cursor-pointer"
                      onClick={() => handleCardClick(card.cardId)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-white text-sm font-medium mb-1">{card.cardName}</h3>
                        <div className="flex items-center gap-3 text-white/80 text-xs">
                          <span className="flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill={isLikedCard(card.cardId) ? "currentColor" : "none"}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
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
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 인벤토리 바 - 로그인한 경우에만 표시 */}
      {isAuthenticated && inventory.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
          <div className="max-w-[2400px] mx-auto flex items-center h-20 px-10">
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
              <span className="text-sm text-gray-600 font-medium">{inventory.length}개</span>
            </div>

            <div className="flex-1 flex items-center gap-2 overflow-x-auto py-2">
              {inventory.map((card) => (
                <div key={card.cardId} className="relative flex-shrink-0 group">
                  <div
                    className="w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-green-500 transition-colors"
                    onClick={() => navigate(`/feed/${card.cardId}`)}
                  >
                    {card.imageUrl ? (
                      <img src={card.imageUrl} alt={card.cardName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">🖼</div>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromInventory(card.cardId)}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 ml-6">
              <button
                onClick={() => navigate("/inventory")}
                className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                인벤토리로 이동
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

      {/* 알림 모달 */}
      <AlarmModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
        title={modal.title}
        content={modal.content}
        type={modal.type}
      />
    </div>
  );
}

export default Feed;