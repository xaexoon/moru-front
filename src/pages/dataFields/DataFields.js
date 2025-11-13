import { useState } from "react";

const dataFieldOptions = [
  {
    title: "유물/작품",
    attributes: 4,
    connections: 4,
    description: "전시품, 유물, 예술작품 등의 정보를 관리합니다.",
    type: "기본",
  },
  {
    title: "색상",
    attributes: 3,
    connections: 1,
    description: "색상 정보와 색채 관련 데이터를 관리합니다.",
    type: "기본",
  },
  {
    title: "재질",
    attributes: 3,
    connections: 1,
    description: "재료와 소재 정보를 관리합니다.",
    type: "기본",
  },
];

const DATA_FIELD_TAB = [
  { title: "비종속 데이터 (속성 블록)", id: "attribute" },
  { title: "종속 데이터 (연결 블록)", id: "connect" },
];

function DataFields() {
  const [currentDataField, setCurrentDataField] = useState({});
  const [activeTab, setActiveTab] = useState(DATA_FIELD_TAB[0]);

  return (
    <div className="w-full min-h-full flex">
      {/* Left Section */}
      <div className="w-[280px] min-h-full flex flex-col border-r border-gray-200">
        <div className="w-full h-[130px] border-b border-gray-200 flex flex-col p-5">
          <div className="mb-0">데이터 필드 관리</div>
          <div className="text-xs text-gray-500 mb-4">
            카드 데이터 구조를 커스터마이징하세요
          </div>
          <div className="w-full flex items-center justify-center">
            <button className="w-[237px] h-[32px] bg-black text-white rounded-lg text-sm">
              + 새 데이터 필드
            </button>
          </div>
        </div>
        {/*Data Field Option*/}
        <div className="flex flex-col p-3">
          <div className="text-sm mb-3">데이터 필드 목록</div>
          {dataFieldOptions.map((option, index) => {
            return (
              <div
                className="w-[250px] h-[70px] border border-gray-200 rounded-lg mb-2 p-2 text-xs"
                key={`option_${option.title}`}
                onClick={() => {
                  setCurrentDataField(option);
                  console.log("current data field", currentDataField);
                }}
              >
                <div className="w-full flex justify-between">
                  <div className="flex flex-col">
                    <div key={`option.title_${option.title}`}>
                      {option.title}
                    </div>
                    <div
                      className="text-[11px] text-gray-500"
                      key={`option.attributes_${option.connections}`}
                    >
                      {option.attributes}개 속성, {option.connections}개 연결
                    </div>
                  </div>
                  <div
                    className="w-[35px] h-[20px] m-1 bg-gray-200 rounded-lg text-center"
                    key={`option.type_${option.type}`}
                  >
                    {option.type}
                  </div>
                </div>

                <div
                  className="text-[11px] text-gray-500"
                  key={`option.description_${option.description}`}
                >
                  {option.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex-1 min-h-full">
        {currentDataField?.title && (
          <div>
            {/* Middle Top Section */}
            <div className="w-full h-[175px] border-b border-gray-200 flex flex-col p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <label for="fieldTitle" className="text-sm">
                    필드 이름
                  </label>
                  <div className="flex-1 max-w-[392px] h-[31px] rounded-lg flex items-center bg-gray-100 focus-within:outline focus-within:outline-3 focus-within:outline-gray-300">
                    <input
                      className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2"
                      type="text"
                      id="fieldTitle"
                      value={currentDataField.title}
                    />
                  </div>
                </div>

                <div className="m-2">
                  <button className="w-[130px] h-[30px] text-xs border border-gray-300 rounded-md hover:bg-gray-200 mr-2">
                    +기본 블록 추가
                  </button>
                  <button className="w-[85px] h-[30px] text-xs border border-gray-300 rounded-md hover:bg-gray-200 mr-2">
                    초기화
                  </button>
                  <button className="w-[73px] h-[30px] text-xs bg-black text-white rounded-md">
                    저장
                  </button>
                </div>
              </div>
              <div>
                <label for="fieldDescription" className="text-sm">
                  설명
                </label>
                <div className="flex-1 h-[55px] rounded-lg flex items-center bg-gray-100 focus-within:outline focus-within:outline-3 focus-within:outline-gray-300">
                  <textarea
                    className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2"
                    type="text"
                    id="fieldTitle"
                    value={currentDataField.description}
                  />
                </div>
              </div>
            </div>
            {/* Middle Bottom Section */}
            <div className="p-4">
              {/* Tab Menu */}
              <div className="flex items-center justify-center">
                <ul className="h-[34px] w-[97%] flex items-center justify-around rounded-2xl bg-gray-200 text-sm p-1">
                  {DATA_FIELD_TAB.map((tab) => (
                    <li
                      key={tab.id}
                      className={`py-1 w-[50%] rounded-xl cursor-default flex items-center justify-center ${
                        tab.id === activeTab ? "bg-white" : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.title}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="w-[355px] min-h-full flex flex-col border-l border-gray-200">
        <div className="w-full h-[83px] border-b border-gray-200 p-3">
          <div>실시간 미리보기</div>
          <div className="text-xs text-gray-500">
            편집 중인 데이터 필드가 카드에서 어떻게 표시되는지 확인할 수
            있습니다.
          </div>
        </div>

        <div className="w-full h-full flex flex-col justify-start items-center">
          {/* 카드 미리보기 */}
          <div className="w-[305px] h-[343px] border border-gray-200 rounded-xl mt-4 p-5">
            <div className="text-sm mb-4">카드 미리보기</div>

            <div className="w-[258px] h-[255px] border border-gray-200 rounded-xl flex flex-col items-center pt-4">
              <div className="w-[90%] min-h-[112px] relative bg-gray-200">
                {currentDataField?.title && (
                  <div className="w-fit h-fit text-xs bg-black text-white rounded-xl p-1 m-1 absolute">
                    {currentDataField.title}
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col items-start m-3">
                <div className="text-sm mb-1">청화백자 달항아리</div>
                <div className="text-xs flex-1 text-gray-500 mb-3">
                  조선 후기의 대표적인 백자 달항아리로, 정화 안료로 그려진
                  섬세한 문양이 특징입니다.
                </div>
                <div className="text-[11px] text-gray-500">
                  2025. 11. 13. 오후 4:27:08
                </div>
              </div>
            </div>
          </div>

          {/* 속성 블록 미리보기 */}
          <div className="w-[305px] h-[335px] border border-gray-200 rounded-xl mt-4 p-5">
            <div className="w-full h-[83px] border-gray-200 p-1">
              <div className="text-sm mb-4">속성 블록 미리보기</div>
            </div>
          </div>

          {/* 연결 블록 미리보기 */}
          <div className="w-[305px] h-[363px] border border-gray-200 rounded-xl mt-4 p-5">
            <div className="w-full h-[83px] border-gray-200 p-1">
              <div className="text-sm mb-4">연결 블록 미리보기</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataFields;
