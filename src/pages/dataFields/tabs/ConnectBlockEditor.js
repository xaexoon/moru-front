import { ReactComponent as NewIcon } from "../../../assets/dataFields/new.svg";
import { ReactComponent as RinkIcon } from "../../../assets/dataFields/rink.svg";
import Dropdown from "../../../components/dropdown/Dropdown";

const BLOCK_OPTION_DATA = ["숫자/재원", "이미지", "텍스트"];

function ConnectBlockEditor({ data, onChange }) {
  const handleBlockTypeChange = (value) => console.log("block type:", value);

  console.log("data :", data);

  return (
    <>
      <div className="flex items-center justify-between">
        <p>연결 블록</p>
        <div className="px-[7px] py-[2px] text-xs bg-gray-200 rounded-lg">
          {data?.connect ?? 0}개
        </div>
      </div>
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
              />
            </div>
          </div>
          <div className="flex-1 mr-2">
            <label for="blockType" className="text-xs">
              블록 타입
            </label>
            <div className="w-full h-[30px]">
              <Dropdown
                options={BLOCK_OPTION_DATA}
                onChange={handleBlockTypeChange}
              />
            </div>
          </div>
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
