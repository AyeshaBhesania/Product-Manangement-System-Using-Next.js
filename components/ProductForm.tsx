
"use client";

import { useEffect, useState } from "react";

export interface ProductData {
  productName: string;
  productCode: string;
  productImage: string;
  category: string;
  brandName: string;
  price: number;
  discount: number;
  quantity: number;
  description: string;
  availableColors: string[];
  productSize: string;
  manufacturingDate: string;
  expiryDate: string;
  productStatus: string;
}

export interface Product extends ProductData {
  id: string;
}

interface ProductFormProps {
  onSave: (product: ProductData) => void;
  editingProduct: Product | null;
  onCancelEdit: () => void;
}

const initialForm: ProductData = {
  productName: "",
  productCode: "",
  productImage: "",
  category: "",
  brandName: "",
  price: 0,
  discount: 0,
  quantity: 0,
  description: "",
  availableColors: [],
  productSize: "",
  manufacturingDate: "",
  expiryDate: "",
  productStatus: "Available",
};

const colors = ["Black", "White", "Blue", "Red", "Green"];

export default function ProductForm({
  onSave,
  editingProduct,
  onCancelEdit,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductData>(initialForm);

  useEffect(() => {
    if (editingProduct) {
      const { id, ...productData } = editingProduct;
      setFormData(productData);
    } else {
      setFormData(initialForm);
    }
  }, [editingProduct]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "discount" || name === "quantity"
          ? Number(value)
          : value,
    }));
  }

  function handleColorChange(color: string) {
    setFormData((prev) => ({
      ...prev,
      availableColors: prev.availableColors.includes(color)
        ? prev.availableColors.filter((c) => c !== color)
        : [...prev.availableColors, color],
    }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("Image size must be less than 1 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        productImage: reader.result as string,
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      formData.manufacturingDate &&
      formData.expiryDate &&
      formData.expiryDate < formData.manufacturingDate
    ) {
      alert("Expiry date cannot be before manufacturing date.");
      return;
    }

    if (!formData.availableColors.length) {
      alert("Please select at least one available color.");
      return;
    }

    onSave(formData);
    setFormData(initialForm);
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-1">
          {editingProduct ? "Update Product" : "Add New Product"}
        </h4>

        <p className="text-secondary mb-4">
          Enter your product information below.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label fw-semibold">Product Name *</label>
              <input
                type="text"
                className="form-control"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Product Code *</label>
              <input
                type="text"
                className="form-control"
                name="productCode"
                value={formData.productCode}
                onChange={handleChange}
                placeholder="e.g. PRD001"
                required
              />
            </div>

           


<div className="col-md-6">
  <label className="form-label fw-semibold">Product Image</label>

  <input
    type="file"
    className="form-control"
    accept="image/*"
    onChange={handleImageChange}
  />

  <select
    className="form-select mt-2"
    value={
      formData.productImage.startsWith("/images/")
        ? formData.productImage
        : ""
    }
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        productImage: e.target.value,
      }))
    }
  >
    <option value="" disabled>
      Or choose a sample image
    </option>
    <option value="/images/kellogs.jpg">Kellogs</option>
    <option value="/images/microwave.jpg">Microwave</option>
    <option value="/images/plushies.jpg">Plushies</option>
    <option value="/images/rabbit toy.webp">Rabbit Toy</option>
    <option value="/images/watch.webp">Watch</option>
    <option value="/images/apple.webp">Apple</option>
    <option value="/images/dress.webp">Dress</option>
    <option value="/images/jam.jpg">Jam</option>
    <option value="/images/bread.jpg">Bread</option>
  </select>

  {formData.productImage && (
    <img
      src={formData.productImage}
      alt="Product preview"
      width={75}
      height={75}
      className="mt-2 rounded object-fit-cover"
    />
  )}
</div>



            <div className="col-md-6">
              <label className="form-label fw-semibold">Category *</label>
              <select
                className="form-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Grocery</option>
                <option>Accessories</option>
                <option>Furniture</option>
                <option>Other</option>
              </select>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Brand Name</label>
              <input
                type="text"
                className="form-control"
                name="brandName"
                value={formData.brandName}
                onChange={handleChange}
                placeholder="Enter brand name"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Price (₹) *</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Discount (%)</label>
              <input
                type="number"
                className="form-control"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Quantity *</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Product Size</label>
              <select
                className="form-select"
                name="productSize"
                value={formData.productSize}
                onChange={handleChange}
              >
                <option value="">Select Size</option>
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
                <option>XXL</option>
                <option>Free Size</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your product..."
              />
            </div>

            <div className="col-12">
              <label className="form-label fw-semibold d-block">
                Available Colors *
              </label>

              {colors.map((color) => (
                <div className="form-check form-check-inline" key={color}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={color}
                    checked={formData.availableColors.includes(color)}
                    onChange={() => handleColorChange(color)}
                  />
                  <label className="form-check-label" htmlFor={color}>
                    {color}
                  </label>
                </div>
              ))}
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Manufacturing Date
              </label>
              <input
                type="date"
                className="form-control"
                name="manufacturingDate"
                value={formData.manufacturingDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Expiry Date</label>
              <input
                type="date"
                className="form-control"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Product Status</label>
              <select
                className="form-select"
                name="productStatus"
                value={formData.productStatus}
                onChange={handleChange}
              >
                <option value="Available">Available</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>

            <div className="col-12 d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary px-4">
                {editingProduct ? "Update Product" : "Add Product"}
              </button>

              {editingProduct && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={onCancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
