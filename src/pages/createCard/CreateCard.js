import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCard, useGetDatafieldList } from "../../hooks/useApi";

import { ReactComponent as ImgIcon } from "../../assets/createCard/image.svg";

function CreateCard() {
  const navigate = useNavigate();

  const [previewImg, setPreviewImg] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // 폼 데이터
  const [formData, setFormData] = useState({
    cardName: "",
    dataFieldId: null,
    status: "PUBLIC",
  });

  // 카드 생성 mutation
  const { mutate: createCard, isPending: isCreating } = useCreateCard();

  // 데이터필드 목록 조회
  const { data: datafieldData, isLoading: isDatafieldLoading } = useGetDatafieldList();

  // 데이터필드 옵션 변환
  const dataFieldOptions = datafieldData?.data?.data?.dataFields?.map(field => ({
    value: field.id,
    label: field.name,
  })) || [];

  // react-select 커스텀 스타일
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "2px 4px",
      borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
      borderRadius: "8px",
      fontSize: "14px",
      minHeight: "42px",
      boxShadow: "none",
      backgroundColor: state.isFocused ? "white" : "#f9fafb",
      "&:hover": {
        borderColor: "#3b82f6",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      fontSize: "14px",
      border: "1px solid #e5e7eb",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      marginTop: "4px",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "4px 0",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "10px 12px",
      fontSize: "14px",
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
          ? "#eff6ff"
          : "white",
      color: state.isSelected ? "white" : "#374151",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "14px",
      color: "#374151",
    }),
    placeholder: (provided) => ({
      ...provided,
      fontSize: "14px",
      color: "#9ca3af",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#3b82f6",
      },
    }),
  };

  // 이미지 업로드 (단일)
  const handleImgUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreviewImg(previewUrl);
    setImageFile(file);
  };

  // 이미지 삭제
  const handleImgRemove = () => {
    if (previewImg) {
      URL.revokeObjectURL(previewImg);
    }
    setPreviewImg(null);
    setImageFile(null);
  };

  // 입력값 변경
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 데이터필드 변경
  const handleDataFieldChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      dataFieldId: selectedOption.value,
    }));
  };

  const handleSubmit = () => {
    // 유효성 검사
    if (!imageFile) {
      alert("대표 이미지를 업로드해주세요.");
      return;
    }

    if (!formData.cardName.trim()) {
      alert("카드 이름을 입력해주세요.");
      return;
    }

    if (!formData.dataFieldId) {
      alert("데이터 필드를 선택해주세요.");
      return;
    }

    // FormData 생성
    const submitFormData = new FormData();

    const cardCreateRequestDto = {
      cardName: formData.cardName,
      status: formData.status,
      dataFieldId: formData.dataFieldId,
    };

    submitFormData.append(
      "cardCreateRequestDto",
      new Blob([JSON.stringify(cardCreateRequestDto)], { type: "application/json" })
    );

    submitFormData.append("multipartFile", imageFile);

    createCard(
      { formData: submitFormData },
      {
        onSuccess: (response) => {
          alert("카드가 성공적으로 생성되었습니다!");
          console.log("생성된 카드:", response);
          navigate("/feed");
        },
        onError: (error) => {
          console.error("카드 생성 실패:", error);
          alert("카드 생성에 실패했습니다: " + (error.response?.data?.message || error.message));
        },
      }
    );
  };

  // 현재 시간 포맷
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleString("ko-KR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="max-w-[2400px] mx-auto px-10 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">새 카드 만들기</h1>
          <p className="text-sm text-gray-500">
            필수 정보를 입력하여 카드를 생성하고, 필요한 경우 확장 데이터를 추가할 수 있습니다.
          </p>
        </div>

        {/* 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 입력 폼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 필수 정보 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                필수 정보
              </h3>

              <div className="space-y-5">
                {/* 대표 이미지 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    대표 이미지 <span className="text-red-500">*</span>
                  </label>

                  {!previewImg ? (
                    <div>
                      <input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        id="mainImgUpload"
                        onChange={handleImgUpload}
                      />
                      <label
                        htmlFor="mainImgUpload"
                        className="flex items-center justify-center h-[120px] border-2 border-dashed border-gray-300 rounded-lg cursor-pointer transition-all hover:bg-gray-50 hover:border-blue-500"
                      >
                        <div className="flex flex-col items-center text-gray-400">
                          <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm">클릭하여 이미지 업로드</span>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <div className="relative w-[120px] h-[120px]">
                        <img
                          src={previewImg}
                          alt="대표 이미지"
                          className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={handleImgRemove}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-sm font-bold hover:bg-red-600 transition-colors flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        이미지를 변경하려면 삭제 후 다시 업로드하세요.
                      </p>
                    </div>
                  )}
                </div>

                {/* 카드 이름 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    카드 이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleInputChange}
                    placeholder="카드 이름을 입력하세요"
                  />
                </div>

                {/* 데이터 필드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    데이터 필드 <span className="text-red-500">*</span>
                  </label>
                  <Select
                    options={dataFieldOptions}
                    isSearchable={false}
                    placeholder={isDatafieldLoading ? "로딩 중..." : "데이터 필드를 선택하세요"}
                    styles={customSelectStyles}
                    onChange={handleDataFieldChange}
                    isDisabled={isDatafieldLoading}
                    noOptionsMessage={() => "데이터 필드가 없습니다. 먼저 생성해주세요."}
                  />
                </div>

                {/* 공개 여부 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    공개 여부 <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3">
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-all text-sm ${
                        formData.status === "PUBLIC"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="PUBLIC"
                        checked={formData.status === "PUBLIC"}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">전체공개</span>
                    </label>
                    <label
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg cursor-pointer transition-all text-sm ${
                        formData.status === "PRIVATE"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value="PRIVATE"
                        checked={formData.status === "PRIVATE"}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="font-medium">비공개</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* 확장 데이터 추가 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">확장 데이터 추가</h3>
                <span className="text-sm text-gray-400">(선택사항)</span>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>기본 정보 추가</span>
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>종속 데이터 연결</span>
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <span>비종속 데이터 첨부</span>
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* 저장 버튼 */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isCreating}
              className="w-full px-6 py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isCreating ? "카드 저장 중..." : "카드 저장"}
            </button>
          </div>

          {/* 오른쪽: 미리보기 */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                미리보기
              </h3>

              <div className="flex flex-col items-center">
                {/* 카드 미리보기 */}
                <div className="w-full max-w-[240px] rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                    {previewImg ? (
                      <img
                        src={previewImg}
                        className="w-full h-full object-cover"
                        alt="미리보기 이미지"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-300">
                        <ImgIcon className="w-12 h-12 mb-2" />
                        <span className="text-xs">이미지 없음</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white">
                    <p className="font-medium text-gray-900 text-sm truncate mb-2">
                      {formData.cardName || "카드 이름 입력 필요"}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {getCurrentTime().split(" ")[0]}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          formData.status === "PUBLIC"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {formData.status === "PUBLIC" ? "공개" : "비공개"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateCard;