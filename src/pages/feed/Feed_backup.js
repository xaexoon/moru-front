import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCards } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import gridIcon from "./../../assets/feed/grid.svg";
import listIcon from "./../../assets/feed/list.svg";
import feedCard1 from "./../../assets/feed/feed_card_1.png";
import feedCard2 from "./../../assets/feed/feed_card_2.png";

function Feed() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [viewMode, setViewMode] = useState("grid");
  const [cardSize, setCardSize] = useState("medium");
  const [searchMode, setSearchMode] = useState("and");
  const [showFilter, setShowFilter] = useState(true);

  // API에서 카드 데이터 가져오기
  const { data, isLoading, isError, error } = useGetCards({
    enabled: isAuthenticated,
  });

  // 콘솔로그로 응답 데이터 확인
  console.log("=== 인증 로딩 ===", authLoading);
  console.log("=== 인증 상태 ===", isAuthenticated);
  console.log("=== 데이터 로딩 ===", isLoading);
  console.log("=== 에러 여부 ===", isError);
  console.log("=== API 응답 전체 ===", data);
  console.log("=== data.data ===", data?.data);
  console.log("=== data.data.data ===", data?.data?.data);
  
  if (isError) {
    console.log("=== 에러 상세 ===", error);
  }

  // 임시 카드 데이터 (기존 유지)
  const cards = [
    { id: 1, title: "청화 코발트", image: feedCard1 },
    { id: 2, title: "백자토", image: feedCard2 },
    { id: 3, title: "훈구문", image: null },
    { id: 4, title: "청자", image: null },
  ];

  return (
    <div className="w-full min-h-full bg-white">
      <main>
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

            {/* 버튼 그룹 */}
            <div className="flex gap-3 items-center">
              {/* 그리드/리스트 */}
              <div className="flex border border-black rounded-xl divide-x divide-black overflow-hidden">
                <div
                  className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-2 ${
                    viewMode === "grid"
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
                  className={`px-4 py-3 cursor-pointer transition-colors flex items-center gap-2 ${
                    viewMode === "list"
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

              {/* 소형/중형/대형 */}
              <div className="flex border border-black rounded-xl divide-x divide-black overflow-hidden">
                <div
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    cardSize === "small"
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setCardSize("small")}
                >
                  소형
                </div>
                <div
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    cardSize === "medium"
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setCardSize("medium")}
                >
                  중형
                </div>
                <div
                  className={`px-4 py-3 cursor-pointer transition-colors ${
                    cardSize === "large"
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setCardSize("large")}
                >
                  대형
                </div>
              </div>

              {/* 필터 */}
              <div className="border border-black rounded-xl overflow-hidden">
                <div
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  필터
                </div>
              </div>

              {/* 새 카드 */}
              <div className="border border-black rounded-xl overflow-hidden">
                <div className="px-4 py-3 bg-black text-white cursor-pointer hover:bg-gray-800">
                  새 카드
                </div>
              </div>
            </div>
          </div>

          {/* 태그 검색 */}
          <div className="flex justify-between items-center px-10 mb-5">
            <p className="font-semibold">태그 검색</p>
            <div className="flex gap-3 items-center">
              <p>검색 모드</p>
              <div className="flex border border-black rounded-xl divide-x divide-black overflow-hidden">
                <div
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    searchMode === "and"
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSearchMode("and")}
                >
                  AND
                </div>
                <div
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    searchMode === "or"
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSearchMode("or")}
                >
                  OR
                </div>
              </div>
            </div>
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

        {/* 카드 그리드 (기존 임시 데이터 사용) */}
        <section className="px-10 py-5">
          <div className="grid grid-cols-3 gap-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-80"
                onClick={() => navigate(`/feed/${card.id}`)}
              >
                {card.image ? (
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    이미지 없음
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-semibold text-white drop-shadow-lg">
                    {card.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Feed;