import "./Deck.css";

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
    <div className="deck_list">
      <div className="deck_list_item">
        <img className="deck_img" src={recentData.image} alt="" />
        <div className="deck_detail">
          <div className="deck_detail_title">
            <div>{recentData.title}</div>
            {recentData.visibility && (
              <div className="deck_detail_visibility">공개</div>
            )}
          </div>
          <div className="deck_detail_description">
            {recentData.description}
          </div>
          <div className="deck_detail_tags">
            {recentData.tags.map((tag) => {
              return <div className="deck_detail_tags_item">{tag}</div>;
            })}
          </div>
          <div className="deck_detail_etc">
            <div>{recentData.cardCount} 개 카드</div>
            <div>{recentData.updated}</div>
          </div>
          <div className="deck_detail_author">
            {recentData.author.map((author) => {
              return <div className="deck_detail_author_name">{author}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deck;
