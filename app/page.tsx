
"use client";

import { useEffect, useMemo, useState } from "react";
import ProductForm, { Product, ProductData } from "@/components/ProductForm";
import ProductTable from "@/components/ProductTable";
import Pagination from "@/components/Pagination";
import Notification from "@/components/Notification";

const PRODUCTS_PER_PAGE = 3;

type NotificationState = {
  message: string;
  type: "success" | "danger";
};

const sampleProducts: Product[] = [
  {
    id: "sample-1",
    productName: "Kellogg's Corn Flakes",
    productCode: "PRD001",
    productImage: "/images/kellogs.jpg",
    category: "Grocery",
    brandName: "Kellogg's",
    price: 250,
    discount: 10,
    quantity: 30,
    description: "Crispy corn flakes breakfast cereal.",
    availableColors: ["Yellow"],
    productSize: "Free Size",
    manufacturingDate: "2026-01-10",
    expiryDate: "2027-01-10",
    productStatus: "Available",
  },
  {
    id: "sample-2",
    productName: "Microwave Oven",
    productCode: "PRD002",
    productImage: "/images/microwave.jpg",
    category: "Electronics",
    brandName: "Samsung",
    price: 8500,
    discount: 5,
    quantity: 12,
    description: "Compact microwave oven for everyday cooking.",
    availableColors: ["Black", "White"],
    productSize: "Free Size",
    manufacturingDate: "2026-02-01",
    expiryDate: "",
    productStatus: "Available",
  },
  {
    id: "sample-3",
    productName: "Cute Plushies",
    productCode: "PRD003",
    productImage: "/images/plushies.jpg",
    category: "Accessories",
    brandName: "Soft Toys",
    price: 499,
    discount: 0,
    quantity: 25,
    description: "Soft and adorable plush toys.",
    availableColors: ["Pink", "White"],
    productSize: "M",
    manufacturingDate: "",
    expiryDate: "",
    productStatus: "Available",
  },
  {
    id: "sample-4",
    productName: "Wrist Watch",
    productCode: "PRD004",
    productImage: "/images/watch.webp",
    category: "Accessories",
    brandName: "Classic",
    price: 1999,
    discount: 15,
    quantity: 8,
    description: "Stylish wrist watch for daily use.",
    availableColors: ["Black", "Blue"],
    productSize: "Free Size",
    manufacturingDate: "",
    expiryDate: "",
    productStatus: "Available",
  },
  {
    id: "sample-5",
    productName: "Fresh Apples",
    productCode: "PRD005",
    productImage: "/images/apple.webp",
    category: "Grocery",
    brandName: "Fresh Farm",
    price: 180,
    discount: 0,
    quantity: 0,
    description: "Fresh and juicy apples.",
    availableColors: ["Red", "Green"],
    productSize: "Free Size",
    manufacturingDate: "2026-11-15",
    expiryDate: "2026-11-30",
    productStatus: "Out of Stock",
  },
  {
    id: "sample-6",
    productName: "Fresh Bread",
    productCode: "PRD006",
    productImage: "/images/bread.jpg",
    category: "Grocery",
    brandName: "Daily Bakery",
    price: 45,
    discount: 5,
    quantity: 20,
    description: "Freshly baked bread.",
    availableColors: ["White"],
    productSize: "Free Size",
    manufacturingDate: "2026-11-18",
    expiryDate: "2026-11-23",
    productStatus: "Available",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Product>("productName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "success",
  });

  // Load products from LocalStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem("products");

    let loadedProducts: Product[] = [];

    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);

        if (Array.isArray(parsed)) {
          loadedProducts = parsed;
        }
      } catch {
        loadedProducts = [];
      }
    }

    // Add sample products that are missing
    const existingIds = new Set(
      loadedProducts.map((product) => product.id)
    );

    const missingSamples = sampleProducts.filter(
      (product) => !existingIds.has(product.id)
    );

    loadedProducts = [...loadedProducts, ...missingSamples];

    setProducts(loadedProducts);
    setIsLoaded(true);
  }, []);

  // Save products to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products, isLoaded]);

  // Show notification
  function showNotification(
    message: string,
    type: "success" | "danger"
  ) {
    setNotification({ message, type });
  }

  // Add or update product
  function handleSave(productData: ProductData) {
    const duplicateCode = products.some(
      (product) =>
        product.productCode.toLowerCase() ===
          productData.productCode.toLowerCase() &&
        product.id !== editingProduct?.id
    );

    if (duplicateCode) {
      showNotification("Product code already exists!", "danger");
      return;
    }

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? { ...productData, id: editingProduct.id }
            : product
        )
      );

      setEditingProduct(null);
      showNotification("Product updated successfully!", "success");
    } else {
      const newProduct: Product = {
        ...productData,
        id: crypto.randomUUID(),
      };

      setProducts((prev) => [newProduct, ...prev]);
      setCurrentPage(1);
      showNotification("Product added successfully!", "success");
    }
  }

  // Edit product
  function handleEdit(product: Product) {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Delete product
  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setProducts((prev) => prev.filter((product) => product.id !== id));
    setEditingProduct((prev) => (prev?.id === id ? null : prev));

    showNotification("Product deleted successfully!", "success");
  }

  // Sort products
  function handleSort(field: keyof Product) {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  // Search and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      const search = searchTerm.toLowerCase();

      return (
        product.productName.toLowerCase().includes(search) ||
        product.productCode.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.brandName.toLowerCase().includes(search)
      );
    });

    return [...filtered].sort((a, b) => {
      const first = a[sortBy];
      const second = b[sortBy];

      const comparison =
        typeof first === "number" && typeof second === "number"
          ? first - second
          : String(first).localeCompare(String(second));

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [products, searchTerm, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(
    filteredProducts.length / PRODUCTS_PER_PAGE
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // Dashboard statistics
  const totalStock = products.reduce(
    (total, product) => total + product.quantity,
    0
  );

  const availableProducts = products.filter(
    (product) => product.productStatus === "Available"
  ).length;

  const categories = new Set(
    products.map((product) => product.category)
  ).size;

  if (!isLoaded) {
    return <div className="container py-5">Loading products...</div>;
  }

  return (
    <main className="container py-4 py-md-5">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">Product Management System</h2>
        <p className="text-secondary">
          Manage your inventory, products and stock in one place.
        </p>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() =>
          setNotification({ message: "", type: "success" })
        }
      />

      {/* Dashboard Statistics */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body">
              <p className="text-secondary small mb-2">
                Total Products
              </p>
              <h3 className="fw-bold mb-0">{products.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body">
              <p className="text-secondary small mb-2">
                Available Products
              </p>
              <h3 className="fw-bold text-success mb-0">
                {availableProducts}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body">
              <p className="text-secondary small mb-2">
                Total Stock
              </p>
              <h3 className="fw-bold mb-0">{totalStock}</h3>
            </div>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body">
              <p className="text-secondary small mb-2">
                Categories
              </p>
              <h3 className="fw-bold mb-0">{categories}</h3>
            </div>
          </div>
        </div>
      </div>

      <ProductForm
        onSave={handleSave}
        editingProduct={editingProduct}
        onCancelEdit={() => setEditingProduct(null)}
      />

      <ProductTable
        products={paginatedProducts}
        searchTerm={searchTerm}
        onSearchChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        totalProducts={filteredProducts.length}
      />

      <Pagination
        currentPage={currentPage}
        totalProducts={filteredProducts.length}
        productsPerPage={PRODUCTS_PER_PAGE}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}
