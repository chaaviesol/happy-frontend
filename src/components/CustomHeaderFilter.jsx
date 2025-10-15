import React, { useState, useRef, useEffect } from "react";
import { TextField, IconButton, Paper } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import FilterAltIcon from "@mui/icons-material/FilterAlt"; // active filter icon
import ClearIcon from "@mui/icons-material/Clear";
import ReactDOM from "react-dom";

const CustomHeaderFilter = ({ displayName, column, api }) => {
  const colId = column.getColId();
  const headerRef = useRef(null);
  const [showFilter, setShowFilter] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Toggle floating filter visibility
  const toggleFilter = () => {
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setShowFilter((prev) => !prev);
  };

  // Handle filter input change
  const handleFilterChange = (value) => {
    setFilterValue(value);
    const filterInstance = api.getFilterInstance(colId);
    if (filterInstance) {
      filterInstance.setModel({
        type: "contains",
        filter: value,
      });
      api.onFilterChanged();
    }
    setIsFilterActive(value !== "");
  };

  // Clear filter
  const handleClear = () => {
    setFilterValue("");
    const filterInstance = api.getFilterInstance(colId);
    if (filterInstance) {
      filterInstance.setModel(null);
      api.onFilterChanged();
    }
    setIsFilterActive(false);
    setShowFilter(false);
  };

  // Listen for filter changes outside the panel
  useEffect(() => {
    const updateActiveFilter = () => {
      const filterInstance = api.getFilterInstance(colId);
      setIsFilterActive(filterInstance?.getModel() != null);
    };
    api.addEventListener("filterChanged", updateActiveFilter);
    return () => api.removeEventListener("filterChanged", updateActiveFilter);
  }, [api, colId]);

  // Close floating filter if click outside & recalc position on scroll/resize
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutside =
        headerRef.current &&
        !headerRef.current.contains(event.target) &&
        !event.target.closest(".floating-filter-panel");
      if (clickedOutside) {
        setShowFilter(false);
      }
    };

    const handleScrollResize = () => {
      if (showFilter && headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScrollResize);
    window.addEventListener("resize", handleScrollResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScrollResize);
      window.removeEventListener("resize", handleScrollResize);
    };
  }, [showFilter]);

  return (
    <>
      <div
        ref={headerRef}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "2px 4px",
        }}
      >
        <span
          style={{
            fontWeight: 600,
            fontSize: "13px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {displayName}
        </span>

        <div style={{ display: "flex", gap: "2px" }}>
          {/* Filter Button: changes icon if filter is active */}
          <IconButton
            size="small"
            onClick={toggleFilter}
            style={{
              color: isFilterActive ? "#FFD700" : "#00695C",
              padding: "2px",
            }}
          >
            {isFilterActive ? (
              <FilterAltIcon fontSize="small" />
            ) : (
              <FilterListIcon fontSize="small" />
            )}
          </IconButton>

          {/* Clear Button */}
          <IconButton
            size="small"
            onClick={handleClear}
            style={{ color: "#D32F2F", padding: "2px" }}
          >
            <ClearIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/* Floating Filter Panel */}
      {showFilter &&
        ReactDOM.createPortal(
          <Paper
            className="floating-filter-panel"
            elevation={3}
            style={{
              position: "absolute",
              top: position.top,
              left: position.left,
              width: position.width,
              zIndex: 9999,
              padding: "6px",
              borderRadius: "8px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
            }}
          >
            <TextField
              autoFocus
              size="small"
              fullWidth
              placeholder={`Filter ${displayName}`}
              value={filterValue}
              onChange={(e) => handleFilterChange(e.target.value)}
            />
          </Paper>,
          document.body
        )}
    </>
  );
};

export default CustomHeaderFilter;
