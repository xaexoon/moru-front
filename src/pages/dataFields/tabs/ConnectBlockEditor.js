import { useState } from "react";

import { ReactComponent as NewIcon } from "../../../assets/dataFields/new.svg";
import { ReactComponent as RinkIcon } from "../../../assets/dataFields/rink.svg";
import { ReactComponent as TrashIcon } from "../../../assets/dataFields/trash.svg";
import Dropdown from "../../../components/dropdown/Dropdown";

const BLOCK_OPTION_DATA = ["숫자/재원", "이미지", "텍스트"];

function ConnectBlockEditor({ data, onChange }) {
  const [blockTitle, setBlockTitle] = useState("");
  const [blockType, setBlockType] = useState("숫자/재원");
  // eslint-disable-next-line no-unused-vars
  const [description, setDescription] = useState("");

  const handleBlockTypeChange = (value) => {
    setBlockType(value);
    console.log("block type:", value);
  };

  const handleAddConnect = () => {
    const inputTitle = blockTitle.trim();

    if (!inputTitle || !blockType) return;
    if (data?.some((block) => block.title === inputTitle)) {
      alert("중복된 블록 이름입니다.");
      setBlockTitle("");
      return;
    }

    const next = [
      ...(data ?? []),
      {
        title: blockTitle.trim(),
        type: blockType,
        description: "",
      },
    ];

    onChange(next);
    setBlockTitle("");
    setBlockType("숫자/재원");

    console.log("updated connect:", next);
  };

  return (
    <>
      {/* Editor Top */}
      <div className="flex items-center justify-between">
        <p>연결 블록</p>
        <div className="px-[7px] py-[2px] text-xs bg-gray-200 rounded-lg">
          {data?.length ?? 0}개
        </div>
      </div>

      {/* Editor Middle */}
      <div className="w-full h-[70px] bg-gray-50 rounded-md mt-4 flex justify-center items-center px-[10px]">
        <div className="flex-1 flex items-center">
          <div className="flex-1 mr-2">
            <label for="blockTitle" className="text-xs">
              블록 이름
            </label>
            <div className="w-full h-[30px] rounded-md mr-3 flex items-center focus-within:outline bg-gray-100 focus-within:outline-3 focus-within:outline-gray-300 ">
              <input
                className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2"
                type="text"
                id="blockTitle"
                placeholder="예: 크기, 무게, 특징"
                value={blockTitle}
                onChange={(e) => {
                  setBlockTitle(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="flex-1 mr-2">
            <label for="blockType" className="text-xs">
              블록 타입
            </label>
            <div className="w-full h-[30px]">
              <Dropdown
                id="blockType"
                options={BLOCK_OPTION_DATA}
                onChange={handleBlockTypeChange}
              />
            </div>
          </div>
        </div>
        <button className="w-[70px] h-[30px] text-xs text-white rounded-md bg-black">
          <div
            className="flex items-center justify-center"
            onClick={handleAddConnect}
          >
            <NewIcon className="flex items-center justify-center w-4 text-white mr-1" />
            추가
          </div>
        </button>
      </div>

      {/* Editor Bottom */}
      {data?.length !== 0 ? (
        <li className="flex flex-col justify-center items-center">
          {data.map((connectData) => {
            return (
              <ul
                className="w-[95%] h-[60px] border border-gray-200 rounded-md mt-3 flex items-center justify-between px-3"
                key={`connectData_${connectData.title}`}
              >
                <div className="flex-1 flex">
                  <div className="w-3 text-gray-400 mr-2"> || </div>
                  <RinkIcon className="w-4 text-gray-400 mr-2" />
                  <div className="flex-1 h-[30px] bg-gray-100 rounded-md mr-3 flex items-center focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 ">
                    <input
                      className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2 "
                      placeholder="연결 블록 이름"
                      value={connectData.title}
                      onChange={(e) => e.target.value}
                    />
                  </div>
                  <div className="flex-1 h-[30px] bg-gray-100 rounded-md mr-3 flex items-center focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 ">
                    <input
                      className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2 "
                      placeholder="입력하세요..."
                      value={connectData.description}
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
          <RinkIcon className="w-10 text-gray-400 mt-4" />
          <p className="text-sm text-gray-500 mt-4">
            아직 연결 블록이 없습니다.
          </p>
          <p className="text-sm text-gray-500">
            위에서 새 연결 블록을 추가해보세요.
          </p>
        </div>
      )}
    </>
  );
}

export default ConnectBlockEditor;
