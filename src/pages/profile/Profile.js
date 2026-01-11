import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetMyInfo, useUpdateMyInfo, useChangePassword } from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import PasswordModal from "./PasswordModal";

function Profile() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    nickname: "",
    organization: "",
    introduction: "",
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // 내 정보 조회
  const { data: userInfo, isLoading: userLoading } = useGetMyInfo({
    enabled: isAuthenticated,
  });

  // 프로필 수정
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateMyInfo();

  // 비밀번호 변경
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  const user = userInfo?.data?.data;

  // 유저 정보가 로드되면 폼에 반영
  useEffect(() => {
    if (user) {
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

  // 비밀번호 변경
  const handlePasswordChange = (passwordData) => {
    changePassword(passwordData, {
      onSuccess: () => {
        alert("비밀번호가 변경되었습니다.");
        setIsPasswordModalOpen(false);
      },
      onError: (err) => {
        alert("비밀번호 변경 실패: " + (err.response?.data?.message || err.message));
      },
    });
  };

  // 로딩 상태
  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 비로그인 상태
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <div className="max-w-[2400px] mx-auto px-10 py-8">
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <p className="text-gray-500 text-lg mb-2">로그인이 필요합니다</p>
            <p className="text-gray-400 text-sm mb-4">프로필을 보려면 로그인해주세요.</p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-[2400px] mx-auto px-10 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">프로필</h1>
          <p className="text-sm text-gray-500">프로필 정보를 확인하고 수정할 수 있습니다</p>
        </div>

        {/* 프로필 컨텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 프로필 카드 */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full flex flex-col">
              {/* 프로필 이미지 */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {formData.nickname?.charAt(0) || "U"}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{formData.nickname || "이름 없음"}</h2>
                <p className="text-sm text-gray-500 mt-1">{formData.organization || "소속 없음"}</p>
              </div>

              {/* 소개 */}
              {formData.introduction && (
                <div className="mb-6 px-2">
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    {formData.introduction}
                  </p>
                </div>
              )}

              {/* 구분선 */}
              <div className="border-t border-gray-100 my-4"></div>

              {/* 정보 목록 */}
              <div className="flex-1 flex flex-col justify-around">
                <div className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">이메일</p>
                    <p className="text-sm text-gray-900 truncate">{user?.username || "이메일 없음"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">소속</p>
                    <p className="text-sm text-gray-900 truncate">{formData.organization || "소속 없음"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 mb-0.5">계정 상태</p>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <p className="text-sm text-gray-900">인증됨</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 프로필 수정 폼 */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">프로필 수정</h3>

              <div className="space-y-5 flex-1">
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>

              {/* 버튼 영역 */}
              <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-6 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors font-medium"
                  >
                    비밀번호 변경
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || isUpdating}
                    className="px-6 py-2.5 bg-black text-white rounded-lg text-sm hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isUpdating ? "저장 중..." : "저장"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 비밀번호 변경 모달 */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
        isLoading={isChangingPassword}
      />
    </div>
  );
}

export default Profile;