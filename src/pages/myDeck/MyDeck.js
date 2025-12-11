import { useState } from "react";

import MyDeckTab from "./tabs/MyDeckTab";
import ReleasedDeckTab from "./tabs/ReleasedDeckTab";
import SharedDeckTab from "./tabs/SharedDeckTab";
import { ReactComponent as NewIcon } from "../../assets/dataFields/new.svg";
import { ReactComponent as SearchIcon } from "../../assets/myDeck/search.svg";

import { useGetAllDecks } from "../../hooks/useApi";

const MY_DECK_TAB = [
  { title: "내 덱", id: "myDeck" },
  { title: "공개 덱", id: "releasedDeck" },
  { title: "공유받은 덱", id: "sharedDeck" },
];

function MyDeck() {
  const [activeTab, setActiveTab] = useState("myDeck");

  // const { data, isLoading, isError, error, refetch } = useGetAllDecks({
  //   onSuccess: (response) => {
  //     console.log("Decks fetch success");
  //     console.log("Status:", response.status);
  //     console.log("Data:", response.data);

  //     const decks = response.data.data;
  //     console.log("Deck list:", decks);
  //   },
  //   onError: (err) => {
  //     console.log("Decks fetch failed");
  //     console.log("Error message:", err.message);
  //     console.log("Error code:", err.code);
  //     console.log("Response status:", err.response?.status);
  //     console.log("Response data:", err.response?.data);
  //   },
  // });

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
            <SearchIcon className="text-gray-500 m-3" />
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
            <div className="flex items-center justify-center">
              <NewIcon className="w-4 text-white mr-2" />
              <p>새 덱 만들기</p>
            </div>
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
