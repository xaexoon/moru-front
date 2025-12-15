import { useState } from "react";

import { ReactComponent as NewIcon } from "../../../assets/dataFields/new.svg";
import { ReactComponent as RinkIcon } from "../../../assets/dataFields/rink.svg";
import { ReactComponent as TrashIcon } from "../../../assets/dataFields/trash.svg";
import { ReactComponent as ExpandIcon } from "../../../assets/dataFields/expand.svg";

function ConnectBlockEditor({ data, onChange }) {
  const [blockTitle, setBlockTitle] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [maxCount, setMaxCount] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [description, setDescription] = useState("");

  const handleAddAttribute = () => {
    const inputTitle = blockTitle.trim();

    if (!inputTitle) return;
    if (data?.some((block) => block.title === inputTitle)) {
      alert("중복된 블록 이름입니다.");
      setBlockTitle("");
      return;
    }

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

    console.log("updated connect data:", next);
  };

  return (
    <>
      {/* Editor Top */}
      <div className="flex items-center justify-between">
        <div className="flex mb-3">
          <RinkIcon className="w-4 text-gray-500 mr-2" />
          <p className="text-sm">연결 블록</p>
        </div>
        <div className="px-[10px] py-[3px] text-sm bg-gray-200 rounded-lg">
          {data?.length ?? 0}개
        </div>
      </div>

      {/* Editor Middle */}
      <div className="w-full h-[94px] border-2 border-dashed border-gray-300 bg-gray-100 rounded-lg flex justify-center items-center px-4 mt-5 mb-2">
        <div className="flex-1 mr-2 mb-2">
          <label for="blockTitle" className="text-xs">
            연결 블록 이름
          </label>
          <div className="w-full h-[30px] rounded-md mr-3 flex items-center focus-within:outline bg-gray-100 focus-within:outline-3 focus-within:outline-gray-300 mt-1">
            <input
              className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2"
              type="text"
              id="blockTitle"
              placeholder="예: 구성요소, 관련문양, 유사작품"
              value={blockTitle}
              onChange={(e) => {
                setBlockTitle(e.target.value);
              }}
            />
          </div>
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
          {data.map((connectData) => {
            return (
              <ul
                className="w-[100%] h-[45px] border-2 border-gray-200 rounded-xl mt-3 flex items-center justify-between px-3"
                key={`connectData_${connectData.title}`}
              >
                <div className="flex-1 flex items-center">
                  <div className="w-3 text-gray-400 mr-2 text-xs"> || </div>
                  <RinkIcon className="w-3 text-black mr-2 mt-1" />
                  <div className="text-xs">{connectData.title}</div>
                </div>
                <TrashIcon className="w-3 text-red-600 mr-4" />
                <ExpandIcon className="w-3 text-gray-500 -rotate-90" />
              </ul>
            );
          })}
        </li>
      ) : (
        <div className="flex flex-col items-center mt-5">
          <RinkIcon className="w-14 text-gray-300 mt-12" />
          <p className="text-sm text-gray-500 mt-4">
            아직 연결 블록이 없습니다.
          </p>
          <p className="text-xs text-gray-500 mt-2 mb-12">
            위에서 연결 새 블록 세트를 추가해보세요.
          </p>
        </div>
      )}
    </>
  );
}

export default ConnectBlockEditor;
