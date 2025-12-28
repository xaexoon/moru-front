import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as NewIcon } from "../../assets/dataFields/new.svg";
import { ReactComponent as SearchIcon } from "../../assets/myDeck/search.svg";

import { useGetAllDecks, useCreateDeck, useDeleteDeck } from "../../hooks/useApi";

function MyDeck() {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");

  // 덱 목록 조회
  const { data: decksData, isLoading, refetch } = useGetAllDecks();
  const decks = decksData?.data?.data || [];

  // 덱 생성
  const { mutate: createDeck, isPending: isCreating } = useCreateDeck();

  // 덱 삭제
  const { mutate: deleteDeck } = useDeleteDeck();

  // 콘솔 로그
  console.log("=== 덱 목록 ===", decks);

  // 검색 필터링
  const filteredDecks = decks.filter((deck) =>
    deck.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 새 덱 만들기
  const handleCreateDeck = () => {
    if (!newDeckName.trim()) {
      alert("덱 이름을 입력해주세요.");
      return;
    }

    createDeck(
      {
        title: newDeckName,
        content: newDeckDescription,
        status: "PUBLIC",
      },
      {
        onSuccess: () => {
          alert("덱이 생성되었습니다!");
          setIsCreateModalOpen(false);
          setNewDeckName("");
          setNewDeckDescription("");
          refetch();
        },
        onError: (err) => {
          alert("덱 생성 실패: " + (err.response?.data?.message || err.message));
        },
      }
    );
  };

  // 덱 삭제
  const handleDeleteDeck = (deckId, deckName) => {
    if (window.confirm(`"${deckName}" 덱을 삭제하시겠습니까?`)) {
      deleteDeck(deckId, {
        onSuccess: () => {
          alert("덱이 삭제되었습니다.");
          refetch();
        },
        onError: (err) => {
          alert("덱 삭제 실패: " + (err.response?.data?.message || err.message));
        },
      });
    }
  };

  return (
    <div className="w-full min-h-full flex flex-col flex-1 p-6">
      {/* Top Section */}
      <div className="w-full flex flex-col">
        <div className="w-full h-full">
          <p className="py-1 text-xl font-bold mb-2">덱 관리</p>
          <p className="text-sm text-gray-500 mb-6">
            카드들을 모아 덱을 만들고 다른 사용자와 공유해보세요.
          </p>
        </div>

        {/* Menu */}
        <div className="flex items-center w-full">
          <div className="flex-1 max-w-[392px] h-[40px] rounded-lg flex items-center bg-gray-100 focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 mr-3">
            <SearchIcon className="text-gray-500 m-3" />
            <input
              className="w-full h-full border-none bg-transparent focus:outline-none text-sm"
              type="text"
              placeholder="덱 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-[40px] px-4 text-sm rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <NewIcon className="w-4 text-white" />
              <p>새 덱 만들기</p>
            </div>
          </button>
        </div>
      </div>

      {/* 덱 목록 */}
      <div className="w-full mt-6">
        {isLoading ? (
          <div className="text-center py-20 text-gray-400">
            로딩 중...
          </div>
        ) : filteredDecks.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            {searchTerm ? "검색 결과가 없습니다." : "생성된 덱이 없습니다. 새 덱을 만들어보세요!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDecks.map((deck) => (
              <div
                key={deck.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/deck/${deck.id}`)}
              >
                {/* 덱 썸네일 */}
                <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-4xl">📚</span>
                </div>

                {/* 덱 정보 */}
                <h3 className="font-semibold text-gray-800 mb-1 truncate">
                  {deck.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {deck.content || "설명 없음"}
                </p>

                {/* 덱 메타 정보 */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>카드 {deck.cardIds?.length || 0}개</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDeck(deck.id, deck.title);
                    }}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 새 덱 만들기 모달 */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 relative">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2">새 덱 만들기</h2>
            <p className="text-gray-500 text-sm mb-6">
              카드를 모아둘 새로운 덱을 만들어보세요
            </p>

            {/* 덱 이름 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                덱 이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                placeholder="덱 이름을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 덱 설명 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명
              </label>
              <textarea
                value={newDeckDescription}
                onChange={(e) => setNewDeckDescription(e.target.value)}
                placeholder="덱에 대한 설명을 입력하세요 (선택사항)"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                취소
              </button>
              <button
                onClick={handleCreateDeck}
                disabled={isCreating}
                className="flex-1 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isCreating ? "생성 중..." : "만들기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyDeck;