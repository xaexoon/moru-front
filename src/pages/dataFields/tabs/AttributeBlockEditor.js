import { ReactComponent as NewIcon } from "../../../assets/dataFields/new.svg";
import { ReactComponent as FileIcon } from "../../../assets/dataFields/file.svg";

function AttributeBlockEditor({ data, onChange }) {
  console.log("data :", data);
  return (
    <>
      <div className="flex items-center justify-between">
        <p>속성 블록</p>
        <div className="px-[7px] py-[2px] text-xs bg-gray-200 rounded-lg">
          {data?.attribute ?? 0}개
        </div>
      </div>
      <div className="w-full h-[60px] bg-gray-50 rounded-md mt-4 flex justify-center items-center px-[10px]">
        <div className="flex-1 h-[30px] bg-gray-100 rounded-md mr-3 flex items-center focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 ">
          <input
            className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2 "
            placeholder="속성 블록 이름 (예: 구성요소, 관련문양)"
          />
        </div>
        <button className="w-[70px] h-[30px] text-xs text-white rounded-md bg-black">
          <div className="flex items-center justify-center">
            <NewIcon className="flex items-center justify-center w-4 text-white mr-1" />
            추가
          </div>
        </button>
      </div>
      {false ? (
        <></>
      ) : (
        <div className="flex flex-col items-center mt-5">
          <FileIcon className="w-10 text-gray-400 mt-4" />
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
