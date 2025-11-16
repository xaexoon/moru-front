function SharedDeckTab() {
  return (
    <>
      <div className="w-full h-full pt-4 flex flex-col items-center text-base">
        <div></div>
        <div className="mb-2">공유받은 덱이 없습니다</div>
        <div className="text-gray-400 mb-4">
          다른 사용자가 공유한 덱이 여기에 표시됩니다.
        </div>
        <button className="text-sm w-[125px] h-[35px] border border-gray-200 rounded-md text-gray-700">
          공개 덱 탐색하기
        </button>
      </div>
    </>
  );
}

export default SharedDeckTab;
