// src/context/InventoryContext.js
import { createContext, useContext, useState, useEffect } from "react";

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(() => {
    // localStorage에서 초기값 로드
    const saved = localStorage.getItem("inventory");
    return saved ? JSON.parse(saved) : [];
  });

  // inventory 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }, [inventory]);

  // 카드 추가
  const addToInventory = (card) => {
    const isAlreadyInInventory = inventory.some(item => item.cardId === card.cardId);
    if (!isAlreadyInInventory) {
      setInventory([...inventory, card]);
    }
  };

  // 카드 제거
  const removeFromInventory = (cardId) => {
    setInventory(inventory.filter(item => item.cardId !== cardId));
  };

  // 카드 토글 (있으면 제거, 없으면 추가)
  const toggleInventory = (card) => {
    const isAlreadyInInventory = inventory.some(item => item.cardId === card.cardId);
    if (isAlreadyInInventory) {
      removeFromInventory(card.cardId);
    } else {
      addToInventory(card);
    }
  };

  // 인벤토리에 있는지 확인
  const isInInventory = (cardId) => {
    return inventory.some(item => item.cardId === cardId);
  };

  // 인벤토리 비우기
  const clearInventory = () => {
    setInventory([]);
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        addToInventory,
        removeFromInventory,
        toggleInventory,
        isInInventory,
        clearInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}