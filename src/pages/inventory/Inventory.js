/* eslint-disable no-constant-condition */
import Dropdown from "../../components/dropdown/Dropdown";

const SORT_OPTION_DATA = ["최근추가", "자주사용", "제목순"];
const CATEGORY_OPTION_DATA = ["전체", "내 카드", "참조 카드"];

function Inventory() {
  const handleSortChange = (value) => console.log("sort:", value);
  const handleCategoryChange = (value) => console.log("category:", value);

  return (
    <div className="w-full h-full flex flex-1 bg-white">
      {/* Left Section */}
      <div className="w-[70%] h-full flex flex-col border-r-2 border-gray-200">
        {/* Top Section */}
        <div className="h-32 flex flex-col p-5 border-b-2 border-gray-200">
          <div className="flex justify-between items-center mb-[18px]">
            <div className="flex flex-col">
              <p className="text-base">내 인벤토리</p>
              <p className="text-xs text-gray-400">
                작업용으로 모아둔 카드들을 관리하세요
              </p>
            </div>
            <div className="w-[100px] px-[5px] py-1 flex justify-around items-center text-[13px] text-gray-500 border border-gray-100 rounded-lg">
              <input type="checkbox" id="selectMode" className="hidden peer" />
              <label
                htmlFor="selectMode"
                className="inline-block w-[13px] h-[13px] border-2 border-gray-400 rounded cursor-pointer peer-checked:bg-gray-400 peer-checked:border-gray-400"
              ></label>
              <span>선택 모드</span>
            </div>
          </div>

          {/* Menu */}
          <div className="flex-1 flex">
            <div className="flex-1 max-w-[392px] h-[31px] rounded-lg flex items-center bg-gray-100 focus-within:outline focus-within:outline-3 focus-within:outline-gray-300">
              <div className="search_icon"></div>
              <input
                className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] "
                type="text"
                placeholder="인벤토리 내 검색..."
              />
            </div>
            <div className="w-[140px] h-[31px] mx-[14px]">
              <Dropdown
                options={SORT_OPTION_DATA}
                onChange={handleSortChange}
              />
            </div>
            <div className="w-[112px] h-[31px]">
              <Dropdown
                options={CATEGORY_OPTION_DATA}
                onChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full h-full flex">
          {/* 받아온 데이터 여부에 따라서 */}
          {false ? (
            <></>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center m-5">
              <div className="w-[55px] h-[55px] rounded-full bg-gray-100 my-[15px]"></div>
              <p>인벤토리가 비어있습니다</p>
              <p className="text-gray-400 mt-[2px]">
                카드 피드에서 카드를 추가하여 작업용 인벤토리를 구성하세요
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-1 flex">
        {/* 클릭한 카드 여부에 따라서 */}
        {false ? (
          <></>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center m-5">
            <p className="text-gray-400">
              카드를 선택하면 미리보기가 표시됩니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;
