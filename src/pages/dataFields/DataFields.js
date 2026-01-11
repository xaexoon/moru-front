import { useEffect, useState } from "react";

import { ReactComponent as PreviewIcon } from "../../assets/dataFields/preview.svg";
import { ReactComponent as DataFieldIcon } from "../../assets/dataFields/dataField.svg";
import { ReactComponent as NewIcon } from "../../assets/dataFields/new.svg";
import { ReactComponent as UnionIcon } from "../../assets/dataFields/union.svg";
import { ReactComponent as ReloadIcon } from "../../assets/dataFields/reload.svg";
import { ReactComponent as LinkIcon } from "../../assets/dataFields/link.svg";
import { ReactComponent as FileIcon } from "../../assets/dataFields/file.svg";
import { ReactComponent as TrashIcon } from "../../assets/dataFields/trash.svg";

import AttributeBlockEditor from "./tabs/AttributeBlockEditor";
import LinkBlockEditor from "./tabs/LinkBlockEditor";
import {
  useGetDatafieldList,
  useGetDatafield,
  useCreateDatafield,
  useUpdateDatafield,
  useDeleteDatafield,
} from "../../hooks/useApi";

const DATA_FIELD_TAB = [
  { title: "기본 정보 필드", id: "attribute" },
  { title: "연결 블록", id: "link" },
];

const defaultDataField = {
  dataField: {
    name: "",
    description: "",
  },
  attributeBlocks: [],
  linkBlocks: [],
};

