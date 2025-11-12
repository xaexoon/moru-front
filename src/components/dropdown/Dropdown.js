import { useState, useRef, useEffect } from "react";

function Dropdown({ options, onChange }) {
  const [currentValue, setCurrentValue] = useState(options[0]);
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelectValue = (value) => {
    setCurrentValue(value);
    onChange?.(value);
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
      <label className="text-xs text-gray-700 px-[12px]">{currentValue}</label>
      {showOptions && (
        <ul className="w-full p-[4px] flex flex-col absolute top-[38px] border border-gray-200 rounded-md shadow-lg mx-[4px] bg-white">
          {options.map((option, index) => (
            <li
              className="w-full h-[30px] flex items-center justify-between text-xs text-gray-700 p-[5px] rounded-md cursor-default hover:bg-gray-200"
              key={option + index}
              value={option}
              onClick={() => handleSelectValue(option)}
            >
              {option}
              <div>{currentValue === option && "✔"} </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
