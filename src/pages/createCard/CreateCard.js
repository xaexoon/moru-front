import Select from "react-select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateCard, useGetDatafield } from "../../hooks/useApi";

import { ReactComponent as ImgIcon } from "../../assets/createCard/image.svg";

function CreateCard() {
  const navigate = useNavigate();

  const [previewImges, setPreviewImges] = useState([]);
  const [mainImg, setMainImg] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [mainImgIndex, setMainImgIndex] = useState(0);

  // 폼 데이터
  const [formData, setFormData] = useState({
    cardName: "",
    dataFieldId: null,
    status: "PUBLIC",
  });

  // 카드 생성 mutation
  const { mutate: createCard, isPending: isCreating } = useCreateCard();

  // 데이터필드 목록 조회
  const { data: datafieldData, isLoading: isDatafieldLoading } = useGetDatafield();

  // 데이터필드 옵션 변환
  const dataFieldOptions = datafieldData?.data?.data?.dataFields?.map(field => ({
    value: field.id,
    label: field.name,
  })) || [];

  // react-select 커스텀 스타일
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      padding: "4px 8px",
      borderColor: state.isFocused ? "#1976d2" : "#ddd",
      borderRadius: "6px",
      fontSize: "16px",
      minHeight: "45px",
      boxShadow: "none",
      backgroundColor: state.isFocused ? "white" : "#f5f5f5",
      "&:hover": {
        borderColor: "#1976d2",
        backgroundColor: "#e8e8e8",
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
      fontSize: "16px",
      border: "1px solid #ddd",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "6px",
      marginTop: "4px",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: "4px 0",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "12px 16px",
      fontSize: "16px",
      backgroundColor: state.isSelected
        ? "#1976d2"
        : state.isFocused
          ? "#e3f2fd"
          : "white",
      color: state.isSelected ? "white" : "#333",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      fontSize: "16px",
      color: "#333",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#666",
      "&:hover": {
        color: "#1976d2",
      },
    }),
  };

  // 이미지 업로드
  const handleImgUpload = (e) => {
    const imgFiles = e.target.files;
    if (!imgFiles) return;

    const filesArray = [...imgFiles];
    const previewImgUrlList = filesArray.map((file) =>
      URL.createObjectURL(file)
    );

    const mergedImgUrlList = [...previewImges, ...previewImgUrlList];
    const mergedFileList = [...imageFiles, ...filesArray];

    setPreviewImges(mergedImgUrlList);
    setImageFiles(mergedFileList);
    setMainImg(mergedImgUrlList[0]);
    setMainImgIndex(0);
  };

  // 대표 이미지 선택
  const handleMainImgSelect = (img, index) => {
    setMainImg(img);
    setMainImgIndex(index);
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

  // 카드 저장
  const handleSubmit = () => {
    // 유효성 검사
    if (imageFiles.length === 0) {
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

    // FormData 생성 (이미지만)
    const submitFormData = new FormData();

    // 대표 이미지를 첫 번째로 추가
    const mainFile = imageFiles[mainImgIndex];
    submitFormData.append("multipartFile", mainFile);

    // 나머지 이미지 추가
    imageFiles.forEach((file, index) => {
      if (index !== mainImgIndex) {
        submitFormData.append("multipartFile", file);
      }
    });

    // 쿼리 파라미터 데이터
    const params = {
      cardName: formData.cardName,
      status: formData.status,
      dataFieldId: formData.dataFieldId,
    };

    // API 호출
    createCard(
      { formData: submitFormData, params },
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
    <div className="w-full min-h-full bg-white box-border">
      <main className="flex w-full max-w-[1600px] mx-auto flex-col px-20 pt-12">
        <header className="pl-10 mb-8">
          <h2 className="text-2xl font-bold">새 카드 만들기</h2>
          <p className="text-gray-600 mt-2">
            필수 정보를 입력하여 카드를 생성하고, 필요한 경우 확장 데이터를
            추가할 수 있습니다.
          </p>
        </header>

        <div className="flex flex-col gap-6 w-full bg-white p-10 rounded-xl">
          <div className="grid grid-cols-2 gap-8 w-full">
            {/* 왼쪽 컬럼 */}
            <div className="flex flex-col gap-6 min-w-0">
              {/* 필수정보 */}
              <section className="flex flex-col bg-white w-full border border-gray-300 rounded-xl shadow-sm overflow-visible">
                <div className="m-8">
                  <header className="flex flex-row items-center gap-3 pb-5 border-b border-gray-200">
                    <div className="w-5 h-5"></div>
                    <h2 className="text-lg font-semibold">필수 정보</h2>
                  </header>

                  <div className="flex flex-col gap-6 pt-5">
                    {/* 대표이미지 */}
                    <div className="flex flex-col gap-2.5">
                      <div className="font-semibold text-sm text-gray-800">
                        대표이미지 *
                      </div>
                      <div className="flex flex-1">
                        <input
                          className="hidden"
                          type="file"
                          accept="image/*"
                          multiple
                          id="mainImgUpload"
                          onChange={handleImgUpload}
                        />
                        <label
                          htmlFor="mainImgUpload"
                          className="h-[150px] border-2 border-dashed border-blue-600 rounded-xl flex-1 flex cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-700"
                        >
                          <div className="w-full flex items-center justify-center text-blue-600 text-sm">
                            클릭하여 이미지 업로드
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* 업로드된 이미지 */}
                    {previewImges.length > 0 && (
                      <div className="w-full text-sm text-gray-500 mb-1">
                        <p className="mb-1">
                          업로드된 이미지 ({previewImges.length}개)
                        </p>
                        <ul className="w-full h-auto overflow-x-auto overflow-y-hidden flex items-start mb-2 p-2">
                          {previewImges.map((img, index) => (
                            <li
                              key={index}
                              className={`w-[70px] h-[70px] rounded-md mr-2 flex-shrink-0 border-2 relative cursor-pointer ${
                                index === mainImgIndex
                                  ? "border-black"
                                  : "border-gray-300"
                              }`}
                              onClick={() => handleMainImgSelect(img, index)}
                            >
                              {index === mainImgIndex && (
                                <div className="absolute text-xs text-white bg-black rounded-full px-[2px] -right-[2px] -top-[2px]">
                                  ★
                                </div>
                              )}
                              <img
                                src={img}
                                alt={`previewImg-${index}`}
                                className="w-full h-full object-cover rounded-md block"
                              />
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs">
                          ★ 표시된 이미지가 대표 이미지입니다. 클릭하여 변경할 수 있습니다.
                        </p>
                      </div>
                    )}

                    {/* 카드 이름 */}
                    <div className="flex flex-col gap-2.5">
                      <div className="font-semibold text-sm text-gray-800">
                        카드 이름 *
                      </div>
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-sm transition-all bg-gray-100 focus:outline-none focus:border-blue-600 focus:bg-white"
                        name="cardName"
                        id="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        placeholder="카드 이름을 입력하세요"
                      />
                    </div>

                    {/* 데이터 필드 */}
                    <div className="flex flex-col gap-2.5">
                      <div className="font-semibold text-sm text-gray-800">
                        데이터 필드 *
                      </div>
                      <Select
                        options={dataFieldOptions}
                        isSearchable={false}
                        placeholder={isDatafieldLoading ? "로딩 중..." : "선택하세요"}
                        styles={customSelectStyles}
                        onChange={handleDataFieldChange}
                        isDisabled={isDatafieldLoading}
                        noOptionsMessage={() => "데이터 필드가 없습니다. 먼저 생성해주세요."}
                      />
                    </div>

                    {/* 공개 여부 */}
                    <div className="flex flex-col gap-2.5">
                      <div className="font-semibold text-sm text-gray-800">
                        공개 여부 *
                      </div>
                      <div className="flex gap-4">
                        <label
                          className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                            formData.status === "PUBLIC"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value="PUBLIC"
                            checked={formData.status === "PUBLIC"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm font-medium">전체공개</span>
                        </label>
                        <label
                          className={`flex items-center gap-2 px-4 py-3 border rounded-lg cursor-pointer transition-all ${
                            formData.status === "PRIVATE"
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="status"
                            value="PRIVATE"
                            checked={formData.status === "PRIVATE"}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm font-medium">비공개</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 확장 데이터 추가 */}
              <section className="flex flex-col bg-white w-full border border-gray-300 rounded-xl shadow-sm overflow-visible">
                <div className="m-8">
                  <header className="flex flex-row items-center gap-3 pb-5 border-b border-gray-200">
                    <div className="w-5 h-5 flex items-center justify-center text-lg">
                      +
                    </div>
                    <h2 className="text-lg font-semibold">확장 데이터 추가</h2>
                    <p className="text-gray-500 text-sm">(선택사항)</p>
                  </header>

                  <div className="w-full pt-5">
                    <div className="flex flex-col gap-3">
                      <div className="flex">
                        <div className="flex flex-1 items-center gap-3 px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-600">
                          <div className="w-5 h-5 flex-shrink-0"></div>
                          <p className="flex-1 text-left m-0">기본 정보 추가</p>
                          <div className="ml-auto">&gt;</div>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex flex-1 items-center gap-3 px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-600">
                          <div className="w-5 h-5 flex-shrink-0"></div>
                          <p className="flex-1 text-left m-0">종속 데이터 연결</p>
                          <div className="ml-auto">&gt;</div>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex flex-1 items-center gap-3 px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-600">
                          <div className="w-5 h-5 flex-shrink-0"></div>
                          <p className="flex-1 text-left m-0">비종속 데이터 첨부</p>
                          <div className="ml-auto">&gt;</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* 오른쪽 컬럼 */}
            <div className="flex flex-col sticky top-5 h-fit min-w-0">
              <section className="flex flex-col bg-white w-full border border-gray-300 rounded-xl shadow-sm overflow-visible">
                <div className="m-8">
                  <header className="flex flex-row items-center gap-3 pb-5 border-b border-gray-200">
                    <div className="w-5 h-5"></div>
                    <h2 className="text-lg font-semibold">미리보기</h2>
                  </header>

                  <div className="flex flex-col items-center gap-4 py-5">
                    <div className="w-full max-w-[280px] h-[280px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden">
                      {mainImg ? (
                        <img
                          src={mainImg}
                          className="w-full h-full object-cover"
                          alt="미리보기 이미지"
                        />
                      ) : (
                        <ImgIcon className="w-10 text-gray-500" />
                      )}
                    </div>
                    <div className="font-semibold text-base text-gray-800 text-center">
                      {formData.cardName || "카드 이름 입력 필요"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getCurrentTime()}
                    </div>
                    <div
                      className={`text-xs px-3 py-1 rounded-full ${
                        formData.status === "PUBLIC"
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {formData.status === "PUBLIC" ? "전체공개" : "비공개"}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isCreating}
            className="w-full px-8 py-4 bg-blue-600 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors mt-2 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isCreating ? "카드 저장 중..." : "카드 저장"}
          </button>
        </div>
      </main>
    </div>
  );
}

export default CreateCard;