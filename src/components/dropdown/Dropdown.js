import { useState, useRef, useEffect } from "react";

import { ReactComponent as ExpandIcon } from "../../assets/inventory/expand.svg";

function Dropdown({ options, onChange }) {
  const [currentValue, setCurrentValue] = useState(options[0]);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelectValue = (option) => {
    setCurrentValue(option);
    onChange?.(option);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="w-full h-full bg-gray-100 rounded-lg flex items-center relative"
      ref={dropdownRef}
      onClick={() => setShowOptions((prev) => !prev)}
    >
      <label className="w-full text-xs text-gray-700 px-[12px] flex items-center justify-between">
        <p>{currentValue.title}</p>
        <ExpandIcon className="w-3 text-gray-400" />
      </label>
      {showOptions && (
        <ul className="w-full p-[4px] flex flex-col absolute top-[38px] -left-1 border border-gray-200 rounded-md shadow-lg mx-[4px] bg-white">
          {options.map((option) => (
            <li
              className="w-full h-[30px] flex items-center justify-between text-xs text-gray-700 p-[5px] rounded-md cursor-default hover:bg-gray-200"
              key={option.value}
              value={option.value}
              onClick={() => handleSelectValue(option)}
            >
              {option.title}
              <div>{currentValue === option && "✔"} </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
