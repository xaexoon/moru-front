import { useState } from "react";

import { ReactComponent as NewIcon } from "../../../assets/dataFields/new.svg";
import { ReactComponent as LinkIcon } from "../../../assets/dataFields/link.svg";
import { ReactComponent as TrashIcon } from "../../../assets/dataFields/trash.svg";
import { ReactComponent as ExpandIcon } from "../../../assets/dataFields/expand.svg";

function LinkBlockEditor({ data, onChange }) {
  const [openBlocks, setOpenBlocks] = useState([]);
  const [newBlockName, setNewBlockName] = useState("");

  const handleAddLink = () => {
    const inputName = newBlockName.trim();

    if (!inputName) return;
    if (data?.some((block) => block.name === inputName)) {
      alert("중복된 블록 이름입니다.");
      setNewBlockName("");
      return;
    }

    const next = [
      ...(data ?? []),
      {
        dataFieldId: data.dataFieldId,
        name: newBlockName.trim(),
        maxLinkCount: 0,
        uiKey: crypto.randomUUID(),
      },
    ];

    onChange(next);
    setNewBlockName("");

    console.log("updated connect data:", next);
  };

  const handleEditLink = (uiKey, editData) => {
    const next = data.map((linkBlock) =>
      linkBlock.uiKey === uiKey ? { ...linkBlock, ...editData } : linkBlock
    );

    onChange(next);
  };

  const handleDeleteLink = (uiKey) => {
    const next = data.filter((block) => block.uiKey !== uiKey);

    onChange(next);

    setOpenBlocks((prev) => prev.filter((key) => key !== uiKey));
  };

  const toggleBlock = (uiKey) => {
    setOpenBlocks((prev) =>
      prev.includes(uiKey)
        ? prev.filter((item) => item !== uiKey)
        : [...prev, uiKey]
    );
  };

  return (
    <>
      {/* Editor Top */}
      <div className="flex items-center justify-between">
        <div className="flex mb-3">
          <LinkIcon className="w-4 text-gray-500 mr-2" />
          <p className="text-sm">연결 블록</p>
        </div>
        <div className="px-[10px] py-[3px] text-sm bg-gray-200 rounded-lg">
          {data?.length ?? 0}개
        </div>
      </div>

      {/* Editor Middle */}
      <div className="w-full h-[94px] border-2 border-dashed border-gray-300 bg-gray-100 rounded-lg flex justify-center items-center px-4 mt-5 mb-2">
        <div className="flex-1 mr-2 mb-2">
          <label htmlFor="LinkBlockName" className="text-xs">
            연결 블록 이름
          </label>
          <div className="w-full h-[30px] rounded-md mr-3 flex items-center focus-within:outline bg-gray-100 focus-within:outline-3 focus-within:outline-gray-300 mt-1">
            <input
              className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2"
              type="text"
              id="LinkBlockName"
              placeholder="예: 구성요소, 관련문양, 유사작품"
              value={newBlockName}
              onChange={(e) => {
                setNewBlockName(e.target.value);
              }}
            />
          </div>
        </div>

        <button className="w-[90px] h-[35px] text-xs text-white rounded-md bg-black mt-4">
          <div
            className="flex items-center justify-center"
            onClick={handleAddLink}
          >
            <NewIcon className="flex items-center justify-center w-4 text-white mr-1" />
            추가
          </div>
        </button>
      </div>

      {/* Editor Bottom */}
      {data?.length !== 0 ? (
        <li className="flex flex-col justify-center items-center">
          {data.map((linkData) => {
            const isOpen = openBlocks.includes(linkData.uiKey);

            return (
              <ul
                className={`w-full h-auto border-2 border-gray-200 rounded-xl mt-3 flex items-center hover:border-gray-400 cursor-pointer ${
                  isOpen ? " flex-col justify-start" : " justify-between"
                }`}
                key={linkData.uiKey}
              >
                <div
                  className="min-h-[46px] w-full flex-1 flex items-center px-3"
                  onClick={() => {
                    toggleBlock(linkData.uiKey);
                  }}
                >
                  <div className="flex-1 flex items-center">
                    <div className="w-3 text-gray-400 mr-2 text-xs"> || </div>
                    <LinkIcon className="w-3 text-black mr-2 mt-1" />
                    <div className="text-xs">{linkData.name}</div>
                  </div>
                  {linkData.maxLinkCount !== 0 && (
                    <div className="text-[10px] px-2 py-[1px] mr-4 bg-gray-200 rounded-xl">
                      최대 {linkData.maxLinkCount}개
                    </div>
                  )}
                  <TrashIcon
                    className="w-3 text-red-600 mr-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLink(linkData.uiKey);
                    }}
                  />
                  <ExpandIcon className="w-3 text-gray-500 -rotate-90" />
                </div>
                {isOpen && (
                  <div className="w-full h-[132px] border-t-2 border-gray-200 px-3">
                    <div className="flex-1 mr-2 mb-1">
                      <label htmlFor="LinkBlockName" className="text-xs">
                        연결 블록 이름
                      </label>
                      <div className="w-full h-[30px] rounded-md mr-3 flex items-center focus-within:outline bg-gray-100 focus-within:outline-3 focus-within:outline-gray-300 mt-1">
                        <input
                          className="w-full h-full border-none bg-transparent focus:outline-none text-xs p-2"
                          type="text"
                          id="LinkBlockName"
                          placeholder="연결 블록 이름"
                          value={linkData.name}
                          onChange={(e) => {
                            handleEditLink(linkData.uiKey, {
                              name: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 mr-2 mb-2">
                      <label
                        htmlFor="LinkBlockMaxLinkCount"
                        className="text-xs"
                      >
                        최대 연결 수
                      </label>
                      <div className="w-[60%] h-[30px] rounded-md mr-3 flex items-center focus-within:outline bg-gray-100 focus-within:outline-3 focus-within:outline-gray-300 mt-1">
                        <input
                          className="w-full h-full border-none bg-transparent focus:outline-none text-xs p-2"
                          type="number"
                          id="LinkBlockMaxLinkCount"
                          placeholder="제한 없음"
                          value={linkData.maxLinkCount}
                          onChange={(e) => {
                            handleEditLink(linkData.uiKey, {
                              maxLinkCount: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </ul>
            );
          })}
        </li>
      ) : (
        <div className="flex flex-col items-center mt-5">
          <LinkIcon className="w-14 text-gray-300 mt-12" />
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

export default LinkBlockEditor;
