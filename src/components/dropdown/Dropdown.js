import { useState, useRef, useEffect } from "react";

import "./Dropdown.css";

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
      className="dropdown_select_container"
      ref={dropdownRef}
      onClick={() => setShowOptions((prev) => !prev)}
    >
      <label>{currentValue}</label>
      {showOptions && (
        <ul className="dropdown_select_box">
          {options.map((option, index) => (
            <li
              className="dropdown_select_option"
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
