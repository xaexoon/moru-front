import { useState } from "react";

import { ReactComponent as NewIcon } from "../../../assets/dataFields/new.svg";
import { ReactComponent as FileIcon } from "../../../assets/dataFields/file.svg";
import { ReactComponent as TrashIcon } from "../../../assets/dataFields/trash.svg";
import { ReactComponent as ExpandIcon } from "../../../assets/dataFields/expand.svg";
import Dropdown from "../../../components/dropdown/Dropdown";

const BLOCK_OPTION_DATA = ["텍스트", "이미지", "숫자/재원"];

function AttributeBlockEditor({ data, onChange }) {
  const [openBlockIds, setOpenBlockIds] = useState([]);
  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockType, setNewBlockType] = useState(BLOCK_OPTION_DATA[0]);
  // const [editingAttributeBlocks, setEditingAttributeBlocks] = useState({}); // { name: string; placeholder: string; }

  const handleAddAttribute = () => {
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
        name: newBlockName.trim(),
        type: newBlockType,
        placeholder: "",
      },
    ];

    onChange(next);
    setNewBlockName("");
    setNewBlockType(BLOCK_OPTION_DATA[0]);

    console.log("updated attribute data:", next);
  };

  const handleEditAddAttribute = (id, editData) => {
    const next = data.map((attributeBlock) =>
      attributeBlock.id === id
        ? { ...attributeBlock, ...editData }
        : attributeBlock
    );

    onChange(next);
    console.log(next);
  };

  const toggleBlock = (id) => {
    setOpenBlockIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBlockTypeChange = (value) => {
    setNewBlockType(value);
    console.log("block type:", value);
  };

  return (
    <>
      {/* Editor Top */}
      <div className="flex items-center justify-between">
        <div className="flex mb-3">
          <FileIcon className="w-4 text-gray-500 mr-2" />
          <p className="text-sm">속성 블록</p>
        </div>
        <div className="px-[10px] py-[1px] text-ms bg-gray-200 rounded-lg">
          {data?.length ?? 0}개
        </div>
      </div>

      {/* Editor Middle */}
      <div className="w-full h-[94px] border-2 border-dashed border-gray-300 bg-gray-100 rounded-lg flex justify-center items-center px-4 mt-5 mb-2">
        <div className="flex-1 flex items-center">
          <div className="flex-1 mr-2 mb-2">
            <label htmlFor="atttibutenewBlockName" className="text-xs">
              블록 이름
            </label>
            <div className="w-full h-[30px] rounded-md mr-3 flex items-center focus-within:outline bg-gray-100 focus-within:outline-3 focus-within:outline-gray-300 mt-1">
              <input
                className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2"
                type="text"
                id="atttibutenewBlockName"
                placeholder="예: 크기, 무게, 특징"
                value={newBlockName}
                onChange={(e) => {
                  setNewBlockName(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="flex-1 mr-2 mb-2">
            <label htmlFor="newBlockType" className="text-xs">
              블록 타입
            </label>
            <div className="w-full h-[30px] mt-1">
              <Dropdown
                id="newBlockType"
                options={BLOCK_OPTION_DATA}
                onChange={handleBlockTypeChange}
              />
            </div>
          </div>
        </div>
        <button className="w-[90px] h-[35px] text-xs text-white rounded-md bg-black mt-4">
          <div
            className="flex items-center justify-center "
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
            const isOpen = openBlockIds.includes(attributeData.id);

            return (
              <ul
                className={`w-full h-auto border-2 border-gray-200 rounded-xl mt-3 flex items-center hover:border-gray-400 cursor-pointer ${
                  isOpen ? " flex-col justify-start" : " justify-between"
                }`}
                key={attributeData.id}
              >
                <div
                  className="min-h-[46px] w-full flex-1 flex items-center px-3"
                  onClick={() => {
                    toggleBlock(attributeData.id);
                  }}
                >
                  <div className="flex-1 flex items-center">
                    <div className="w-3 text-gray-400 mr-2 text-xs"> || </div>
                    <FileIcon className="w-3 text-black mr-2 mt-1" />
                    <div className="text-xs">{attributeData.name}</div>
                  </div>
                  <TrashIcon className="w-3 text-red-600 mr-4" />
                  <ExpandIcon className="w-3 text-gray-500 -rotate-90" />
                </div>
                {isOpen && (
                  <div className="w-full h-[160px] border-t-2 border-gray-200 px-3">
                    <div className="flex-1 mr-2 mb-1">
                      <label
                        htmlFor="atttibutenewBlockName"
                        className="text-xs"
                      >
                        블록 이름
                      </label>
                      <div className="w-full h-[30px] rounded-md mr-3 flex items-center focus-within:outline bg-gray-100 focus-within:outline-3 focus-within:outline-gray-300 mt-1">
                        <input
                          className="w-full h-full border-none bg-transparent focus:outline-none text-xs p-2"
                          type="text"
                          id="atttibutenewBlockName"
                          placeholder="블록 이름"
                          value={attributeData.name}
                          onChange={(e) => {
                            handleEditAddAttribute(attributeData.id, {
                              name: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex-1 mr-2 mb-2">
                      <label
                        htmlFor="atttibuteBlockPlaceHolder"
                        className="text-xs"
                      >
                        플레이스홀더
                      </label>
                      <div className="w-[60%] h-[30px] rounded-md mr-3 flex items-center focus-within:outline bg-gray-100 focus-within:outline-3 focus-within:outline-gray-300 mt-1">
                        <input
                          className="w-full h-full border-none bg-transparent focus:outline-none text-xs p-2"
                          type="text"
                          id="atttibuteBlockPlaceHolder"
                          placeholder="입력 안내"
                          value={attributeData.placeholder}
                          onChange={(e) => {
                            handleEditAddAttribute(attributeData.id, {
                              placeholder: e.target.value,
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
          <FileIcon className="w-10 text-gray-300 mt-12" />
          <p className="text-sm text-gray-500 mt-4">
            아직 속성 블록이 없습니다.
          </p>
          <p className="text-xs text-gray-500 mt-2 mb-12">
            위에서 새 블록을 추가하거나 기본 블록 세트를 추가해보세요.
          </p>
        </div>
      )}
    </>
  );
}

export default AttributeBlockEditor;
