import "./MyDeck.css";

function MyDeck() {
  return (
    <div className="myDeck_container">
      <div className="myDeck_top">
        <div className="myDeck_discription">
          <p className="myDeck_discription_title">덱 관리</p>
          <p>카드들을 모아 덱을 만들고 다른 사용자와 공유해보세요.</p>
        </div>
        <div className="myDeck_menu">
          <div className="page_search_container">
            <div className="search_icon"></div>
            <input
              className="page_search_input"
              type="text"
              placeholder="덱 검색..."
            />
          </div>
          <button className="myDeck_filter_Btn">필터</button>
          <button className="myDeck_createNewDeck_Btn">+ 새 덱 만들기</button>
        </div>
        <div className="myDeck_tab_Btn"></div>
      </div>
      <div className="myDeck_bottom"></div>
    </div>
  );
}

export default MyDeck;
