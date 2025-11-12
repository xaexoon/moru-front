/* eslint-disable react/react-in-jsx-scope */
import "../MyDeck.css";
import Deck from "../../../components/deck/Deck";

const sharedDeckData = [
  {
    title: "조선시대 백자 컬렉션",
    visibility: true,
    description: "조선시대 백자들의 형태와 문양 분석",
    tags: ["백자", "조선", "도자기"],
    cardCount: 32,
    updated: "3일 전",
    author: ["이", "최"],
    image: null,
  },
  {
    title: "한글 타이포그래피 변천사",
    visibility: true,
    description: "시대별 한글 글꼴의 변화 과정",
    tags: ["한글", "타이포그래피", "디자인"],
    cardCount: 45,
    updated: "5일 전",
    author: ["백", "최"],
    image: null,
  },
];

function ReleasedDeckTab() {
  return (
    <>
      <div className="myDeck_bottom_title">
        <p>공개 덱 탐색</p>
        <div>
          <button className="myDeck_bottom_sort_btn">인기순</button>
          <button className="myDeck_bottom_sort_btn">최신순</button>
        </div>
      </div>
      <Deck deckData={sharedDeckData} />
    </>
  );
}

export default ReleasedDeckTab;
