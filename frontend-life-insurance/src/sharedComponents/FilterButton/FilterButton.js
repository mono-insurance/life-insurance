import React, { useEffect, useRef, useState } from 'react'
import './filterButton.scss';

export const FilterButton = ({showFilterButton, setShowFilterButton, setFilterType, filterOptions}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);


    const handleDropdown = () => {
        setShowDropdown(!showDropdown);
      };

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


      const handleFilterTypeClick = (type) => {
        setFilterType(type);
        setShowFilterButton(false);
        setShowDropdown(false);
    };


  return (
    <>
    <div className="filter-button">
        {showFilterButton && ( <button type="button" className="action-dropdown-btn" onClick={handleDropdown}> + Add Filter </button>)}
        {showDropdown && (
            <div className="filter-dropdown-menu" ref={dropdownRef}>
                <ul className="dropdown-menu-list">
                    {filterOptions.map((option) => (
                        <li key={option.value} className="dropdown-menu-item">
                            <button
                                onClick={() => handleFilterTypeClick(option.value)}
                                className="dropdown-menu-link"
                            >
                                {option.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
    
    
    </>
  )
}
