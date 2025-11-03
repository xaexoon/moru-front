/* eslint-disable no-constant-condition */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import Dropdown from "../../components/dropdown/Dropdown";
import "./Inventory.css";

const SORT_OPTION_DATA = ["최근추가", "자주사용", "제목순"];
const CATEGORY_OPTION_DATA = ["전체", "내 카드", "참조 카드"];

function Inventory() {
  const handleSortChange = (value) => console.log("sort:", value);
  const handleCategoryChange = (value) => console.log("category:", value);

  return (
    <div className="inventory_container">
      <div className="inventory_left">
        <div className="inventory_top">
          <div className="inventory_description">
            <div className="inventory_top_left">
              <p>내 인벤토리</p>
              <p>작업용으로 모아둔 카드들을 관리하세요</p>
            </div>
            <div className="inventory_top_right">
              <div className="inventory_selectmode_btn">
                <input type="checkbox" id="selectMode" />
                <label htmlFor="selectMode"></label>
                <span>선택 모드</span>
              </div>
            </div>
          </div>
          <div>
            <div className="inventory_menu">
              <div className="page_search_container">
                <div className="search_icon"></div>
                <input
                  className="page_search_input"
                  type="text"
                  placeholder="인벤토리 내 검색..."
                />
              </div>
              <div className="inventory_sort_container">
                <Dropdown
                  options={SORT_OPTION_DATA}
                  onChange={handleSortChange}
                />
              </div>
              <div className="inventory_category_container">
                <Dropdown
                  options={CATEGORY_OPTION_DATA}
                  onChange={handleCategoryChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="inventory_bottom">
          {/* 받아온 데이터 여부에 따라서 */}
          {false ? (
            <></>
          ) : (
            <div className="inventory_no_data">
              <div className="no_data_icon"></div>
              <p>인벤토리가 비어있습니다</p>
              <p>카드 피드에서 카드를 추가하여 작업용 인벤토리를 구성하세요</p>
            </div>
          )}
        </div>
      </div>
      <div className="inventory_right">
        {/* 클릭한 카드 여부에 따라서 */}
        {false ? (
          <></>
        ) : (
          <div className="inventory_no_data">
            <p>카드를 선택하면 미리보기가 표시됩니다</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;
