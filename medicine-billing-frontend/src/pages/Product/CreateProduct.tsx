import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompanies } from "../../hooks/useCompanies";
import { useCreateProduct } from "../../hooks/useProducts";
import { ROUTES } from "../../Constants";

const CreateProduct = () => {
  const navigate = useNavigate();

  const { data: companyData, isLoading } = useCompanies(1, 100, "");
  const { mutateAsync, isPending } = useCreateProduct();

  const companies = companyData?.companies ?? [];

  const [form, setForm] = useState({
    name: "",
    category: "",
    productType: "",
    companyId: "",
    mrp: "",
    price: "",
    taxPercent: "",
    stock: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await mutateAsync({
      ...form,
      mrp: Number(form.mrp),
      price: Number(form.price),
      taxPercent: Number(form.taxPercent),
      stock: Number(form.stock),
    });

    navigate(ROUTES.PRODUCTS);
  };

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading companies...
      </p>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create Product
        </h1>

        <form onSubmit={submit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
              className="w-full h-11 px-3 border rounded-lg mt-1"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Medicine, Grocery"
              required
              className="w-full h-11 px-3 border rounded-lg mt-1"
            />
          </div>

          {/* Product Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Product Type
            </label>
            <input
              name="productType"
              value={form.productType}
              onChange={handleChange}
              placeholder="Tablet / Syrup / Item"
              required
              className="w-full h-11 px-3 border rounded-lg mt-1"
            />
          </div>

          {/* Company */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Company
            </label>
            <select
              name="companyId"
              value={form.companyId}
              onChange={handleChange}
              required
              className="w-full h-11 px-3 border rounded-lg mt-1 bg-white"
            >
              <option value="">Select company</option>
              {companies.map((c: any) => (
                <option key={c._id} value={c._id}>
                  {c.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                MRP
              </label>
              <input
                name="mrp"
                type="number"
                value={form.mrp}
                onChange={handleChange}
                placeholder="Enter MRP"
                className="w-full h-11 px-3 border rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Selling Price
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter selling price"
                className="w-full h-11 px-3 border rounded-lg mt-1"
              />
            </div>
          </div>

          {/* Tax & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                GST (%)
              </label>
              <input
                name="taxPercent"
                type="number"
                value={form.taxPercent}
                onChange={handleChange}
                placeholder="e.g. 5"
                className="w-full h-11 px-3 border rounded-lg mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Opening Stock
              </label>
              <input
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                placeholder="e.g. 100"
                className="w-full h-11 px-3 border rounded-lg mt-1"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(ROUTES.PRODUCTS)}
              className="w-1/2 h-11 border rounded-lg"
            >
              Cancel
            </button>

            <button
              disabled={isPending}
              className="w-1/2 h-11 bg-teal-600 text-white rounded-lg
                         disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
