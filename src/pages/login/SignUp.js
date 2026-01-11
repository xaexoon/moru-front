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

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { mutate: signUp, isPending, isError, error } = useSignUp();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

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
                            placeholder="아이디를 입력하세요"
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
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="password"
                            name="password"
                            placeholder="비밀번호를 입력하세요"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            비밀번호 확인
                        </label>
                        <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            type="password"
                            name="passwordConfirm"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={formData.passwordConfirm}
                            onChange={handleChange}
                            required
                        />
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
                            placeholder="이름을 입력하세요"
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
                            placeholder="닉네임을 입력하세요"
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