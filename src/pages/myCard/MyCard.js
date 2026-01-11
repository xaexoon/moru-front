import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMyCards } from '../../hooks/useApi';

const MyCard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('최근 생성순');
  const [searchQuery, setSearchQuery] = useState('');

  // 내 카드 목록 조회
  const { data: myCardsData, isLoading, isError, error } = useGetMyCards();

  // 카드 데이터 추출
  const cards = myCardsData?.data?.data || [];
  const totalCards = cards.length;

  // 검색 필터링
  const filteredCards = cards.filter(card =>
    card.cardName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 정렬
  const sortedCards = [...filteredCards].sort((a, b) => {
    switch (sortBy) {
      case '최근 생성순':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case '오래된순':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case '이름순':
        return a.cardName.localeCompare(b.cardName);
      case '좋아요순':
        return (b.likeCount || 0) - (a.likeCount || 0);
      default:
        return 0;
    }
  });

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">카드를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500">에러 발생: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-[2400px] mx-auto px-10 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">내 카드 컬렉션</h1>
          <p className="text-sm text-gray-500">내가 생성한 카드 {totalCards}개</p>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="카드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option>최근 생성순</option>
              <option>오래된순</option>
              <option>이름순</option>
              <option>좋아요순</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
            >
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="1" width="6" height="6" rx="1" />
                <rect x="9" y="1" width="6" height="6" rx="1" />
                <rect x="1" y="9" width="6" height="6" rx="1" />
                <rect x="9" y="9" width="6" height="6" rx="1" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 border-l border-gray-200 ${viewMode === 'list' ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'}`}
            >
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 16 16">
                <rect x="1" y="2" width="14" height="2" rx="0.5" />
                <rect x="1" y="7" width="14" height="2" rx="0.5" />
                <rect x="1" y="12" width="14" height="2" rx="0.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'all'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            전체 ({totalCards})
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === 'favorites'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            즐겨찾기 (0)
          </button>
        </div>

        {/* 카드가 없을 때 */}
        {sortedCards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">카드가 없습니다</p>
            <p className="text-gray-400 text-sm mb-4">새 카드를 만들어보세요!</p>
            <button
              onClick={() => navigate('/createCard')}
              className="px-6 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              카드 만들기
            </button>
          </div>
        ) : (
          /* Card Grid - Masonry Style */
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6 gap-4 space-y-4">
            {sortedCards.map((card) => (
              <div
                key={card.cardId || card.id}
                className="break-inside-avoid group cursor-pointer"
                onClick={() => {
                  console.log("클릭한 카드:", card);
                  console.log("cardId:", card.cardId);
                  console.log("id:", card.id);
                  navigate(`/myCard/${card.cardId || card.id}`);
                }}
              >
                <div className="relative rounded-lg overflow-hidden bg-gray-100 transition-shadow hover:shadow-lg">
                  {card.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={card.cardName}
                      className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full aspect-[3/4] bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
                      이미지 없음
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* 공개/비공개 뱃지 */}
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${card.status === 'PUBLIC'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-500 text-white'
                      }`}>
                      {card.status === 'PUBLIC' ? '공개' : '비공개'}
                    </span>
                  </div>

                  {/* Card Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-sm font-medium mb-1 truncate">{card.cardName}</h3>
                    <div className="flex items-center gap-3 text-white/80 text-xs">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {card.likeCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {card.viewCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>#</span>
                        {card.tagCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCard;