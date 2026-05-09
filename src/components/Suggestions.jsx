
import React, { useState, useEffect } from "react";
import Fuse from "fuse.js";

const AutoSuggestInput = ({
  label,
  placeholder,
  value,
  onChange,
  suggestions,
  isPara=false,
  isTextArea=false,
  isMultiSuggestion = true,
  showSkillTags = false,
}) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const fuse = new Fuse(suggestions, { threshold: 0.3 });

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);

    const searchText = isMultiSuggestion ? val.split(/[,\s]+/).pop() : val;

    if (searchText.trim() === "") {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const results = fuse.search(searchText).map((res) => res.item);
    setFilteredSuggestions(results);
    setActiveIndex(0);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    replaceWord(suggestion);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev + 1 < filteredSuggestions.length ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev - 1 >= 0 ? prev - 1 : filteredSuggestions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        replaceWord(filteredSuggestions[activeIndex]);
      }
    }
  };

  const replaceWord = (suggestion) => {
    let newValue = suggestion;

    if (isMultiSuggestion) {
      const words = inputValue.trim().split(/[,\s]+/);
      words[words.length - 1] = suggestion;
      newValue = isPara ? words.join(" ") + " " : words.join(", ") + ", ";
    }

    setInputValue(newValue);
    onChange(newValue);
    setShowSuggestions(false);
  };

  const removeSkill = (skillToRemove) => {
    const skills = inputValue.split(',').map(s => s.trim()).filter(s => s !== '');
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    const newValue = updatedSkills.join(', ');
    setInputValue(newValue);
    onChange(newValue);
  };

  const getSkillsArray = () => {
    if (!inputValue) return [];
    return inputValue.split(',').map(s => s.trim()).filter(s => s !== '');
  };

  return (
    <div className="relative space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      {showSkillTags && getSkillsArray().length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
          {getSkillsArray().map((skill, index) => (
            <div
              key={index}
              className="group relative flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:outline-none"
                title="Remove skill"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      {isTextArea ? (
        <textarea
          placeholder={placeholder}
          className="w-full h-56 sm:h-48 md:h-44 lg:h-[120px] px-3 py-2 border rounded resize-none peer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setShowSuggestions(false)}
          onFocus={() =>
            inputValue &&
            setFilteredSuggestions(
              fuse
                .search(isMultiSuggestion ? inputValue.split(/[,\s]+/).pop() : inputValue)
                .map((res) => res.item)
            )
          }
        />
      ) : (
        <input
          type="text"
          placeholder={placeholder}
          className="w-full sm:p-2 sm:px-6 border rounded peer px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            setShowSuggestions(false);  // local logic
          }}
          onFocus={() =>
            inputValue &&
            setFilteredSuggestions(
              fuse
                .search(isMultiSuggestion ? inputValue.split(/[,\s]+/).pop() : inputValue)
                .map((res) => res.item)
            )
          }
        />
      )}

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
          {filteredSuggestions.map((suggestion, idx) => (
            <li
              key={idx}
              className={`px-3 py-2 cursor-pointer text-sm ${
                idx === activeIndex
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
              }`}
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoSuggestInput;
