import { useEffect, useRef, useState } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { Link } from "react-router-dom";

export const TableAction = ({ actions }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const dropdownRef = useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="dt-cell-action-table">
      <button
        type="button"
        className="action-dropdown-btn-table"
        onClick={handleDropdown}
      >
        <HiDotsHorizontal size={18} />
        {showDropdown && (
          <div className="action-dropdown-menu-table" ref={dropdownRef}>
            <ul className="dropdown-menu-list-table">
              {actions.map((action, index) => (
                <li key={index} className="dropdown-menu-item-table">
                  <Link to={action.url} className="dropdown-menu-link-table">
                    {action.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </button>
    </div>
  );
};