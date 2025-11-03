import "../MyDeck.css";

function SharedDeckTab() {
  return (
    <>
      <div className="myDeck_bottom_noting">
        <div></div>
        <div className="myDeck_bottom_noting_title">공유받은 덱이 없습니다</div>
        <div className="myDeck_bottom_noting_description">
          다른 사용자가 공유한 덱이 여기에 표시됩니다.
        </div>
        <button className="myDeck_bottom_noting_btn">공개 덱 탐색하기</button>
      </div>
    </>
  );
}

export default SharedDeckTab;
