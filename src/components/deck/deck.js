function Deck({ data }) {
  /* title: "부산 지역 토기 모음",
    visibility: true,
    description: "부산 지역에서 발굴된 다양한 토기들의 아카이브",
    tags: ["토기", "부산", "고고학"],
    cardCount: 24,
    updated: "2일 전",
    author: "김박",
    image: null, */

  const recentData = data[0];

  return (
    <div className="deck_container">
      <img className="deck_img" src={recentData.img} alt="" />
      <div>{recentData.title}</div>
    </div>
  );
}

export default Deck;
