import { useState } from "react";

import { ReactComponent as NewIcon } from "../../../assets/dataFields/new.svg";
import { ReactComponent as FileIcon } from "../../../assets/dataFields/file.svg";
import { ReactComponent as TrashIcon } from "../../../assets/dataFields/trash.svg";
import { ReactComponent as ExpandIcon } from "../../../assets/dataFields/expand.svg";
import Dropdown from "../../../components/dropdown/Dropdown";

const BLOCK_OPTION_DATA = [
  { title: "텍스트", value: "TEXT" },
  { title: "이미지", value: "IMAGE" },
  { title: "숫자/재원", value: "NUMBER" },
];

function AttributeBlockEditor({ data, onChange }) {
  const [openBlocks, setOpenBlocks] = useState([]);
  const [newBlockName, setNewBlockName] = useState("");
  const [newBlockType, setNewBlockType] = useState(BLOCK_OPTION_DATA[0]);

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
        type: newBlockType.value,
        placeHolder: "",
        required: false,
        uiKey: crypto.randomUUID(),
      },
    ];

    onChange(next);
    setNewBlockName("");
    setNewBlockType(BLOCK_OPTION_DATA[0]);

    console.log("updated attribute data:", next);
  };

  const handleEditAddAttribute = (uiKey, editData) => {
    const next = data.map((block) =>
      block.uiKey === uiKey ? { ...block, ...editData } : block
    );

    onChange(next);
  };

  const handleDeleteAttribute = (uiKey) => {
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

  const handleBlockTypeChange = (option) => {
    setNewBlockType(option);
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
            <label htmlFor="atttibuteBlockName" className="text-xs">
              블록 이름
            </label>
            <div className="w-full h-[30px] rounded-md mr-3 flex items-center focus-within:outline bg-gray-100 focus-within:outline-3 focus-within:outline-gray-300 mt-1">
              <input
                className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2"
                type="text"
                id="atttibuteBlockName"
                placeholder="예: 크기, 무게, 특징"
                value={newBlockName}
                onChange={(e) => {
                  setNewBlockName(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="flex-1 mr-2 mb-2">
            <label className="text-xs">블록 타입</label>
            <div className="w-full h-[30px] mt-1">
              <Dropdown
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
            const isOpen = openBlocks.includes(attributeData.uiKey);

            return (
              <ul
                className={`w-full h-auto border-2 border-gray-200 rounded-xl mt-3 flex items-center hover:border-gray-400 cursor-pointer ${
                  isOpen ? " flex-col justify-start" : " justify-between"
                }`}
                key={attributeData.uiKey}
              >
                <div
                  className="min-h-[46px] w-full flex-1 flex items-center px-3"
                  onClick={() => {
                    toggleBlock(attributeData.uiKey);
                  }}
                >
                  <div className="flex-1 flex items-center">
                    <div className="w-3 text-gray-400 mr-2 text-xs"> || </div>
                    <FileIcon className="w-3 text-black mr-2 mt-1" />
                    <div className="text-xs">{attributeData.name}</div>
                  </div>
                  <div className="flex items-center justify-center">
                    {attributeData.required && (
                      <div className="w-9 h-[17px] bg-red-600 flex justify-center items-center mr-3 rounded-lg">
                        <p className=" text-xs text-white">필수</p>
                      </div>
                    )}
                    <TrashIcon
                      className="w-3 text-red-600 mr-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAttribute(attributeData.uiKey);
                      }}
                    />
                    <ExpandIcon className="w-3 text-gray-500 -rotate-90" />
                  </div>
                </div>
                {isOpen && (
                  <div className="w-full h-[160px] border-t-2 border-gray-200 px-3">
                    <div className="flex-1 mr-2 mb-1">
                      <label
                        htmlFor={`atttibutenewBlockName-${attributeData.name}`}
                        className="text-xs"
                      >
                        블록 이름
                      </label>
                      <div className="w-full h-[30px] rounded-md mr-3 flex items-center focus-within:outline bg-gray-100 focus-within:outline-3 focus-within:outline-gray-300 mt-1">
                        <input
                          className="w-full h-full border-none bg-transparent focus:outline-none text-xs p-2"
                          type="text"
                          id={`atttibutenewBlockName-${attributeData.name}`}
                          placeholder="블록 이름"
                          value={attributeData.name}
                          onChange={(e) => {
                            handleEditAddAttribute(attributeData.uiKey, {
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
                          value={attributeData.placeHolder}
                          onChange={(e) => {
                            handleEditAddAttribute(attributeData.uiKey, {
                              placeHolder: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex">
                      <input
                        type="checkbox"
                        className="mr-2 "
                        checked={!!attributeData.required}
                        onChange={() => {
                          handleEditAddAttribute(attributeData.uiKey, {
                            required: !attributeData.required,
                          });
                        }}
                      />
                      <p className="text-xs">필수 항목으로 설정</p>
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
