import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCard, useDeleteCard } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import AlarmModal from "../../components/AlarmModal";

function MyCardDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAttributeOpen, setIsAttributeOpen] = useState(true);

  // 모달 상태
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    content: "",
    type: "alarm",
    onConfirm: null,
  });

  const { mutate: deleteCard, isPending: isDeleting } = useDeleteCard();

  // API에서 카드 상세 데이터 가져오기
  const { data, isLoading, isError, error } = useGetCard(id, {
    enabled: isAuthenticated && !!id,
  });

  const cardData = data?.data?.data;

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

  // 카드 수정 핸들러
  const handleEditCard = () => {
    navigate(`/createCard?edit=${id}`);
  };

  // 카드 삭제 핸들러 - 확인 모달 열기
  const handleDeleteCard = () => {
    showModal({
      title: "카드 삭제",
      content: `"${cardData?.cardName}" 카드를 정말 삭제하시겠습니까?\n삭제된 카드는 복구할 수 없습니다.`,
      type: "confirm",
      onConfirm: handleDeleteConfirm,
    });
  };

  // 삭제 실행
  const handleDeleteConfirm = () => {
    deleteCard(id, {
      onSuccess: () => {
        showModal({
          title: "삭제 완료",
          content: "카드가 성공적으로 삭제되었습니다.",
          type: "alarm",
          onConfirm: () => navigate("/myCard"),
        });
      },
      onError: (error) => {
        console.error("카드 삭제 실패:", error);
        showModal({
          title: "삭제 실패",
          content: error.response?.data?.message || "카드 삭제에 실패했습니다.",
          type: "alarm",
        });
      },
    });
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
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">카드 정보 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-500">에러 발생: {error.message}</p>
        <button
          onClick={() => navigate("/myCard")}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 데이터 없음
  if (!cardData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">카드를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/myCard")}
          className="px-4 py-2 bg-black text-white rounded-lg"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between h-[60px] px-10 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>돌아가기</span>
        </button>
        <div className="flex items-center gap-3">
          {/* 삭제 버튼 */}
          <button
            onClick={handleDeleteCard}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>{isDeleting ? "삭제 중..." : "삭제"}</span>
          </button>
          {/* 공유 버튼 */}
          {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>공유</span>
          </button> */}
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-[1200px] mx-auto px-10 py-8">
        <div className="flex gap-12">
          {/* 왼쪽: 카드 이미지 */}
          <div className="flex flex-col gap-4 w-[380px] shrink-0">
            {/* 카드 이미지 */}
            <div className="relative">
              {/* 좋아요/저장 버튼 */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md hover:scale-110 transition-transform ${
                    isLiked ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md hover:scale-110 transition-transform ${
                    isBookmarked ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  <svg className="w-5 h-5" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>

              {/* 공개/비공개 뱃지 */}
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  cardData.status === "PUBLIC"
                    ? "bg-green-500 text-white"
                    : "bg-gray-500 text-white"
                }`}>
                  {cardData.status === "PUBLIC" ? "공개" : "비공개"}
                </span>
              </div>

              {cardData.imageUrl ? (
                <div className="relative">
                  <img
                    src={cardData.imageUrl}
                    alt={cardData.cardName}
                    className="w-full aspect-[3/4] object-cover rounded-xl shadow-lg"
                  />
                  {/* 이미지 하단 오버레이 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
                    <p className="text-white font-semibold text-lg">
                      {cardData.cardName}
                    </p>
                    <div className="flex gap-4 text-white/80 text-sm mt-1">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {cardData.likeCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {cardData.viewCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>#</span>
                        {cardData.tagCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-full aspect-[3/4] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400 shadow-lg">
                    이미지 없음
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-xl">
                    <p className="text-white font-semibold text-lg">
                      {cardData.cardName}
                    </p>
                    <div className="flex gap-4 text-white/80 text-sm mt-1">
                      <span>♡ {cardData.likeCount || 0}</span>
                      <span>👁 {cardData.viewCount || 0}</span>
                      <span># {cardData.tagCount || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 속성 및 정보 */}
          <div className="flex-1 min-w-0">
            {/* 속성 섹션 */}
            <div className="mb-8">
              <div
                className="flex items-center justify-between py-3 cursor-pointer border-b border-gray-200"
                onClick={() => setIsAttributeOpen(!isAttributeOpen)}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  <span className="font-medium text-gray-800">속성</span>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform ${isAttributeOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {isAttributeOpen && (
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex border-b border-gray-200">
                    <div className="w-32 px-4 py-3 bg-gray-900 text-white text-sm font-medium">
                      카드명
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm text-gray-700">
                      {cardData.cardName}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200">
                    <div className="w-32 px-4 py-3 bg-gray-900 text-white text-sm font-medium">
                      내용
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm text-gray-700">
                      {cardData.cardContent || "미입력"}
                    </div>
                  </div>
                  <div className="flex border-b border-gray-200">
                    <div className="w-32 px-4 py-3 bg-gray-900 text-white text-sm font-medium">
                      작성자
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm text-gray-700">
                      {cardData.userNickname}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 px-4 py-3 bg-gray-900 text-white text-sm font-medium">
                      상태
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        cardData.status === "PUBLIC"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {cardData.status === "PUBLIC" ? "공개" : "비공개"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 카드 정보 & 생성 정보 */}
            <div className="grid grid-cols-2 gap-8">
              {/* 카드 정보 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">카드 정보</h3>
                <div className="space-y-3">
                  <div className="flex">
                    <span className="w-20 text-gray-500 text-sm">타입:</span>
                    <span className="text-gray-700 text-sm">데이터필드</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 text-gray-500 text-sm">검증:</span>
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                      미검증
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-20 text-gray-500 text-sm">연결:</span>
                    <span className="text-gray-700 text-sm">{cardData.tagCount || 0}개</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 text-gray-500 text-sm">희귀도:</span>
                    <span className="px-2 py-1 border border-gray-300 text-gray-600 text-xs rounded">
                      Common
                    </span>
                  </div>
                </div>
              </div>

              {/* 생성 정보 */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">생성 정보</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700 text-sm">{cardData.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-gray-700 text-sm">{cardData.userNickname}</span>
                  </div>
                  {cardData.updatedAt && (
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-gray-700 text-sm">수정: {cardData.updatedAt}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default MyCardDetail;