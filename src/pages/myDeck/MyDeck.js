import { useState } from "react";

import "./MyDeck.css";
import MyDeckTab from "./tabs/MyDeckTab";
import ReleasedDeckTab from "./tabs/ReleasedDeckTab";
import SharedDeckTab from "./tabs/SharedDeckTab";

const MY_DECK_TAB = [
  { title: "내 덱", id: "myDeck" },
  { title: "공개 덱", id: "releasedDeck" },
  { title: "공유받은 덱", id: "sharedDeck" },
];

function MyDeck() {
  const [activeTab, setActiveTab] = useState("myDeck");

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
        <div className="myDeck_tab_container">
          <ul className="myDeck_tab_list">
            {MY_DECK_TAB.map((tab) => (
              <li
                key={tab.id}
                className="myDeck_tab_item"
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="myDeck_bottom">
        {activeTab === "myDeck" && <MyDeckTab />}
        {activeTab === "releasedDeck" && <ReleasedDeckTab />}
        {activeTab === "sharedDeck" && <SharedDeckTab />}
      </div>
    </div>
  );
}

export default MyDeck;
