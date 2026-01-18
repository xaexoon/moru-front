import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCard, useLikeCard } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import AlarmModal from "../../components/AlarmModal";

function FeedDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAttributeOpen, setIsAttributeOpen] = useState(true);

  // 좋아요 상태 관리 (로컬 스토리지)
  const [likedCards, setLikedCards] = useState(() => {
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

  // API에서 카드 상세 데이터 가져오기
  const { data, isLoading, isError, error } = useGetCard(id, {
    enabled: isAuthenticated && !!id,
  });

  const { mutate: likeCard, isPending: isLiking } = useLikeCard();

  const cardData = data?.data?.data;

  // 좋아요 상태가 변경되면 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem('likedCards', JSON.stringify(likedCards));
  }, [likedCards]);

  // 좋아요 여부 확인
  const isLiked = likedCards.includes(Number(id));

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
  const handleLikeClick = () => {
    likeCard(id, {
      onSuccess: (response) => {
        console.log("좋아요 응답:", response);
        
        // 로컬 상태 토글
        setLikedCards(prev => {
          const cardId = Number(id);
          if (prev.includes(cardId)) {
            return prev.filter(cid => cid !== cardId);
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

  // 인증 로딩 중
  if (authLoading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <p>인증 확인 중...</p>
      </div>
    );
  }

  // 로그인 안 된 경우
  if (!isAuthenticated) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center flex-col gap-4">
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
  if (isLoading) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        <p>카드 정보 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center flex-col gap-4">
        <p className="text-red-500">에러 발생: {error.message}</p>
        <button
          onClick={() => navigate("/feed")}
          className="px-4 py-2 bg-black text-white rounded-xl"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  // 데이터 없음
  if (!cardData) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center flex-col gap-4">
        <p>카드를 찾을 수 없습니다.</p>
        <button
          onClick={() => navigate("/feed")}
          className="px-4 py-2 bg-black text-white rounded-xl"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between h-[60px] px-10 border-b border-[#ededed]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <span>←</span>
          <span>돌아가기</span>
        </button>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#ededed] rounded-lg hover:bg-[#f5f5f5]">
            <span>⚙️</span>
            <span>인벤토리 추가</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#ededed] rounded-lg hover:bg-[#f5f5f5]">
            <span>↓</span>
            <span>내보내기</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#ededed] rounded-lg hover:bg-[#f5f5f5]">
            <span>↗</span>
            <span>공유</span>
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex justify-center px-10 py-8">
        <div className="flex gap-16 w-full max-w-[1200px]">
          {/* 왼쪽: 카드 이미지 */}
          <div className="flex flex-col gap-4 w-[380px] shrink-0">
            {/* 카드 이미지 */}
            <div className="relative">
              {/* 좋아요/저장 버튼 */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <button
                  onClick={handleLikeClick}
                  disabled={isLiking}
                  className={`w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md hover:scale-110 transition-transform disabled:opacity-50 ${
                    isLiked ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isLiked ? "currentColor" : "none"}
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
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-md hover:scale-110 transition-transform ${
                    isBookmarked ? "text-yellow-500" : "text-gray-400"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={isBookmarked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
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
                        <svg
                          className="w-4 h-4"
                          fill={isLiked ? "currentColor" : "none"}
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

            {/* 문화유산포털 버튼 */}
            <button className="w-full py-3 bg-[#27ae60] text-white rounded-lg font-medium hover:bg-[#219a52]">
              문화유산포털
            </button>
          </div>

          {/* 오른쪽: 속성 및 관련 태그 */}
          <div className="flex-1 min-w-0">
            {/* 속성 섹션 */}
            <div className="mb-8">
              <div
                className="flex items-center justify-between py-3 cursor-pointer"
                onClick={() => setIsAttributeOpen(!isAttributeOpen)}
              >
                <div className="flex items-center gap-2">
                  <span>⚙️</span>
                  <span className="font-medium">속성</span>
                </div>
                <span className="text-lg text-gray-400">
                  {isAttributeOpen ? "∧" : "∨"}
                </span>
              </div>

              {isAttributeOpen && (
                <div className="border border-[#ededed] rounded-lg overflow-hidden">
                  <div className="flex border-b border-[#ededed]">
                    <div className="w-32 px-4 py-3 bg-[#1a1a1a] text-white text-sm font-medium">
                      카드명
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm text-gray-600">
                      {cardData.cardName}
                    </div>
                  </div>
                  <div className="flex border-b border-[#ededed]">
                    <div className="w-32 px-4 py-3 bg-[#1a1a1a] text-white text-sm font-medium">
                      내용
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm text-gray-600">
                      {cardData.cardContent || "미입력"}
                    </div>
                  </div>
                  <div className="flex border-b border-[#ededed]">
                    <div className="w-32 px-4 py-3 bg-[#1a1a1a] text-white text-sm font-medium">
                      작성자
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm text-gray-600">
                      {cardData.userNickname}
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-32 px-4 py-3 bg-[#1a1a1a] text-white text-sm font-medium">
                      상태
                    </div>
                    <div className="flex-1 px-4 py-3 text-sm text-gray-600">
                      {cardData.status}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mx-10 border-t border-gray-200"></div>

      {/* 하단: 카드 정보 & 생성 정보 */}
      <div className="flex justify-center px-10 py-8">
        <div className="flex gap-16 w-full max-w-[1200px]">
          {/* 카드 정보 */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-4">카드 정보</h3>
            <div className="space-y-3">
              <div className="flex">
                <span className="w-20 text-gray-500">타입:</span>
                <span className="text-gray-700">데이터필드</span>
              </div>
              <div className="flex items-center">
                <span className="w-20 text-gray-500">검증:</span>
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                  미검증
                </span>
              </div>
              <div className="flex">
                <span className="w-20 text-gray-500">연결:</span>
                <span className="text-gray-700">{cardData.tagCount || 0}개</span>
              </div>
              <div className="flex items-center">
                <span className="w-20 text-gray-500">희귀도:</span>
                <span className="px-2 py-1 border border-gray-300 text-gray-600 text-xs rounded">
                  Common
                </span>
              </div>
            </div>
          </div>

          {/* 생성 정보 */}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-4">생성 정보</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-red-500">📅</span>
                <span className="text-gray-700">{cardData.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">👤</span>
                <span className="text-gray-700">{cardData.userNickname}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 여백 */}
      <div className="h-8 border-t border-gray-200 mx-10"></div>

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

export default FeedDetail;