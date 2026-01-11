import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyInfo, useUpdateMyInfo } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";

function Profile() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [formData, setFormData] = useState({
        nickname: "",
        organization: "",
        introduction: "",
    });
    const [hasChanges, setHasChanges] = useState(false);

    // 내 정보 조회
    const { data: userInfo, isLoading: userLoading } = useGetMyInfo({
        enabled: isAuthenticated,
    });

    // 프로필 수정
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyInfo();

    const user = userInfo?.data?.data;

    // 콘솔 로그 추가
    console.log("=== userInfo 원본 ===", userInfo);
    console.log("=== userInfo.data ===", userInfo?.data);
    console.log("=== userInfo.data.data (user) ===", user);

    // 유저 정보가 로드되면 폼에 반영
    useEffect(() => {
        if (user) {
            console.log("=== useEffect에서 user 데이터 ===", user);
            setFormData({
                nickname: user.nickname || "",
                organization: user.organization || "",
                introduction: user.introduction || "",
            });
        }
    }, [user]);

    // 폼 데이터 변경 감지
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    // 프로필 저장
    const handleSave = () => {
        if (!formData.nickname.trim()) {
            alert("이름을 입력해주세요.");
            return;
        }

        console.log("=== 저장할 formData ===", formData);

        updateProfile(formData, {
            onSuccess: () => {
                alert("프로필이 수정되었습니다.");
                setHasChanges(false);
            },
            onError: (err) => {
                alert("프로필 수정 실패: " + err.message);
            },
        });
    };

    if (authLoading || userLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">로딩 중...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <div className="text-gray-500">로그인이 필요합니다.</div>
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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* 프로필 헤더 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
                    <div className="flex items-center gap-6 mb-8">
                        {/* 프로필 이미지 */}
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {formData.nickname?.charAt(0) || "U"}
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">프로필 수정</h1>
                            <p className="text-gray-500 mt-1">프로필 정보를 수정할 수 있습니다</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-sm text-gray-500">{user?.email || "이메일 없음"}</span>
                                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                                    인증됨
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 폼 필드들 */}
                    <div className="space-y-6">
                        {/* 이름 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                이름 <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.nickname}
                                onChange={(e) => handleChange("nickname", e.target.value)}
                                placeholder="이름을 입력하세요"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* 소속 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                소속
                            </label>
                            <input
                                type="text"
                                value={formData.organization}
                                onChange={(e) => handleChange("organization", e.target.value)}
                                placeholder="소속을 입력하세요 (예: 국립중앙박물관)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* 소개 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                소개
                            </label>
                            <textarea
                                value={formData.introduction}
                                onChange={(e) => handleChange("introduction", e.target.value)}
                                placeholder="간단한 소개를 입력하세요"
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* 버튼 영역 */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
    <button
        onClick={() => navigate(-1)}
        className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium"
    >
        ← 뒤로가기
    </button>
    
    <div className="flex gap-3">
        <button
            onClick={() => navigate("/change-password")}
            className="px-8 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all font-medium"
        >
            비밀번호 변경
        </button>
        <button
            onClick={handleSave}
            disabled={!hasChanges || isUpdating}
            className="px-8 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
        >
            {isUpdating ? (
                <>
                    <span className="animate-spin">⏳</span>
                    저장 중...
                </>
            ) : (
                "저장"
            )}
        </button>
    </div>
</div>
                </div>
            </div>
        </div>
    );
}

export default Profile;