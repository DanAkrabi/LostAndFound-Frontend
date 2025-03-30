import React from "react";
// import "./PagingControls.css";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationControls: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="paging-controls">
      <button
        className="paging-button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        קודם
      </button>

      <div className="page-numbers">
        {pages.map((page) => (
          <div
            key={page}
            className={`page-number ${page === currentPage ? "active" : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </div>
        ))}
      </div>

      <button
        className="paging-button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        הבא
      </button>

      <div className="page-info">
        עמוד {currentPage} מתוך {totalPages}
      </div>
    </div>
  );
};

export default PaginationControls;
