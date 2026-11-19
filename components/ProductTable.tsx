
"use client";

import { Product } from "./ProductForm";

interface ProductTableProps {
  products: Product[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onSort: (field: keyof Product) => void;
  sortBy: keyof Product;
  sortOrder: "asc" | "desc";
  totalProducts: number;
}

export default function ProductTable({
  products,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
  onSort,
  sortBy,
  sortOrder,
  totalProducts,
}: ProductTableProps) {
  function sortIcon(field: keyof Product) {
    if (sortBy !== field) return "↕";
    return sortOrder === "asc" ? "↑" : "↓";
  }

  function discountedPrice(price: number, discount: number) {
    return price - (price * discount) / 100;
  }

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body p-4">

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h4 className="fw-bold mb-1">Product Inventory</h4>
            <p className="text-secondary mb-0 small">
              Manage all your products here.
            </p>
          </div>

          <div className="input-group" style={{ maxWidth: "320px" }}>
            <span className="input-group-text bg-white">🔍</span>
            <input
              type="search"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Image</th>

                <th>
                  <button
                    className="btn btn-link text-dark text-decoration-none fw-bold p-0"
                    onClick={() => onSort("productName")}
                  >
                    Product {sortIcon("productName")}
                  </button>
                </th>

                <th>Category / Brand</th>

                <th>
                  <button
                    className="btn btn-link text-dark text-decoration-none fw-bold p-0"
                    onClick={() => onSort("price")}
                  >
                    Price {sortIcon("price")}
                  </button>
                </th>

                <th>
                  <button
                    className="btn btn-link text-dark text-decoration-none fw-bold p-0"
                    onClick={() => onSort("quantity")}
                  >
                    Quantity {sortIcon("quantity")}
                  </button>
                </th>

                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.productImage ? (
                        <img
                          src={product.productImage}
                          alt={product.productName}
                          width={50}
                          height={50}
                          className="rounded object-fit-cover"
                        />
                      ) : (
                        <div
                          className="bg-light rounded d-flex align-items-center justify-content-center"
                          style={{ width: 50, height: 50 }}
                        >
                          📦
                        </div>
                      )}
                    </td>

                    <td>
                      <div className="fw-semibold">
                        {product.productName}
                      </div>
                      <small className="text-secondary">
                        {product.productCode}
                      </small>
                    </td>

                    <td>
                      <div>{product.category}</div>
                      <small className="text-secondary">
                        {product.brandName || "No brand"}
                      </small>
                    </td>

                    <td>
                      {product.discount > 0 ? (
                        <>
                          <div className="fw-semibold text-success">
                            ₹{discountedPrice(
                              product.price,
                              product.discount
                            ).toFixed(2)}
                          </div>
                          <small className="text-secondary text-decoration-line-through">
                            ₹{product.price}
                          </small>
                          <div className="text-danger small">
                            {product.discount}% OFF
                          </div>
                        </>
                      ) : (
                        <span className="fw-semibold">
                          ₹{product.price}
                        </span>
                      )}
                    </td>

                    <td>{product.quantity}</td>

                    <td>
                      <span
                        className={`badge ${
                          product.productStatus === "Available"
                            ? "bg-success-subtle text-success"
                            : "bg-danger-subtle text-danger"
                        }`}
                      >
                        {product.productStatus}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => onEdit(product)}
                          title="Edit product"
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDelete(product.id)}
                          title="Delete product"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div className="fs-1 mb-2">📦</div>
                    <h6 className="fw-semibold">No products found</h6>
                    <p className="text-secondary small mb-0">
                      {searchTerm
                        ? "Try searching with another keyword."
                        : "Add your first product using the form above."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="text-secondary small mt-3">
          {totalProducts === 0
            ? "No products to display"
            : `Total ${totalProducts} products`}
        </div>

      </div>
    </div>
  );
}
