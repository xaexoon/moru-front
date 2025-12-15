import { useState } from "react";

import { ReactComponent as PreviewIcon } from "../../assets/dataFields/preview.svg";
import { ReactComponent as DataFieldIcon } from "../../assets/dataFields/dataField.svg";
import { ReactComponent as NewIcon } from "../../assets/dataFields/new.svg";
import { ReactComponent as UnionIcon } from "../../assets/dataFields/union.svg";
import { ReactComponent as ReloadIcon } from "../../assets/dataFields/reload.svg";
import AttributeBlockEditor from "./tabs/AttributeBlockEditor";
import ConnectBlockEditor from "./tabs/ConnectBlockEditor";

const dataFieldOptions = [
  {
    id: 1,
    title: "유물/작품",
    attribute: [
      {
        title: "구성 부품",
        maxCount: 0,
        description: "artifact, shape, material",
      },
      { title: "적용 문양", maxCount: 5, description: "pattern" },
      { title: "사용 기법", maxCount: 3, description: "technique" },
      { title: "관련 시대", maxCount: 1, description: "period" },
    ],
    connect: [
      {
        title: "설명",
        type: "text",
        description: "이 항목에 대한 자세한 설명을 입력하세요...",
      },
      { title: "치수", type: "number", description: "수치를 입력하세요" },
      { title: "재질", type: "text", description: "재질 정보를 입력하세요" },
      {
        title: "참고 이미지",
        type: "image",
        description: "관련 이미지를 업로드하세요",
      },
    ],
    description: "전시품, 유물, 예술작품 등의 정보를 관리합니다.",
    type: "기본",
  },
  {
    id: 2,
    title: "색상",
    attribute: [
      {
        title: "적용된 유물",
        maxCount: 0,
        description: "artifact, shape, material",
      },
    ],
    connect: [
      {
        title: "색상명",
        type: "text",
        description: "색상의 이름을 입력하세요",
      },
      {
        title: "RGB/HEX 값",
        type: "text",
        description: "#FFFFFF 또는 rgb(255,255,255)",
      },
      {
        title: "설명",
        type: "text",
        description: "색상에 대한 설명을 입력하세요",
      },
    ],
    description: "색상 정보와 색채 관련 데이터를 관리합니다.",
    type: "기본",
  },
  {
    id: 3,
    title: "재질",
    attribute: [
      {
        title: "사용된 유물",
        maxCount: 0,
        description: "artifact",
      },
    ],
    connect: [
      {
        title: "재질명",
        type: "text",
        description: "재질의 이름을 입력하세요",
      },
      {
        title: "특성",
        type: "text",
        description: "재질의 특성을 설명하세요",
      },
      {
        title: "밀도",
        type: "number",
        description: "밀도 값",
      },
    ],
    description: "재료와 소재 정보를 관리합니다.",
    type: "기본",
  },
  {
    id: 4,
    title: "모루아카이브123",
    attribute: [
      {
        title: "001",
        maxCount: 0,
        description: "artifact, shape, material",
      },
      { title: "002", maxCount: 5, description: "pattern" },
    ],
    connect: [
      {
        title: "블록1",
        type: "text",
        description: "이 항목에 대한 자세한 설명을 입력하세요...",
      },
      { title: "블록2", type: "number", description: "수치를 입력하세요" },
    ],
    description: "",
    type: "기본",
  },
];

const DATA_FIELD_TAB = [
  { title: "기본 정보 필드", id: "attribute" },
  { title: "연결 블록", id: "connect" },
];

