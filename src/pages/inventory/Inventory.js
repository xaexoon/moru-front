import Dropdown from "../../components/dropdown/Dropdown";
import "./Inventory.css";

const sortData = ["최근추가", "자주사용", "제목순"];
const categortData = ["전체", "내 카드", "참조 카드"];

function Inventory() {
  const handleSortChange = (value) => console.log("sort:", value);
  const handleCategoryChange = (value) => console.log("category:", value);

  return (
    <div className="main_container">
      <div className="inventory_left">
        <div className="inventory_top">
          <div className="inventory_discription">
            <div className="inventory_top_left">
              <p>내 인벤토리</p>
              <p>작업용으로 모아둔 카드들을 관리하세요</p>
            </div>
            <div className="inventory_top_right">
              <div className="inventory_selectmode_btn">
                <input type="checkbox" id="selectMode" />
                <label for="selectMode"></label>
                <span>선택 모드</span>
              </div>
            </div>
          </div>
          <div className="inventory_menu">
            <div className="inventory_search_container">
              <div className="search_icon"></div>
              <input
                className="inventory_search_input"
                type="text"
                placeholder="인벤토리 내 검색..."
              />
            </div>
            <div className="inventory_sort_container">
              <Dropdown options={sortData} onChange={handleSortChange} />
            </div>
            <div className="inventory_category_container">
              <Dropdown
                options={categortData}
                onChange={handleCategoryChange}
              />
            </div>
          </div>
        </div>
        <div className="inventory_bottom">
          {false ? (
            <></>
          ) : (
            <>
              <p>인벤토리가 비어있습니다</p>
              <p>카드 피드에서 카드를 추가하여 작업용 인벤토리를 구성하세요</p>
            </>
          )}
        </div>
      </div>
      <div className="inventory_right">
        <p>카드를 선택하면 미리보기가 표시됩니다</p>
      </div>
    </div>
  );
}

export default Inventory;
