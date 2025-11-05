import Select from "react-select";

function CreateCard() {
  const dataFieldOptions = [
    { value: "유물/작품", label: "유물/작품" },
    { value: "색상", label: "색상" },
    { value: "형태", label: "형태" },
    { value: "재질", label: "재질" },
    { value: "문양", label: "문양" },
    { value: "기법", label: "기법" },
    { value: "시대", label: "시대" },
    { value: "지역", label: "지역" },
    { value: "카테고리", label: "카테고리" },
    { value: "개념", label: "개념" },
  ];

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

        <form className="flex flex-col gap-6 w-full bg-white p-10 rounded-xl">
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
                        <div className="h-[150px] border-2 border-dashed border-blue-600 rounded-xl flex-1 flex cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-700">
                          <div className="w-full flex items-center justify-center text-blue-600 text-sm">
                            클릭하여 이미지 업로드 (다중 선택 가능)
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 카드이름 */}
                    <div className="flex flex-col gap-2.5">
                      <div className="font-semibold text-sm text-gray-800">
                        카드 이름 *
                      </div>
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-md text-sm transition-all bg-gray-100 focus:outline-none focus:border-blue-600 focus:bg-white"
                        name="cardName"
                        id="cardName"
                      />
                    </div>

                    {/* 데이터 필드 */}
                    <div className="flex flex-col gap-2.5">
                      <div className="font-semibold text-sm text-gray-800">
                        데이터 필드 *
                      </div>
                      <Select
                        defaultValue={dataFieldOptions[0]}
                        options={dataFieldOptions}
                        isSearchable={false}
                        placeholder="선택하세요"
                        styles={customSelectStyles}
                      />
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
                      {/* 기본 정보 추가 */}
                      <div className="flex">
                        <div className="flex flex-1 items-center gap-3 px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-600">
                          <div className="w-5 h-5 flex-shrink-0"></div>
                          <p className="flex-1 text-left m-0">기본 정보 추가</p>
                          <div className="ml-auto">&gt;</div>
                        </div>
                      </div>

                      {/* 종속 데이터 연결 */}
                      <div className="flex">
                        <div className="flex flex-1 items-center gap-3 px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-600">
                          <div className="w-5 h-5 flex-shrink-0"></div>
                          <p className="flex-1 text-left m-0">
                            종속 데이터 연결
                          </p>
                          <div className="ml-auto">&gt;</div>
                        </div>
                      </div>

                      {/* 비종속 데이터 첨부 */}
                      <div className="flex">
                        <div className="flex flex-1 items-center gap-3 px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-600">
                          <div className="w-5 h-5 flex-shrink-0"></div>
                          <p className="flex-1 text-left m-0">
                            비종속 데이터 첨부
                          </p>
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
              {/* 미리보기 */}
              <section className="flex flex-col bg-white w-full border border-gray-300 rounded-xl shadow-sm overflow-visible">
                <div className="m-8">
                  <header className="flex flex-row items-center gap-3 pb-5 border-b border-gray-200">
                    <div className="w-5 h-5"></div>
                    <h2 className="text-lg font-semibold">미리보기</h2>
                  </header>

                  <div className="flex flex-col items-center gap-4 py-5">
                    <div className="w-full max-w-[280px] h-[280px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                      <input type="image" className="w-full h-full" />
                    </div>
                    <div className="font-semibold text-base text-gray-800 text-center">
                      카드 이름 입력 필요
                    </div>
                    <div className="text-sm text-gray-500">
                      20250. 11. 1 오후 2:28:30
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <button
            type="button"
            className="w-full px-8 py-4 bg-blue-600 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-colors mt-2 hover:bg-blue-700"
          >
            카드 저장
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateCard;
