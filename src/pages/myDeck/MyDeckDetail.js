import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDeck, useGetCards } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";

function MyDeckDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [viewMode, setViewMode] = useState("grid");

  // 덱 정보 조회
  const { data: deckData, isLoading: deckLoading } = useGetDeck(id, {
    enabled: isAuthenticated && !!id,
  });

  // 전체 카드 목록 조회
  const { data: cardsData, isLoading: cardsLoading } = useGetCards({
    enabled: isAuthenticated,
  });

  const deck = deckData?.data?.data;
  const allCards = cardsData?.data?.data || [];

  // 덱에 포함된 카드만 필터링
  const deckCards = allCards.filter((card) =>
    deck?.cardIds?.includes(card.cardId)
  );

  console.log("=== 덱 정보 ===", deck);
  console.log("=== 덱에 포함된 카드 ===", deckCards);

  // 덱에서 카드 제거 핸들러
  const handleRemoveCard = (cardId) => {
    if (window.confirm("이 카드를 덱에서 제거하시겠습니까?")) {
      console.log(`카드 ${cardId}를 덱에서 제거`);
      // TODO: 덱에서 카드 제거 API 호출
      alert("카드가 덱에서 제거되었습니다.");
    }
  };

  // 인증 로딩 중
  if (authLoading) {
    return (
      <div className="w-full min-h-full flex items-center justify-center">
        <p>인증 확인 중...</p>
      </div>
    );
  }

  // 로그인 안 된 경우
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-full flex items-center justify-center flex-col gap-4">
        <p>로그인이 필요합니다.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-black text-white rounded-xl"
        >
          로그인하기
        </button>
      </div>
    );
  }

  // 데이터 로딩 중
  if (deckLoading || cardsLoading) {
    return (
      <div className="w-full min-h-full flex items-center justify-center">
        <p>불러오는 중...</p>
      </div>
    );
  }

  // 덱이 없는 경우
  if (!deck) {
    return (
      <div className="w-full min-h-full flex items-center justify-center flex-col gap-4">
        <p className="text-gray-500">덱을 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/deck")}
          className="px-4 py-2 bg-black text-white rounded-xl"
        >
          덱 목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full flex flex-col p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span 
            className="hover:text-gray-600 cursor-pointer"
            onClick={() => navigate("/deck")}
          >
            내 덱
          </span>
          <span>/</span>
          <span className="text-gray-600">{deck.title}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{deck.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {deck.content || "설명 없음"} · 카드 {deckCards.length}개
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* 뷰 모드 토글 */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden text-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 ${
                  viewMode === "grid"
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                그리드
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 ${
                  viewMode === "list"
                    ? "bg-black text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                리스트
              </button>
            </div>

            {/* 뒤로가기 */}
            <button
              onClick={() => navigate("/deck")}
              className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              ← 목록
            </button>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200 mb-6"></div>

      {/* 카드 목록 */}
      {deckCards.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500 mb-4">이 덱에 담긴 카드가 없습니다.</p>
          <button
            onClick={() => navigate("/feed")}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            카드 추가하러 가기
          </button>
        </div>
      ) : viewMode === "grid" ? (
        // 그리드 뷰
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {deckCards.map((card) => (
            <div
              key={card.cardId}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow group cursor-pointer"
              onClick={() => navigate(`/feed/${card.cardId}`)}
            >
              {/* 카드 이미지 */}
              <div className="aspect-[3/4] relative">
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.cardName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    이미지 없음
                  </div>
                )}
                
                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCard(card.cardId);
                    }}
                    className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                  >
                    덱에서 제거
                  </button>
                </div>
              </div>

              {/* 카드 정보 */}
              <div className="p-3 border-t border-gray-100">
                <p className="font-medium text-gray-800 truncate text-sm">
                  {card.cardName}
                </p>
                <div className="flex gap-3 text-xs text-gray-400 mt-1">
                  <span>♡ {card.likeCount || 0}</span>
                  <span>👁 {card.viewCount || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 리스트 뷰
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">이미지</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">카드 이름</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">좋아요</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">조회수</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {deckCards.map((card) => (
                <tr 
                  key={card.cardId} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div 
                      className="w-12 h-16 rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/feed/${card.cardId}`)}
                    >
                      {card.imageUrl ? (
                        <img
                          src={card.imageUrl}
                          alt={card.cardName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
                          🖼
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p 
                      className="font-medium text-gray-800 cursor-pointer hover:text-blue-500"
                      onClick={() => navigate(`/feed/${card.cardId}`)}
                    >
                      {card.cardName}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500">
                    {card.likeCount || 0}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500">
                    {card.viewCount || 0}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleRemoveCard(card.cardId)}
                      className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      제거
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MyDeckDetail;