function DataFields() {
  const [mode, setMode] = useState("default"); // "default" | "add" | "edit"
  const [selectedId, setSelectedId] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(DATA_FIELD_TAB[0]);
  const [originDataField, setOriginDataField] = useState(null);
  const [currentDataField, setCurrentDataField] = useState(defaultDataField);

  //데이터 필드 목록 조회
  const {
    data: dataFieldListData,
    refetch: refetchDataFieldList,
    isLoading,
    isError,
    error,
  } = useGetDatafieldList();

  const dataFieldList = Array.isArray(dataFieldListData?.data?.data.dataFields)
    ? dataFieldListData.data.data.dataFields
    : [];

  //데이터 필드 상세 조회
  const {
    data: dataFieldDetailData,
    isLoading: dataFieldLoading,
    refetch: refetchDataField,
  } = useGetDatafield(selectedId, {
    enabled: !!selectedId,
  });

  //데이터 필드 생성
  const { mutate: createDatafield, isPending: isCreating } =
    useCreateDatafield();

  //데이터 필드 수정
  const { mutate: updateDatafield, isPending: isUpdating } =
    useUpdateDatafield();

  //데이터 필드 삭제
  const { mutate: deleteDatafield } = useDeleteDatafield();

  //request data
  const toRequestPayload = (currentDataField) => {
    return {
      dataField: {
        name: currentDataField.dataField.name ?? "",
        description: currentDataField.dataField.description ?? "",
      },

      attributeBlocks: (currentDataField.attributeBlocks || []).map(
        ({ name, placeHolder, type, required }) => ({
          name,
          placeHolder,
          type,
          required,
        })
      ),

      linkBlocks: (currentDataField.linkBlocks || []).map(
        ({ name, maxLinkCount }) => ({
          name,
          maxLinkCount,
        })
      ),
    };
  };

  //데이터필드 생성, 수정 핸들러
  const handleSubmitDatafield = () => {
    if (!currentDataField.dataField.name.trim()) {
      alert("데이터 필드의 이름을 입력해주세요.");
      return;
    }

    const submitData = toRequestPayload(currentDataField);

    //생성
    if (mode === "add") {
      createDatafield(submitData, {
        onSuccess: () => {
          alert("데이터 필드가 생성되었습니다!");
          refetchDataFieldList();
          setCurrentDataField(defaultDataField);
          setMode("default");
        },
        onError: (err) => {
          alert(
            "데이터 필드 생성 실패: " +
              (err.response?.data?.message || err.message)
          );
        },
      });
      return;
    }

    //수정
    if (mode === "edit") {
      if (isUpdating) return;

      const originPayload = toRequestPayload(originDataField);

      if (JSON.stringify(originPayload) === JSON.stringify(submitData)) {
        alert("수정 내용이 없습니다.");
        return;
      }

      updateDatafield(
        {
          id: currentDataField.dataField.id,
          data: submitData,
        },
        {
          onSuccess: () => {
            alert("데이터 필드가 수정되었습니다!");
            refetchDataFieldList();
            refetchDataField();
            setOriginDataField(currentDataField);
          },
          onError: (err) => {
            setCurrentDataField(originDataField);
            alert(
              "데이터필드 수정 실패: " +
                (err.response?.data?.message || err.message)
            );
          },
        }
      );
    }
  };

  //데이터필드 삭제 핸들러
  const handleRemoveDatafield = (selectedId) => {
    if (window.confirm("이 데이터 필드를 삭제하시겠습니까?")) {
      deleteDatafield(selectedId, {
        onSuccess: () => {
          alert("데이터 필드가 삭제되었습니다!");
          refetchDataFieldList();
          setCurrentDataField(defaultDataField);
          setMode("default");
        },
        onError: (err) => {
          alert(
            "데이터 필드 삭제 실패: " +
              (err.response?.data?.message || err.message)
          );
        },
      });
    }
  };

  //콘솔
  useEffect(() => {
    console.log("편집 모드:", mode);
  }, [mode]);

  useEffect(() => {
    console.log("업데이트 된 데이터:", currentDataField);
  }, [currentDataField]);

  useEffect(() => {
    console.log("선택한 데이터 필드 id:", selectedId);
  }, [selectedId]);
  //

  useEffect(() => {
    if (!dataFieldDetailData) return;

    const dataFieldDetail = dataFieldDetailData.data.data;

    const withUi = {
      ...dataFieldDetail,
      attributeBlocks: withUiKey(dataFieldDetail.attributeBlocks || []),
      linkBlocks: withUiKey(dataFieldDetail.linkBlocks || []),
    };

    setOriginDataField(withUi);
    setCurrentDataField(withUi);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFieldDetailData]);

  const handleAttributeChange = (updatedAttribute) => {
    setCurrentDataField((prev) => ({
      ...prev,
      attributeBlocks: updatedAttribute,
    }));
  };

  const handleLinkChange = (updatedLink) => {
    setCurrentDataField((prev) => ({
      ...prev,
      linkBlocks: updatedLink,
    }));
  };

  //컴포넌트 제어용 key 삽입
  const withUiKey = (blocks = []) => {
    return Array.isArray(blocks)
      ? blocks.map((block) =>
          block.uiKey ? block : { ...block, uiKey: crypto.randomUUID() }
        )
      : [];
  };

  // 데이터 필드 리스트 로딩 중
  if (isLoading) {
    return (
      <div className="w-full min-h-full bg-white flex items-center justify-center">
        <p>데이터 필드 목록 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="w-full min-h-full bg-white flex items-center justify-center">
        <p className="text-red-500">에러 발생: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full flex">
      {/* Left Section */}
      <div className="w-[280px] min-h-full flex flex-col border-r border-gray-200">
        <div className="w-full h-[150px] border-b border-gray-200 flex flex-col p-6">
          <div className="text-sm mb-1">데이터 필드 관리</div>
          <div className="text-xs text-gray-500 mb-6">
            카드 데이터 구조를 커스터마이징하세요
          </div>
          <div className="w-full flex items-center justify-center">
            <button
              className="w-[240px] h-[38px] bg-black text-white rounded-lg text-xs flex items-center justify-center"
              onClick={() => {
                setMode("add");
                setCurrentDataField(defaultDataField);
                setOriginDataField(defaultDataField);
              }}
            >
              <NewIcon className="w-4 text-white mr-3" />
              <p>새 데이터 필드</p>
            </button>
          </div>
        </div>

        {/*Data Field List*/}
        <div className="flex flex-col p-3">
          <div className="text-xs mb-3">데이터 필드 목록</div>
          <div className="flex flex-col item">
            {dataFieldList.map((field) => {
              return (
                <div
                  className="w-[230px] min-h-[70px] border-2 border-gray-200 rounded-lg mb-2 p-2 text-xs hover:bg-gray-200 hover:border-gray-600 cursor-pointer"
                  key={`dataField_${field.id}`}
                  onClick={() => {
                    setSelectedId(field.id);
                    setMode("edit");
                  }}
                >
                  <div className="w-full flex justify-between">
                    <div className="flex w-full">
                      <DataFieldIcon className="mr-2 w-[17px] h-[30px] text-gray-500" />
                      <div className="w-full flex flex-col">
                        <div className="flex justify-between">
                          <div className="mt-1" key={`field.title_${field.id}`}>
                            {field.name}
                          </div>
                          {field.type === "기본" && (
                            <div
                              className="w-[35px] h-[20px] m-1 bg-gray-200 rounded-lg text-center text-xs"
                              key={`field.type_${field.type}`}
                            >
                              {field.type}
                            </div>
                          )}
                        </div>
                        <div
                          className="w-full text-[11px] text-gray-500 mb-1"
                          key={`field.attribute_${field.id}`}
                        >
                          {field.attributeCnt}개 속성, {field.linkCnt}개 연결
                        </div>
                        <div
                          className="text-[11px] text-gray-500"
                          key={`field.description_${field.id}`}
                        >
                          {field.description}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex-1 min-h-full">
        {selectedId ? (
          dataFieldLoading ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
              데이터 필드를 불러오는 중입니다.
            </div>
          ) : (
            <div>
              {/* Middle Title Section */}
              <div className="w-full h-[105px] border-b border-gray-200 flex flex-col px-5 py-3">
                <div className="flex justify-between items-center">
                  <div className="flex-1 mr-1">
                    <label htmlFor="fieldTitle" className="text-sm">
                      필드 이름*
                    </label>
                    <div className="flex-1 max-w-[588px] h-[40px] rounded-lg flex items-center bg-gray-100 focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 mt-2">
                      <input
                        className="w-full h-full border-none bg-transparent focus:outline-none text-[13px] p-2"
                        type="text"
                        id="fieldTitle"
                        value={currentDataField.dataField.name}
                        placeholder="예: 건축물, 문서, 영상 등"
                        onChange={(e) => {
                          setCurrentDataField((prev) => ({
                            ...prev,
                            dataField: {
                              ...prev.dataField,
                              name: e.target.value,
                            },
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="ml-2">
                    <button
                      className="w-[80px] h-[35px] text-xs bg-red-500 text-white rounded-md mr-2 flex-col justify-center items-center"
                      onClick={() => {
                        if (isCreating || isUpdating) return;
                        handleRemoveDatafield(selectedId);
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <TrashIcon className="w-[11px] text-white mr-2" />
                        <p>삭제</p>
                      </div>
                    </button>
                    <button
                      className="w-[80px] h-[35px] text-xs bg-black text-white rounded-md"
                      onClick={() => {
                        if (isCreating || isUpdating) return;
                        handleSubmitDatafield();
                      }}
                    >
                      <div className="flex items-center justify-center">
                        <UnionIcon className="w-4 text-white mr-2" />
                        <p>저장</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Middle description Section */}
              <div className="p-4 min-h-[202px] flex flex-col">
                <label htmlFor="fieldDescription" className="text-sm">
                  설명
                </label>
                <div className="flex-1 rounded-lg flex items-center  focus-within:outline focus-within:outline-3 focus-within:outline-gray-300 mt-1 mb-3">
                  <textarea
                    className="w-full h-[90px] border-none bg-transparent focus:outline-none text-[13px] p-2 resize-none mb-"
                    type="text"
                    id="fieldDescription"
                    value={currentDataField.dataField.description}
                    placeholder="이 데이터 필드의 용도를 설명하세요..."
                    onChange={(e) => {
                      setCurrentDataField((prev) => ({
                        ...prev,
                        dataField: {
                          ...prev.dataField,
                          description: e.target.value,
                        },
                      }));
                    }}
                  />
                </div>
                <div className="mt-2 border-b border-gray-200 pb-5 flex items-center">
                  <button className="w-[130px] h-[33px] text-xs border border-gray-300 rounded-md hover:bg-gray-200 mr-2">
                    <div className="flex items-center justify-center">
                      <NewIcon className="w-4 text-black mr-2" />
                      기본 블록 추가
                    </div>
                  </button>
                  <button className="w-[85px] h-[33px] text-xs border border-gray-300 rounded-md hover:bg-gray-200 mr-2">
                    <div
                      className="flex items-center justify-center"
                      onClick={() => {
                        if (
                          window.confirm("수정 사항을 초기화 하시겠습니까?")
                        ) {
                          setCurrentDataField(originDataField);
                          alert("초기화 되었습니다.");
                        }
                      }}
                    >
                      <ReloadIcon className="w-3 text-black mr-2" />
                      초기화
                    </div>
                  </button>
                </div>
              </div>

              {/* Middle Bottom Section */}
              <div className="p-4">
                {/* Tab Menu */}
                <div className="flex items-center justify-center">
                  <ul className="h-[34px] w-[97%] flex items-center justify-around rounded-2xl bg-gray-200 text-sm p-1">
                    {DATA_FIELD_TAB.map((tab) => (
                      <li
                        key={tab.id}
                        className={`py-1 w-[50%] rounded-xl cursor-default flex items-center justify-center ${
                          tab.id === activeTab.id && "bg-white"
                        }`}
                        onClick={() => {
                          setActiveTab(tab);
                        }}
                      >
                        {tab.title}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tab Section */}
                <div className="pt-6 flex flex-col items-center">
                  <div className="p-6 w-[97%] min-h-[340px] border border-gray-200 rounded-lg">
                    {activeTab.id === "attribute" && (
                      <AttributeBlockEditor
                        data={currentDataField.attributeBlocks}
                        onChange={handleAttributeChange}
                      />
                    )}
                    {activeTab.id === "link" && (
                      <LinkBlockEditor
                        data={currentDataField.linkBlocks}
                        onChange={handleLinkChange}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="flex-1 min-h-full flex flex-col items-center justify-center">
            <DataFieldIcon className="w-14 text-gray-400 mb-4" />
            <p className="text-lg text-gray-500">데이터 필드를 선택하세요</p>
            <p className="text-sm text-gray-500">
              왼쪽에서 데이터 필드를 선택하거나 새로 만들어보세요.
            </p>
          </div>
        )}
      </div>

      {/* Right Section */}
      {isPreviewOpen ? (
        <div className="w-[355px] min-h-full flex flex-col border-l border-gray-200">
          <div className="w-full h-[83px] border-b border-gray-200 p-3">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <PreviewIcon className="mr-2 w-4" />
                <div>실시간 미리보기</div>
              </div>
              <p
                className="mr-2 cursor-default"
                onClick={() => {
                  setIsPreviewOpen(!isPreviewOpen);
                }}
              >
                X
              </p>
            </div>
            <div className="text-xs text-gray-500">
              편집 중인 데이터 필드가 카드에서 어떻게 표시되는지 확인할 수
              있습니다.
            </div>
          </div>
          <div className="w-full h-full flex flex-col justify-start items-center">
            {/* 카드 미리보기 */}
            <div className="w-[305px] h-[343px] border border-gray-200 rounded-xl mt-4 p-5">
              <div className="text-sm mb-4">카드 미리보기</div>
              <div className="w-[258px] h-[255px] border border-gray-200 rounded-xl flex flex-col items-center pt-4">
                <div className="w-[90%] min-h-[112px] relative bg-gray-200">
                  {currentDataField?.dataField?.name && (
                    <div className="w-fit h-fit text-xs bg-black text-white rounded-xl p-1 m-1 absolute">
                      {currentDataField.dataField.name}
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col items-start m-3">
                  <div className="text-sm mb-1">청화백자 달항아리</div>
                  <div className="text-xs flex-1 text-gray-500 mb-3">
                    조선 후기의 대표적인 백자 달항아리로, 정화 안료로 그려진
                    섬세한 문양이 특징입니다.
                  </div>
                  <div className="text-[11px] text-gray-500">
                    2025. 11. 13. 오후 4:27:08
                  </div>
                </div>
              </div>
            </div>

            {/* 속성 블록 미리보기 */}
            {currentDataField?.attributeBlocks?.length > 0 && (
              <div className="w-[305px] min-h-[118px] h-auto border border-gray-200 rounded-xl mt-4 p-5">
                <div className="w-full border-gray-200 p-1">
                  <div className="text-xs mb-2">속성 블록 미리보기</div>
                  <li className="w-full flex flex-col text-xs">
                    {currentDataField.attributeBlocks.map((attributeBlock) => {
                      return (
                        <ul
                          className="w-full flex flex-col mt-2"
                          key={`previewBlock_${attributeBlock.uiKey}`}
                        >
                          <div className="flex items-center mb-1">
                            <FileIcon className="w-2 mr-2" />
                            <div>{attributeBlock.name}</div>
                          </div>
                          <div className="h-[25px] bg-gray-100 rounded-md flex items-center">
                            <p className="ml-2 text-gray-400">
                              {attributeBlock.placeHolder}
                            </p>
                          </div>
                        </ul>
                      );
                    })}
                  </li>
                </div>
              </div>
            )}

            {/* 연결 블록 미리보기 */}
            {currentDataField?.linkBlocks?.length > 0 && (
              <div className="w-[305px] min-h-[132px] h-auto border border-gray-200 rounded-xl mt-4 p-5">
                <div className="w-full border-gray-200 p-1">
                  <div className="text-xs mb-4">연결 블록 미리보기</div>
                  <li className="flex flex-col text-xs">
                    {currentDataField.linkBlocks.map((linkBlock) => {
                      return (
                        <ul
                          className="w-full flex flex-col mt-2"
                          key={`previewBlock_${linkBlock.id}`}
                        >
                          <div className="flex items-center mb-1">
                            <LinkIcon className="w-3 mr-2" />
                            <div>{linkBlock.name}</div>
                          </div>
                          <div className="rounded-md flex justify-center items-center">
                            <p className="border-2 border-dotted border-gray-200 h-[37px] w-[95%] ml-2 text-gray-400 flex justify-center items-center">
                              다른 카드를 드래그하여 연결
                            </p>
                          </div>
                        </ul>
                      );
                    })}
                  </li>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="w-[43px] min-h-full flex flex-col items-center justify-center border-l border-gray-200 hover:bg-gray-200"
          onClick={() => {
            setIsPreviewOpen(!isPreviewOpen);
          }}
        >
          <PreviewIcon className="mr-2 w-4 ml-[3px]" />
        </div>
      )}
    </div>
  );
}

export default DataFields;
