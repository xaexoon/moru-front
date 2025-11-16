function Deck({ deckData }) {
  return (
    <div className="flex flex-row flex-wrap items-center content-start">
      {deckData.map((deck) => {
        return (
          <div
            className="w-[30%] h-[305px] border border-gray-200 rounded-xl overflow-hidden mr-[14px] cursor-default hover:shadow-lg"
            key={deck.title}
          >
            <img
              className="w-full h-[112px] object-cover bg-gray-100"
              src={deck.image}
              alt=""
            />
            <div className="flex flex-col m-[10px]">
              <div className="flex items-center justify-between mb-2">
                <div key={"deck title" + deck.title}>{deck.title}</div>
                {deck.visibility && (
                  <div className="text-xs py-[1px] px-2 border border-gray-300 rounded-lg">
                    공개
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-400 mb-3">
                {deck.description}
              </div>
              <div className="flex flex-row flex-wrap items-center content-start mb-2">
                {deck.tags.map((tag) => {
                  return (
                    <div
                      className="text-xs py-[2px] px-2 bg-gray-200 rounded-lg mr-1"
                      key={`${deck.title}_${tag}`}
                    >
                      {tag}
                    </div>
                  );
                })}
              </div>
              <div className="text-xs text-gray-500 flex text-center justify-between mb-2">
                <div>{deck.cardCount} 개 카드</div>
                <div>{deck.updated}</div>
              </div>
              <div className="flex flex-row items-center content-start w-full">
                {deck.author ? (
                  deck.author.map((author) => {
                    return (
                      <div
                        className="text-xs px-1 bg-gray-200 rounded-full mr-1"
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
