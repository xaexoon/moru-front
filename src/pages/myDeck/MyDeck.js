import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as NewIcon } from "../../assets/dataFields/new.svg";

import { useGetAllDecks, useCreateDeck, useDeleteDeck } from "../../hooks/useApi";
import AlarmModal from "../../components/AlarmModal";

function MyDeck() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState("");
  const [newDeckDescription, setNewDeckDescription] = useState("");

  // 알림 모달 상태
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    content: "",
    type: "alarm",
    onConfirm: null,
  });

  // 덱 목록 조회
  const { data: decksData, isLoading, refetch } = useGetAllDecks();
  const decks = decksData?.data?.data || [];
  const totalDecks = decks.length;

  // 덱 생성
  const { mutate: createDeck, isPending: isCreating } = useCreateDeck();

  // 덱 삭제
  const { mutate: deleteDeck, isPending: isDeleting } = useDeleteDeck();

  // 검색 필터링
  const filteredDecks = decks.filter((deck) =>
    deck.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 모달 열기 헬퍼 함수
  const showModal = ({ title, content, type = "alarm", onConfirm = null }) => {
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
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  // 새 덱 만들기
  const handleCreateDeck = () => {
    if (!newDeckName.trim()) {
      showModal({
        title: "입력 오류",
        content: "덱 이름을 입력해주세요.",
      });
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
          setIsCreateModalOpen(false);
          setNewDeckName("");
          setNewDeckDescription("");
          refetch();
          showModal({
            title: "생성 완료",
            content: "덱이 성공적으로 생성되었습니다!",
          });
        },
        onError: (err) => {
          showModal({
            title: "생성 실패",
            content: err.response?.data?.message || err.message,
          });
        },
      }
    );
  };

  // 덱 삭제 확인 모달 열기
  const handleDeleteClick = (e, deckId, deckName) => {
    e.stopPropagation();
    showModal({
      title: "덱 삭제",
      content: `"${deckName}" 덱을 정말 삭제하시겠습니까?\n삭제된 덱은 복구할 수 없습니다.`,
      type: "confirm",
      onConfirm: () => handleDeleteConfirm(deckId),
    });
  };

  // 덱 삭제 실행
  const handleDeleteConfirm = (deckId) => {
    deleteDeck(deckId, {
      onSuccess: () => {
        refetch();
        showModal({
          title: "삭제 완료",
          content: "덱이 성공적으로 삭제되었습니다.",
        });
      },
      onError: (err) => {
        showModal({
          title: "삭제 실패",
          content: err.response?.data?.message || err.message,
        });
      },
    });
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">덱을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-[2400px] mx-auto px-10 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">내 덱</h1>
          <p className="text-sm text-gray-500">
            카드들을 모아 덱을 만들고 다른 사용자와 공유해보세요. 총 {totalDecks}개
          </p>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center gap-4 mb-6">
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
              placeholder="덱 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* 새 덱 만들기 버튼 */}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-[42px] px-4 text-sm rounded-lg bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <NewIcon className="w-4 text-white" />
            <span>새 덱 만들기</span>
          </button>
        </div>

        {/* 덱 목록 */}
        {filteredDecks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">
              {searchTerm ? "검색 결과가 없습니다" : "덱이 없습니다"}
            </p>
            <p className="text-gray-400 text-sm">
              {searchTerm ? "다른 검색어를 입력해보세요." : "새 덱을 만들어보세요!"}
            </p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
            {filteredDecks.map((deck) => (
              <div
                key={deck.id}
                className="break-inside-avoid group cursor-pointer"
                onClick={() => navigate(`/deck/${deck.id}`)}
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-100 transition-shadow hover:shadow-lg">
                  {/* 덱 썸네일 */}
                  <div className="w-full aspect-[3/4] bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-6xl">📚</span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* 삭제 버튼 */}
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={(e) => handleDeleteClick(e, deck.id, deck.title)}
                      disabled={isDeleting}
                      className="text-xs px-2 py-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:bg-gray-400"
                    >
                      삭제
                    </button>
                  </div>

                  {/* 덱 정보 */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-sm font-medium mb-1 truncate">{deck.title}</h3>
                    <div className="flex items-center gap-3 text-white/80 text-xs">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        카드 {deck.cardIds?.length || 0}개
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                        deck.status === 'PUBLIC' 
                          ? 'bg-green-500/80 text-white' 
                          : 'bg-gray-500/80 text-white'
                      }`}>
                        {deck.status === 'PUBLIC' ? '공개' : '비공개'}
                      </span>
                    </div>
                  </div>
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

export default MyDeck;