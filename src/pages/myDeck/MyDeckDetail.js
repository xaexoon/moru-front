import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetDeck, useGetCards, useGetMyCards } from "../../hooks/useApi";
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

  // 전체 공개 카드 목록 조회
  const { data: publicCardsData, isLoading: publicCardsLoading } = useGetCards({
    enabled: isAuthenticated,
  });

  // 내 카드 목록 조회
  const { data: myCardsData, isLoading: myCardsLoading } = useGetMyCards({
    enabled: isAuthenticated,
  });

  const deck = deckData?.data?.data;
  const publicCards = publicCardsData?.data?.data || [];
  const myCards = myCardsData?.data?.data || [];

  // 공개 카드 + 내 카드 합치기 (중복 제거)
  const allCards = [
    ...publicCards,
    ...myCards.filter(
      (myCard) => !publicCards.some((pc) => pc.cardId === myCard.cardId)
    ),
  ];

  // 덱에 포함된 카드만 필터링
  const deckCards = allCards.filter((card) =>
    deck?.cardIds?.map(Number).includes(Number(card.cardId))
  );

  // 디버깅 로그
  console.log("=== 덱 cardIds ===", deck?.cardIds);
  console.log("=== 공개 카드 수 ===", publicCards.length);
  console.log("=== 내 카드 수 ===", myCards.length);
  console.log("=== 합친 카드 수 ===", allCards.length);
  console.log("=== 덱에 포함된 카드 ===", deckCards);

  // 덱에서 카드 제거 핸들러
  const handleRemoveCard = (cardId) => {
    if (window.confirm("이 카드를 덱에서 제거하시겠습니까?")) {
      console.log(`카드 ${cardId}를 덱에서 제거`);
      alert("카드가 덱에서 제거되었습니다.");
    }
  };

  // 인증 로딩 중
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">인증 확인 중...</p>
      </div>
    );
  }

  // 로그인 안 된 경우
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">로그인이 필요합니다.</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          로그인하기
        </button>
      </div>
    );
  }

  // 데이터 로딩 중
  if (deckLoading || publicCardsLoading || myCardsLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  // 덱이 없는 경우
  if (!deck) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">덱을 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/myDeck")}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          덱 목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-[2400px] mx-auto px-10 py-8">
        {/* 헤더 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span
              className="hover:text-gray-600 cursor-pointer"
              onClick={() => navigate("/myDeck")}
            >
              내 덱
            </span>
            <span>/</span>
            <span className="text-gray-600">{deck.title}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{deck.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                {deck.content || "설명 없음"} · 카드 {deckCards.length}개
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* 뷰 모드 토글 */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden text-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${
                    viewMode === "grid"
                      ? "bg-black text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  그리드
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${
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
                onClick={() => navigate("/myDeck")}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                ← 목록
              </button>
            </div>
          </div>
        </div>

        {/* 카드 목록 */}
        {deckCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">이 덱에 담긴 카드가 없습니다</p>
            <p className="text-gray-400 text-sm mb-4">피드에서 카드를 추가해보세요</p>
            <button
              onClick={() => navigate("/feed")}
              className="px-6 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              카드 추가하러 가기
            </button>
          </div>
        ) : viewMode === "grid" ? (
          // 그리드 뷰
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
            {deckCards.map((card) => (
              <div
                key={card.cardId}
                className="break-inside-avoid group cursor-pointer"
                onClick={() => navigate(`/feed/${card.cardId}`)}
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-100 transition-shadow hover:shadow-lg">
                  {/* 카드 이미지 */}
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

                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCard(card.cardId);
                    }}
                    className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    제거
                  </button>

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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // 리스트 뷰
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
              <tbody className="divide-y divide-gray-100">
                {deckCards.map((card) => (
                  <tr key={card.cardId} className="hover:bg-gray-50 transition-colors">
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
    </div>
  );
}

export default MyDeckDetail;