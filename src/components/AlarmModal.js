// src/components/AlarmModal.js
import { useEffect } from "react";

function AlarmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  content, 
  type = "alarm",  // "alarm" or "confirm"
  confirmText = "확인",
  cancelText = "취소"
}) {
  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden"; // 스크롤 방지
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 모달 박스 */}
      <div 
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="px-6 pt-6 pb-2">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>

        {/* 내용 */}
        <div className="px-6 py-4">
          <p className="text-gray-600">{content}</p>
        </div>

        {/* 버튼 */}
        <div className="px-6 pb-6 flex gap-3 justify-end">
          {type === "confirm" && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlarmModal;