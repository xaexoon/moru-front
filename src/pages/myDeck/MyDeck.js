import { useState } from "react";

import "./MyDeck.css";
import Deck from "../../components/deck/deck";

const TABS = [
  { title: "내 덱", id: "myDeck" },
  { title: "공개 덱", id: "publicDeck" },
  { title: "공유받은 덱", id: "sharedDeck" },
];

const DECK = [
  {
    title: "부산 지역 토기 모음",
    visibility: true,
    description: "부산 지역에서 발굴된 다양한 토기들의 아카이브",
    tags: ["토기", "부산", "고고학"],
    cardCount: 24,
    updated: "2일 전",
    author: "김박",
    image: null,
  },
  {
    title: "한국 전통 문양 패턴",
    visibility: "공개",
    description: "한국 전통 문양들의 기하학적 패턴 연구",
    tags: ["문양", "패턴", "전통"],
    cardCount: 18,
    updated: "1주 전",
    author: null,
    thumbnail: null,
  },
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
            {TABS.map((tab) => (
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
        {activeTab === "myDeck" && <Deck data={DECK} />}
        {activeTab === "publicDeck" && <>공개 덱</>}
        {activeTab === "sharedDeck" && <>공유 받은 덱</>}
      </div>
    </div>
  );
}

export default MyDeck;
