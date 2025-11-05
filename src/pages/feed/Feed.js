function Feed() {
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
              <div className="flex border border-black rounded-xl divide-x divide-black">
                <button className="px-4 py-3 hover:bg-gray-100">그리드</button>
                <button className="px-4 py-3 hover:bg-gray-100">리스트</button>
              </div>
              <div className="flex border border-black rounded-xl divide-x divide-black">
                <button className="px-4 py-3 hover:bg-gray-100">소형</button>
                <button className="px-4 py-3 hover:bg-gray-100">중형</button>
                <button className="px-4 py-3 hover:bg-gray-100">대형</button>
              </div>
              <div className="border border-black rounded-xl">
                <button className="px-4 py-3 hover:bg-gray-100">필터</button>
              </div>
              <div className="border border-black rounded-xl">
                <button className="px-4 py-3 hover:bg-gray-100">새 카드</button>
              </div>
            </div>
          </div>

          {/* 태그 검색 */}
          <div className="flex justify-between items-center px-10 mb-5">
            <p className="font-semibold">태그 검색</p>
            <div className="flex gap-3 items-center">
              <p>검색 모드</p>
              <div className="flex border border-black rounded-xl divide-x divide-black">
                <button className="px-4 py-2 hover:bg-gray-100">AND</button>
                <button className="px-4 py-2 hover:bg-gray-100">OR</button>
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

          {/* 필터 */}
          <div className="mx-10 mb-5 border rounded-xl p-5">
            <div className="grid grid-cols-4 gap-6">
              <div className="flex flex-col">
                <p className="pb-2 font-semibold">정렬</p>
                <select className="bg-gray-100 rounded-xl p-3 border-none outline-none cursor-pointer hover:bg-gray-200">
                  <option>최신순</option>
                  <option>인기순</option>
                  <option>트렌딩</option>
                  <option>랜덤</option>
                </select>
              </div>
              <div className="flex flex-col">
                <p className="pb-2 font-semibold">카드 타입</p>
                <select className="bg-gray-100 rounded-xl p-3 border-none outline-none cursor-pointer hover:bg-gray-200">
                  <option>전체</option>
                  <option>유물</option>
                  <option>색상</option>
                  <option>형태</option>
                  <option>재질</option>
                  <option>문양</option>
                  <option>기법</option>
                  <option>시대</option>
                  <option>지역</option>
                </select>
              </div>
              <div className="flex flex-col">
                <p className="pb-2 font-semibold">시대</p>
                <select className="bg-gray-100 rounded-xl p-3 border-none outline-none cursor-pointer hover:bg-gray-200">
                  <option>전체</option>
                  <option>선사시대</option>
                  <option>삼국시대</option>
                  <option>통일신라</option>
                  <option>고려</option>
                  <option>조선</option>
                  <option>근현대</option>
                </select>
              </div>
              <div className="flex flex-col">
                <p className="pb-2 font-semibold">지역</p>
                <select className="bg-gray-100 rounded-xl p-3 border-none outline-none cursor-pointer hover:bg-gray-200">
                  <option>전체</option>
                  <option>서울</option>
                  <option>경기</option>
                  <option>부산</option>
                  <option>대구</option>
                  <option>인천</option>
                  <option>광주</option>
                  <option>대전</option>
                  <option>울산</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* 카드 그리드 */}
        <section className="px-10 py-5">
          <div className="grid grid-cols-3 gap-6">
            {/* 카드 컴포넌트 */}
            {["청화 코발트", "백자토", "훈구문", "청자"].map((title, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer h-80"
              >
                <img
                  src=""
                  alt={title}
                  className="w-full h-full object-cover bg-gray-200"
                />
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="font-semibold text-white drop-shadow-lg">
                    {title}
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
