import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyInfo, useUpdateMyInfo, useGetCards } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";

function Profile() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [activeTab, setActiveTab] = useState("created");
    const [sortOrder, setSortOrder] = useState("latest");
    const [viewMode, setViewMode] = useState("grid");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({ nickname: "", email: "" });

    // 내 정보 조회
    const { data: userInfo, isLoading: userLoading } = useGetMyInfo({
        enabled: isAuthenticated,
    });

    // 내 카드 조회
    const { data: cardsData, isLoading: cardsLoading } = useGetCards({
        enabled: isAuthenticated,
    });

    // 프로필 수정
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyInfo();

    const user = userInfo?.data?.data;
    const cards = cardsData?.data?.data || [];
    const myCards = cards.filter((card) => card.userId === user?.userId);

    console.log("=== 유저 정보 ===", user);
    console.log("=== 내 카드 ===", myCards);

    const openEditModal = () => {
        setEditForm({
            nickname: user?.nickname || "",
            organization: user?.organization || "",
            introduction: user?.introduction || "",
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateProfile = () => {
        updateProfile(editForm, {
            onSuccess: () => {
                alert("프로필이 수정되었습니다.");
                setIsEditModalOpen(false);
            },
            onError: (err) => {
                alert("프로필 수정 실패: " + err.message);
            },
        });
    };

    if (authLoading || userLoading) {
        return (
            <div className="w-full min-h-full bg-white flex items-center justify-center">
                <p>로딩 중...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="w-full min-h-full bg-white flex items-center justify-center flex-col gap-4">
                <p>로그인이 필요합니다.</p>
                <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 bg-black text-white rounded-xl"
                >
                    로그인하기
                </button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-full bg-white">
            {/* 프로필 헤더 */}
            <div className="flex justify-center px-10 py-8">
                <div className="w-full max-w-[900px] bg-[#fafafa] rounded-2xl p-8">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                                {user?.nickname?.charAt(0) || "U"}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-xl font-bold">{user?.nickname || "사용자"}</h2>
                                    <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded">
                                        인증됨
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm">{user?.email || "이메일 없음"}</p>
                            </div>
                        </div>
                        <button
                            onClick={openEditModal}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                        >
                            ✏️ 프로필 편집
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mt-8">
                        <div className="text-center p-4 bg-white rounded-xl">
                            <p className="text-gray-500 text-sm mb-1">📄 생성한 카드</p>
                            <p className="text-2xl font-bold">{myCards.length}</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl">
                            <p className="text-gray-500 text-sm mb-1">❤️ 총 좋아요</p>
                            <p className="text-2xl font-bold">
                                {myCards.reduce((sum, card) => sum + (card.likeCount || 0), 0)}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl">
                            <p className="text-gray-500 text-sm mb-1">👁 총 조회수</p>
                            <p className="text-2xl font-bold">
                                {myCards.reduce((sum, card) => sum + (card.viewCount || 0), 0)}
                            </p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-xl">
                            <p className="text-gray-500 text-sm mb-1">🔗 총 연결</p>
                            <p className="text-2xl font-bold">
                                {myCards.reduce((sum, card) => sum + (card.tagCount || 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 탭 메뉴 */}
            <div className="flex justify-center px-10">
                <div className="w-full max-w-[900px] border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab("created")}
                            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === "created"
                                ? "text-black border-b-2 border-black"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            📄 생성한 카드 ({myCards.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("collected")}
                            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === "collected"
                                ? "text-black border-b-2 border-black"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            📥 수집한 카드 (0)
                        </button>
                        <button
                            onClick={() => setActiveTab("activity")}
                            className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === "activity"
                                ? "text-black border-b-2 border-black"
                                : "text-gray-400 hover:text-gray-600"
                                }`}
                        >
                            📋 활동 내역
                        </button>
                    </div>
                </div>
            </div>

            {/* 필터 & 정렬 */}
            <div className="flex justify-center px-10 py-4">
                <div className="w-full max-w-[900px] flex items-center justify-between">
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm"
                    >
                        <option value="latest">최신순</option>
                        <option value="popular">인기순</option>
                        <option value="views">조회순</option>
                    </select>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"
                                }`}
                        >
                            ▦
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg ${viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"
                                }`}
                        >
                            ☰
                        </button>
                    </div>
                </div>
            </div>

            {/* 카드 목록 */}
            <div className="flex justify-center px-10 py-4">
                <div className="w-full max-w-[900px]">
                    {activeTab === "created" && (
                        <>
                            {cardsLoading ? (
                                <p className="text-center py-10 text-gray-400">불러오는 중...</p>
                            ) : myCards.length === 0 ? (
                                <p className="text-center py-10 text-gray-400">
                                    생성한 카드가 없습니다.
                                </p>
                            ) : (
                                <div className="grid grid-cols-4 gap-4">
                                    {myCards.map((card) => (
                                        <div
                                            key={card.cardId}
                                            onClick={() => navigate(`/feed/${card.cardId}`)}
                                            className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                                        >
                                            <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                                                {card.imageUrl ? (
                                                    <img
                                                        src={card.imageUrl}
                                                        alt={card.cardName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-gray-300 text-4xl">🖼</span>
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <p className="font-medium text-sm truncate">
                                                    {card.cardName}
                                                </p>
                                                <div className="flex gap-3 text-gray-400 text-xs mt-1">
                                                    <span>♡ {card.likeCount}</span>
                                                    <span>👁 {card.viewCount}</span>
                                                    <span># {card.tagCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === "collected" && (
                        <p className="text-center py-10 text-gray-400">
                            수집한 카드가 없습니다.
                        </p>
                    )}

                    {activeTab === "activity" && (
                        <p className="text-center py-10 text-gray-400">
                            활동 내역이 없습니다.
                        </p>
                    )}
                </div>
            </div>

            {/* 프로필 편집 모달 */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
                        {/* 닫기 버튼 */}
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
                        >
                            ✕
                        </button>

                        <h3 className="text-xl font-bold mb-1">프로필 편집</h3>
                        <p className="text-gray-500 text-sm mb-6">프로필 정보를 수정할 수 있습니다</p>

                        <div className="space-y-5">
                            {/* 이름 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    이름 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={editForm.nickname}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, nickname: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            {/* 소속 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    소속
                                </label>
                                <input
                                    type="text"
                                    value={editForm.organization || ""}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, organization: e.target.value })
                                    }
                                    placeholder="소속을 입력하세요 (예: 국립중앙박물관)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            {/* 소개 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    소개
                                </label>
                                <textarea
                                    value={editForm.introduction || ""}
                                    onChange={(e) =>
                                        setEditForm({ ...editForm, introduction: e.target.value })
                                    }
                                    placeholder="간단한 소개를 입력하세요"
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                />
                            </div>
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleUpdateProfile}
                                disabled={isUpdating}
                                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-purple-300 text-sm flex items-center gap-2"
                            >
                                💾 {isUpdating ? "저장 중..." : "저장"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;