function DataFields() {
  const [mode, setMode] = useState("add"); // "add" | "edit"
  const [currentDataField, setCurrentDataField] = useState({});
  const [activeTab, setActiveTab] = useState(DATA_FIELD_TAB[0]);

  const handleAttributeChange = (updatedAttribute) => {
    setCurrentDataField((prev) => ({
      ...prev,
      attribute: updatedAttribute,
    }));

    console.log("current DataField:", currentDataField);
  };

  const handleConnectChange = (updatedConnect) => {
    setCurrentDataField((prev) => ({
      ...prev,
      connect: updatedConnect,
    }));
  };

  return (
    <div className="w-full min-h-full flex">
      {/* Left Section */}
      <div className="w-[280px] min-h-full flex flex-col border-r border-gray-200">
        <div className="w-full h-[150px] border-b border-gray-200 flex flex-col p-6">
          <div className="text-sm mb-1">데이터 필드 관리</div>
          <div className="text-xs text-gray-500 mb-6">
            카드 데이터 구조를 커스터마이징하세요
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              className="w-[240px] h-[38px] bg-black text-white rounded-lg text-xs flex items-center justify-center"
              onClick={() => {
                setMode("new");
                setCurrentDataField({
                  title: "",
                  attribute: [],
                  connect: [],
                  description: "",
                  type: "",
                });
              }}
            >
              <NewIcon className="w-4 text-white mr-3" />
              <p>새 데이터 필드</p>
            </button>
          </div>
        </div>

        {/*Data Field Option*/}
        <div className="flex flex-col p-3">
          <div className="text-xs mb-3">데이터 필드 목록</div>
          <div className="flex flex-col item">
            {dataFieldOptions.map((option) => {
              return (
                <div
                  className="w-[230px] min-h-[70px] border-2 border-gray-200 rounded-lg mb-2 p-2 text-xs"
                  key={`option_${option.title}`}
                  onClick={() => {
                    setMode("edit");
                    setCurrentDataField(option);
                    console.log("current data field", currentDataField);
                  }}
                >
                  <div className="w-full flex justify-between">
                    <div className="flex w-full">
                      <DataFieldIcon className="mr-2 w-[17px] h-[30px] text-gray-500" />
                      <div className="w-full flex flex-col">
                        <div className="flex justify-between">
                          <div
                            className="mt-1"
                            key={`option.title_${option.title}`}
                          >
                            {option.title}
                          </div>
                          {option.type === "기본" && (
                            <div
                              className="w-[35px] h-[20px] m-1 bg-gray-200 rounded-lg text-center text-xs"
                              key={`option.type_${option.type}`}
                            >
                              {option.type}
                            </div>
                          )}
                        </div>
                        <div
                          className="w-full text-[11px] text-gray-500 mb-1"
                          key={`option.attribute_${option.connect}`}
                        >
                          {option.attribute.length}개 속성,{" "}
                          {option.connect.length}개 연결
                        </div>
                        <div
                          className="text-[11px] text-gray-500"
                          key={`option.description_${option.description}`}
                        >
                          {option.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex-1 min-h-full">
        {mode === "new" || currentDataField?.title ? (
          <div>
            {/* Middle Title Section */}
            <div className="w-full h-[105px] border-b border-gray-200 flex flex-col px-5 py-3">
              <div className="flex justify-between items-center">
                <div className="flex-1 mr-1">
                  <label for="fieldTitle" className="text-sm">
                    필드 이름*
                  </label>
                  <div className="flex-1 max-w-[588px] h-[40px] rounded-lg flex items-center bg-gray-100 focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 mt-2">
                    <input
                      className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2"
                      type="text"
                      id="fieldTitle"
                      value={currentDataField.title}
                      placeholder="예: 건축물, 문서, 영상 등"
                    />
                  </div>
                </div>
                <div className="m-2">
                  <button className="w-[80px] h-[35px] text-xs bg-black text-white rounded-md">
                    <div className="flex items-center justify-center">
                      <UnionIcon className="w-4 text-white mr-2" />
                      <p>저장</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Middle description Section */}
            <div className="p-4 min-h-[202px] flex flex-col">
              <label for="fieldDescription" className="text-sm">
                설명
              </label>
              <div className="flex-1 rounded-lg flex items-center  focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 mt-1 mb-3">
                <textarea
                  className="w-full h-[90px] border-none bg-transparent focus:outline-none text-[13px] p-2 resize-none mb-"
                  type="text"
                  id="fieldTitle"
                  value={currentDataField.description}
                  placeholder="이 데이터 필드의 용도를 설명하세요..."
                />
              </div>
              <div className="mt-2 border-b border-gray-200 pb-5 flex items-center">
                <button className="w-[130px] h-[33px] text-xs border border-gray-300 rounded-md hover:bg-gray-200 mr-2">
                  <div className="flex items-center justify-center">
                    <NewIcon className="w-4 text-black mr-2" />
                    기본 블록 추가
                  </div>
                </button>
                <button className="w-[85px] h-[33px] text-xs border border-gray-300 rounded-md hover:bg-gray-200 mr-2">
                  <div className="flex items-center justify-center">
                    <ReloadIcon className="w-3 text-black mr-2" /> 초기화
                  </div>
                </button>
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
                        tab.id === activeTab.id && "bg-white"
                      }`}
                      onClick={() => {
                        setActiveTab(tab);
                      }}
                    >
                      {tab.title}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tab Section */}
              <div className="pt-6 flex flex-col items-center">
                <div className="p-6 w-[97%] min-h-[340px] border border-gray-200 rounded-lg">
                  {activeTab.id === "attribute" && (
                    <AttributeBlockEditor
                      data={currentDataField.attribute}
                      onChange={handleAttributeChange}
                    />
                  )}
                  {activeTab.id === "connect" && (
                    <ConnectBlockEditor
                      data={currentDataField.connect}
                      onChange={handleConnectChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-full flex flex-col items-center justify-center">
            <DataFieldIcon className="w-14 text-gray-400 mb-4" />
            <p className="text-lg text-gray-500">데이터 필드를 선택하세요</p>
            <p className="text-sm text-gray-500">
              왼쪽에서 데이터 필드를 선택하거나 새로 만들어보세요.
            </p>
          </div>
        )}
      </div>

      {/* Right Section */}
      <div className="w-[355px] min-h-full flex flex-col border-l border-gray-200">
        <div className="w-full h-[83px] border-b border-gray-200 p-3">
          <div className="flex items-center">
            <PreviewIcon className="mr-2" />
            <div>실시간 미리보기</div>
          </div>
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
