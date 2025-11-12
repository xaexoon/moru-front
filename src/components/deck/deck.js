import "./Deck.css";

function Deck({ deckData }) {
  return (
    <div className="deck_list">
      {deckData.map((deck) => {
        return (
          <div className="deck_list_item" key={deck.title}>
            <img className="deck_img" src={deck.image} alt="" />
            <div className="deck_detail">
              <div className="deck_detail_title">
                <div key={"deck title" + deck.title}>{deck.title}</div>
                {deck.visibility && (
                  <div className="deck_detail_visibility">공개</div>
                )}
              </div>
              <div className="deck_detail_description">{deck.description}</div>
              <div className="deck_detail_tags">
                {deck.tags.map((tag) => {
                  return (
                    <div
                      className="deck_detail_tags_item"
                      key={`${deck.title}_${tag}`}
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
              <div className="deck_detail_etc">
                <div>{deck.cardCount} 개 카드</div>
                <div>{deck.updated}</div>
              </div>
              <div className="deck_detail_author">
                {deck.author ? (
                  deck.author.map((author) => {
                    return (
                      <div
                        className="deck_detail_author_name"
                        key={`${deck.title}_${author}`}
                      >
                        {author}
                      </div>
                    );
                  })
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Deck;
