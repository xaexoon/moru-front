import { useState } from "react";

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
    <div className="w-full min-h-full flex flex-col flex-1 p-6">
      {/* Top Section */}
      <div className="w-full flex flex-col">
        <div className="w-full h-full">
          <p className="py-1 text-xl mb-2">덱 관리</p>
          <p className="text-sm text-gray-500 mb-6">
            카드들을 모아 덱을 만들고 다른 사용자와 공유해보세요.
          </p>
        </div>
        {/* Menu */}
        <div className="flex items-center w-full">
          <div className="flex-1 max-w-[392px] h-[31px] rounded-lg flex items-center bg-gray-100 focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 mr-3">
            <div className="search_icon"></div>
            <input
              className="w-full h-full border-none bg-transparent focus:outline-none text-sm"
              type="text"
              placeholder="덱 검색..."
            />
          </div>
          <button className="w-[65px] h-[27px] text-sm border border-gray-200 rounded-md hover:bg-gray-200 mr-3">
            필터
          </button>
          <button className="w-[120px] h-[30px] text-sm rounded-md bg-black text-white">
            + 새 덱 만들기
          </button>
        </div>
        {/* Tab Menu */}
        <div className="my-5">
          <ul className="h-[34px] w-[205px] flex items-center justify-around rounded-2xl bg-gray-200 text-sm">
            {MY_DECK_TAB.map((tab) => (
              <li
                key={tab.id}
                className={`py-1 px-2 rounded-xl cursor-default ${
                  tab.id === activeTab ? "bg-white" : ""
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Bottom Section */}
      <div className="w-full h-full">
        {activeTab === "myDeck" && <MyDeckTab />}
        {activeTab === "releasedDeck" && <ReleasedDeckTab />}
        {activeTab === "sharedDeck" && <SharedDeckTab />}
      </div>
    </div>
  );
}

export default MyDeck;
