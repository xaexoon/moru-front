import "./Inventory.css";

function Inventory() {
  return (
    <div className="main_container">
      <div className="inventory_left">
        <div className="inventory_top">
          <div>
            <p>내 인벤토리</p>
            <p>작업용으로 모아둔 카드들을 관리하세요</p>
          </div>
          <div>
            <input type="checkbox" />
            <span>선택 모드</span>
          </div>
          <div>
            <input type="text" placeholder="인벤토리 내 검색..." />
            <button>최근 추가</button>
            <button>전체</button>
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
