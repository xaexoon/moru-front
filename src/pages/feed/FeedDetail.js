import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cardImage from "../../assets/feed/feed_card_1.png";

function FeedDetail() {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAttributeOpen, setIsAttributeOpen] = useState(true);

  // 임시 데이터
  const cardData = {
    image: cardImage,
    attributes: [
      { label: "이름", value: "단단한제비" },
      { label: "작성자", value: "단단한제비" },
      { label: "내용", value: "카드" },
      { label: "특징", value: "카드 테스트" },
      { label: "연도", value: "2025" },
    ],
    relatedTags: [
      "코발트 블루",
      "빗살 무늬",
      "흙",
      "토기",
      "조선시대",
      "2025",
      "카드",
      "테스트",
      "데모",
    ],
  };

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
          <div className="flex flex-col gap-4 w-[280px] shrink-0">
            {/* 카드 이미지 */}
            <div className="relative">
              {/* 좋아요/저장 버튼 */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow hover:scale-110 transition-transform
                    ${isLiked ? "text-red-500" : "text-gray-400"}`}
                >
                  ♥
                </button>
                <button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow hover:scale-110 transition-transform
                    ${isBookmarked ? "text-yellow-500" : "text-gray-400"}`}
                >
                  ⚑
                </button>
              </div>

              {cardData.image ? (
                <img
                  src={cardData.image}
                  alt="카드 이미지"
                  className="w-full rounded-xl shadow-lg"
                />
              ) : (
                <div className="w-full aspect-[3/4] bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                  이미지 없음
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
                  {cardData.attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="flex border-b border-[#ededed] last:border-b-0"
                    >
                      <div className="w-32 px-4 py-3 bg-[#1a1a1a] text-white text-sm font-medium">
                        {attr.label}
                      </div>
                      <div className="flex-1 px-4 py-3 text-sm text-gray-600">
                        {attr.value}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 관련 태그 섹션 */}
            <div>
              {cardData.relatedTags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-3 border-b border-[#ededed]"
                >
                  <span className="px-3 py-1 bg-[#1a1a1a] text-white text-xs rounded-full flex items-center gap-1">
                    <span className="text-green-400">?</span>
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedDetail;