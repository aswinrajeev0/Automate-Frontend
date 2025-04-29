import React from "react";

const ThemeToggle: React.FC<{isDark: boolean, setIsDark: React.Dispatch<React.SetStateAction<boolean>>}> = ({ isDark, setIsDark }) => {
    return (
      <button
        onClick={() => setIsDark(!isDark)}
        className="px-4 py-2 bg-gray-200 dark:bg-gray-800 dark:text-white rounded"
      >
        {isDark ? "Light Mode" : "Dark Mode"}
      </button>
    );
  };
  
  export default ThemeToggle;
  