import { useState } from "react";

import { ReactComponent as NewIcon } from "../../../assets/dataFields/new.svg";
import { ReactComponent as FileIcon } from "../../../assets/dataFields/file.svg";
import { ReactComponent as TrashIcon } from "../../../assets/dataFields/trash.svg";

function AttributeBlockEditor({ data, onChange }) {
  const [blockTitle, setBlockTitle] = useState("");
  const [maxCount, setMaxCount] = useState(0);
  const [description, setDescription] = useState("");

  const handleAddAttribute = () => {
    if (!blockTitle.trim()) return;

    const next = [
      ...(data ?? []),
      {
        title: blockTitle.trim(),
        maxCount: maxCount,
        description: "",
      },
    ];

    onChange(next);
    setBlockTitle("");

    console.log("updated attribute:", next);
  };

  return (
    <>
      {/* Editor Top */}
      <div className="flex items-center justify-between">
        <p>속성 블록</p>
        <div className="px-[7px] py-[2px] text-xs bg-gray-200 rounded-lg">
          {data?.length ?? 0}개
        </div>
      </div>

      {/* Editor Middle */}
      <div className="w-full h-[60px] bg-gray-50 rounded-md mt-4 flex justify-center items-center px-[10px]">
        <div className="flex-1 h-[30px] bg-gray-100 rounded-md mr-3 flex items-center focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 ">
          <input
            className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2 "
            placeholder="속성 블록 이름 (예: 구성요소, 관련문양)"
            value={blockTitle}
            onChange={(e) => setBlockTitle(e.target.value)}
          />
        </div>
        <button className="w-[70px] h-[30px] text-xs text-white rounded-md bg-black">
          <div
            className="flex items-center justify-center"
            onClick={handleAddAttribute}
          >
            <NewIcon className="flex items-center justify-center w-4 text-white mr-1" />
            추가
          </div>
        </button>
      </div>

      {/* Editor Bottom */}
      {data?.length !== 0 ? (
        <li className="flex flex-col justify-center items-center">
          {data.map((attributeData) => {
            return (
              <ul
                className="w-[95%] h-[60px] border border-gray-200 rounded-md mt-3 flex  justify-between items-center px-3"
                key={`attributeData_${attributeData.title}`}
              >
                <div className="flex-1 flex">
                  <div className="w-3 text-gray-400 mr-2"> || </div>
                  <FileIcon className="w-4 text-gray-400 mr-2" />
                  <div className="flex-1 h-[30px] bg-gray-100 rounded-md mr-3 flex items-center focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 ">
                    <input
                      className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2 "
                      placeholder="속성 블록 이름"
                      value={attributeData.title}
                      onChange={(e) => e.target.value}
                    />
                  </div>
                  <div className="flex-1 h-[30px] bg-gray-100 rounded-md mr-3 flex items-center focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 ">
                    <input
                      className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2 "
                      placeholder="최대 연결 수"
                      type="number"
                      value={attributeData.maxCount}
                      onChange={(e) => e.target.value}
                    />
                  </div>
                  <div className="flex-1 h-[30px] bg-gray-100 rounded-md mr-3 flex items-center focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 ">
                    <input
                      className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2 "
                      placeholder="허용 카드 타입 (쉼표 구분)"
                      value={attributeData.description}
                      onChange={(e) => e.target.value}
                    />
                  </div>
                </div>
                <TrashIcon className="w-4 text-red-600" />
              </ul>
            );
          })}
        </li>
      ) : (
        <div className="flex flex-col items-center mt-5">
          <FileIcon className="w-10 text-gray-400 mt-5" />
          <p className="text-sm text-gray-500 mt-4">
            아직 속성 블록이 없습니다.
          </p>
          <p className="text-sm text-gray-500">
            위에서 새 블록을 추가하거나 기본 블록 세트를 추가해보세요.
          </p>
        </div>
      )}
    </>
  );
}

export default AttributeBlockEditor;
