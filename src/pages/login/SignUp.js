// src/pages/signup/SignUp.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignUp } from "../../hooks/useApi";
import AlarmModal from "../../components/AlarmModal";

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirm: "",
    name: "",
    nickname: "",
    job: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { mutate: signUp, isPending, isError, error } = useSignUp();

  // 비밀번호 유효성 검사
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return { minLength, hasSpecialChar, isValid: minLength && hasSpecialChar };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 비밀번호 유효성 검사
    if (!passwordValidation.isValid) {
      alert("비밀번호는 8자 이상, 특수문자 1개 이상 포함해야 합니다.");
      return;
    }

    // 비밀번호 확인
    if (formData.password !== formData.passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 직업 선택 확인
    if (!formData.job) {
      alert("직업을 선택해주세요.");
      return;
    }

    const requestData = {
      username: formData.username,
      password: formData.password,
      name: formData.name,
      nickname: formData.nickname,
      job: formData.job,
    };

    signUp(requestData, {
      onSuccess: (response) => {
        console.log("=== 회원가입 성공 ===");
        console.log("Response Data: ", response.data);
        setShowSuccessModal(true);
      },
      onError: (err) => {
        console.log("=== 회원가입 실패 ===");
        console.log("Error Message: ", err.message);
        console.log("Response Data: ", err.response?.data);
        console.log("Status: ", err.response?.status);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {/* 홈으로 가기 버튼 */}
        <button
          onClick={() => navigate("/feed")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          홈으로 가기
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-full"></div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          회원가입
        </h2>
        <p className="text-center text-gray-600 mb-8">
          새 계정을 만들어보세요
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error?.response?.data?.message || "회원가입에 실패하였습니다."}
            </div>
          )}

          {/* 아이디 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              아이디
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              name="username"
              placeholder="이메일 형식으로 입력하세요"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="8자 이상, 특수문자 1개 이상 포함"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {/* 비밀번호 조건 표시 */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                <p className={`text-xs flex items-center gap-1 ${passwordValidation.minLength ? "text-green-500" : "text-red-500"}`}>
                  {passwordValidation.minLength ? "✓" : "✗"} 8자 이상
                </p>
                <p className={`text-xs flex items-center gap-1 ${passwordValidation.hasSpecialChar ? "text-green-500" : "text-red-500"}`}>
                  {passwordValidation.hasSpecialChar ? "✓" : "✗"} 특수문자 1개 이상 포함
                </p>
              </div>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type={showPasswordConfirm ? "text" : "password"}
                name="passwordConfirm"
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswordConfirm ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {/* 비밀번호 일치 여부 표시 */}
            {formData.passwordConfirm && (
              <p className={`text-xs mt-1 ${formData.password === formData.passwordConfirm ? "text-green-500" : "text-red-500"}`}>
                {formData.password === formData.passwordConfirm ? "✓ 비밀번호가 일치합니다" : "✗ 비밀번호가 일치하지 않습니다"}
              </p>
            )}
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              name="name"
              placeholder="실명을 입력하세요"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              닉네임
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              type="text"
              name="nickname"
              placeholder="사용할 닉네임을 입력하세요"
              value={formData.nickname}
              onChange={handleChange}
              required
            />
          </div>

          {/* 직업 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              직업
            </label>
            <div className="flex gap-4">
              <label
                className={`flex-1 flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.job === "DESIGNER"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="job"
                  value="DESIGNER"
                  checked={formData.job === "DESIGNER"}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="font-medium">디자이너</span>
              </label>
              <label
                className={`flex-1 flex items-center justify-center px-4 py-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.job === "RESEARCHER"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name="job"
                  value="RESEARCHER"
                  checked={formData.job === "RESEARCHER"}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="font-medium">연구원</span>
              </label>
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:bg-blue-300"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "가입 중..." : "회원가입"}
          </button>
        </form>

        {/* 로그인 링크 */}
        <p className="text-center text-gray-600 mt-6">
          이미 계정이 있으신가요?{" "}
          <span
            className="text-blue-500 hover:text-blue-600 cursor-pointer font-medium"
            onClick={() => navigate("/login")}
          >
            로그인
          </span>
        </p>
      </div>

      {/* 회원가입 성공 모달 */}
      <AlarmModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate("/login");
        }}
        onConfirm={() => navigate("/login")}
        title="회원가입 완료"
        content="회원가입이 완료되었습니다. 로그인 페이지로 이동합니다."
        type="alarm"
        confirmText="확인"
      />
    </div>
  );
}

export default SignUp;