/* eslint-disable react/react-in-jsx-scope */
import Deck from "../../../components/deck/Deck";

import { ReactComponent as ExportIcon } from "../../../assets/myDeck/export.svg";
import { ReactComponent as ShareIcon } from "../../../assets/myDeck/share.svg";

const myDeckData = [
  {
    title: "부산 지역 토기 모음",
    visibility: true,
    description: "부산 지역에서 발굴된 다양한 토기들의 아카이브",
    tags: ["토기", "부산", "고고학"],
    cardCount: 24,
    updated: "2일 전",
    author: ["김", "박"],
    image: null,
  },
  {
    title: "한국 전통 문양 패턴",
    visibility: false,
    description: "한국 전통 문양들의 기하학적 패턴 연구",
    tags: ["문양", "패턴", "전통"],
    cardCount: 18,
    updated: "1주 전",
    author: null,
    thumbnail: null,
  },
];

function MyDeckTab() {
  return (
    <>
      <div className="flex justify-between items-center w-full text-base mb-6">
        <p>내가 만든 덱</p>
        <div>
          <button className="text-sm w-[125px] h-[27px] border border-gray-200 rounded-md mr-2 hover:bg-gray-200">
            <div className="flex items-center justify-center">
              <ExportIcon className="mr-2" />
              <p>전체 내보내기</p>
            </div>
          </button>
          <button className="text-sm w-[100px] h-[27px] border border-gray-200 rounded-md mr-2 py-[1px] hover:bg-gray-200">
            <div className="flex items-center justify-center">
              <ShareIcon className="mr-2" />
              <p>일괄 공유</p>
            </div>
          </button>
        </div>
      </div>
      <Deck deckData={myDeckData} />
    </>
  );
}

export default MyDeckTab;
