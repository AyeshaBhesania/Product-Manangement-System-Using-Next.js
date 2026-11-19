
interface PaginationProps {
  currentPage: number;
  totalProducts: number;
  productsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalProducts,
  productsPerPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const startIndex =
    totalProducts === 0 ? 0 : (currentPage - 1) * productsPerPage + 1;

  const endIndex = Math.min(
    currentPage * productsPerPage,
    totalProducts
  );

  if (totalPages === 0) return null;

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-4">

      <p className="text-secondary mb-0 small">
        Showing <strong>{startIndex}–{endIndex}</strong> of{" "}
        <strong>{totalProducts}</strong> products
      </p>

      <nav aria-label="Product pagination">
        <ul className="pagination mb-0">

          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Previous
            </button>
          </li>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <li
                className={`page-item ${
                  currentPage === page ? "active" : ""
                }`}
                key={page}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              </li>
            )
          )}

          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next
            </button>
          </li>

        </ul>
      </nav>
    </div>
  );
}
