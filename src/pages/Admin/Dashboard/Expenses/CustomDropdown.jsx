import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaPlus, FaEllipsisV } from 'react-icons/fa';
import './OperationalExpenses.css';

const CustomDropdown = ({
    options,
    selected,
    onSelect,
    placeholder,
    searchPlaceholder,
    onAddNew,
    onRename,
    onDelete,
    disabled = false,
    type // 'category' or 'subCategory' for labeling
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [activeOptionMenu, setActiveOptionMenu] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setActiveOptionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // const filteredOptions = (options||[]).filter(opt =>
    //     opt.toLowerCase().includes(search.toLowerCase())
    // );
    const filteredOptions = Array.isArray(options)
    ? options.filter(opt => String(opt).toLowerCase().includes(search.toLowerCase()))
    : [];


    const handleOptionClick = (e, item) => {
        e.stopPropagation();
        setActiveOptionMenu(activeOptionMenu === item ? null : item);
    };

    return (
        <div className="custom-dropdown-wrapper" ref={dropdownRef}>
            <div
                className={`filter-input-wrapper ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span>{selected || placeholder}</span>
                <FaChevronDown className="dropdown-arrow" />
            </div>

            {isOpen && (
                <div className="custom-dropdown-menu">
                    <input
                        type="text"
                        placeholder={searchPlaceholder || "Search"}
                        className="dropdown-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <div className="dropdown-list">
                        {filteredOptions.map((item) => (
                            <div
                                key={item}
                                className="dropdown-item-custom"
                                onClick={() => {
                                    onSelect(item);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{item}</span>
                                {/* <div className="dropdown-item-options">
                                    <FaEllipsisV
                                        className="option-icon"
                                        onClick={(e) => handleOptionClick(e, item)}
                                    />
                                    {activeOptionMenu === item && (
                                        <div className="option-menu-popup">
                                            <div className="option-menu-item" onClick={(e) => {
                                                e.stopPropagation();
                                                onRename(item);
                                                setIsOpen(false);
                                            }}>Rename</div>
                                            <div className="option-menu-item delete" onClick={(e) => {
                                                e.stopPropagation();
                                                onDelete(item);
                                                setIsOpen(false);
                                            }}>Delete</div>
                                        </div>
                                    )}
                                </div> */}
                            </div>
                        ))}
                    </div>
                    <button
                        className="add-new-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddNew();
                            setIsOpen(false);
                        }}
                    >
                        <FaPlus /> Add New {type === 'category' ? 'Category' : 'Sub Category'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
