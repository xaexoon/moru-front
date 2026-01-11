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
  const [mode, setMode] = useState("default");
  const [selectedId, setSelectedId] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(DATA_FIELD_TAB[0]);
  const [originDataField, setOriginDataField] = useState(null);
  const [currentDataField, setCurrentDataField] = useState(defaultDataField);

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

  const {
    data: dataFieldDetailData,
    isLoading: dataFieldLoading,
    refetch: refetchDataField,
  } = useGetDatafield(selectedId, {
    enabled: !!selectedId,
  });

  const { mutate: createDatafield, isPending: isCreating } =
    useCreateDatafield();

  const { mutate: updateDatafield, isPending: isUpdating } =
    useUpdateDatafield();

  const { mutate: deleteDatafield } = useDeleteDatafield();

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

  const handleSubmitDatafield = () => {
    if (!currentDataField.dataField.name.trim()) {
      alert("데이터 필드의 이름을 입력해주세요.");
      return;
    }

    const submitData = toRequestPayload(currentDataField);

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

  const withUiKey = (blocks = []) => {
    return Array.isArray(blocks)
      ? blocks.map((block) =>
          block.uiKey ? block : { ...block, uiKey: crypto.randomUUID() }
        )
      : [];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500">데이터 필드 목록 불러오는 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500">에러 발생: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex">
      {/* Left Section - 사이드바 */}
      <div className="w-[300px] min-h-full flex flex-col border-r border-gray-200 bg-gray-50">
        {/* 헤더 */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-900 mb-1">데이터 필드 관리</h1>
          <p className="text-sm text-gray-500 mb-4">
            카드 데이터 구조를 커스터마이징하세요
          </p>
          <button
            className="w-full h-[42px] bg-black text-white rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            onClick={() => {
              setMode("add");
              setCurrentDataField(defaultDataField);
              setOriginDataField(defaultDataField);
            }}
          >
            <NewIcon className="w-4 text-white" />
            <span>새 데이터 필드</span>
          </button>
        </div>

        {/* 데이터 필드 목록 */}
        <div className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs text-gray-500 font-medium mb-3">데이터 필드 목록</p>
          <div className="flex flex-col gap-2">
            {dataFieldList.map((field) => (
              <div
                key={`dataField_${field.id}`}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedId === field.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }`}
                onClick={() => {
                  setSelectedId(field.id);
                  setMode("edit");
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DataFieldIcon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {field.name}
                      </p>
                      {field.type === "기본" && (
                        <span className="px-2 py-0.5 bg-gray-200 rounded text-xs text-gray-600">
                          {field.type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1">
                      {field.attributeCnt}개 속성, {field.linkCnt}개 연결
                    </p>
                    {field.description && (
                      <p className="text-xs text-gray-400 truncate">
                        {field.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Section - 편집 영역 */}
      <div className="flex-1 min-h-full flex flex-col">
        {mode !== "default" ? (
          dataFieldLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">데이터 필드를 불러오는 중입니다...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col">
              {/* 상단 헤더 */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-end justify-between gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      필드 이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
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
                      className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="h-[42px] px-4 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                      onClick={() => {
                        if (isCreating || isUpdating) return;
                        handleRemoveDatafield(selectedId);
                      }}
                    >
                      <TrashIcon className="w-4 text-white" />
                      <span>삭제</span>
                    </button>
                    <button
                      className="h-[42px] px-4 text-sm rounded-lg bg-black text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                      onClick={() => {
                        if (isCreating || isUpdating) return;
                        handleSubmitDatafield();
                      }}
                    >
                      <UnionIcon className="w-4 text-white" />
                      <span>{isCreating || isUpdating ? "저장 중..." : "저장"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 설명 영역 */}
              <div className="p-6 border-b border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  설명
                </label>
                <textarea
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 focus:bg-white"
                  rows={3}
                />
                <div className="flex gap-2 mt-4">
                  <button className="h-[38px] px-4 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                    <NewIcon className="w-4 text-gray-600" />
                    <span>기본 블록 추가</span>
                  </button>
                  <button
                    className="h-[38px] px-4 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                    onClick={() => {
                      if (window.confirm("수정 사항을 초기화 하시겠습니까?")) {
                        setCurrentDataField(originDataField);
                        alert("초기화 되었습니다.");
                      }
                    }}
                  >
                    <ReloadIcon className="w-3 text-gray-600" />
                    <span>초기화</span>
                  </button>
                </div>
              </div>

              {/* 탭 영역 */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* 탭 메뉴 */}
                <div className="flex items-center justify-center mb-6">
                  <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                    {DATA_FIELD_TAB.map((tab) => (
                      <button
                        key={tab.id}
                        className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors ${
                          tab.id === activeTab.id
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 탭 컨텐츠 */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[300px]">
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
          )
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <DataFieldIcon className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-700 mb-1">데이터 필드를 선택하세요</p>
            <p className="text-sm text-gray-500">
              왼쪽에서 데이터 필드를 선택하거나 새로 만들어보세요.
            </p>
          </div>
        )}
      </div>

      {/* Right Section - 미리보기 */}
      {isPreviewOpen ? (
        <div className="w-[360px] min-h-full flex flex-col border-l border-gray-200 bg-gray-50">
          {/* 미리보기 헤더 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <PreviewIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">실시간 미리보기</span>
              </div>
              <button
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
                onClick={() => setIsPreviewOpen(false)}
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500">
              편집 중인 데이터 필드가 카드에서 어떻게 표시되는지 확인할 수 있습니다.
            </p>
          </div>

          {/* 미리보기 컨텐츠 */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* 카드 미리보기 */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-3">카드 미리보기</p>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100 relative">
                  {currentDataField?.dataField?.name && (
                    <span className="absolute top-2 left-2 px-2 py-1 bg-black text-white text-xs rounded-full">
                      {currentDataField.dataField.name}
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">청화백자 달항아리</p>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                    조선 후기의 대표적인 백자 달항아리로, 정화 안료로 그려진 섬세한 문양이 특징입니다.
                  </p>
                  <p className="text-xs text-gray-400">2025. 11. 13. 오후 4:27:08</p>
                </div>
              </div>
            </div>

            {/* 속성 블록 미리보기 */}
            {currentDataField?.attributeBlocks?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-3">속성 블록 미리보기</p>
                <div className="space-y-3">
                  {currentDataField.attributeBlocks.map((attributeBlock) => (
                    <div key={`previewBlock_${attributeBlock.uiKey}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <FileIcon className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-700">{attributeBlock.name}</span>
                      </div>
                      <div className="h-[32px] bg-gray-100 rounded-lg flex items-center px-3">
                        <span className="text-xs text-gray-400">{attributeBlock.placeHolder}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 연결 블록 미리보기 */}
            {currentDataField?.linkBlocks?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-3">연결 블록 미리보기</p>
                <div className="space-y-3">
                  {currentDataField.linkBlocks.map((linkBlock) => (
                    <div key={`previewBlock_${linkBlock.id}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <LinkIcon className="w-3 h-3 text-gray-400" />
                        <span className="text-xs font-medium text-gray-700">{linkBlock.name}</span>
                      </div>
                      <div className="h-[40px] border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-gray-400">다른 카드를 드래그하여 연결</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className="w-[48px] min-h-full flex flex-col items-center justify-center border-l border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => setIsPreviewOpen(true)}
        >
          <PreviewIcon className="w-5 h-5 text-gray-500" />
        </div>
      )}
    </div>
  );
}

export default DataFields;