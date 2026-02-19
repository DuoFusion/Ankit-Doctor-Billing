import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteProduct, useProducts } from "../../hooks/useProducts";
import { useMe } from "../../hooks/useMe";
import { ROUTES } from "../../Constants";
import type { Product } from "../../types/product";

const ProductsList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, isPending } = useProducts(page, limit, search);
  const { mutate, isPending: deletePending } = useDeleteProduct();
  const { data: meData } = useMe();

  const isAdmin = meData?.user?.role === "ADMIN";
  const products: Product[] = data?.products ?? [];

  if (isPending) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>

        <Link
          to={ROUTES.CREATE_PRODUCT}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
        >
          + Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, category, type..."
          className="w-full md:w-1/3 px-4 py-2 border rounded"
        />
      </div>

      {/* Empty */}
      {products.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No products found
        </p>
      )}

      {/* Table */}
      {products.length > 0 && (
        <div className="overflow-x-auto bg-white shadow rounded">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Company</th>

                {isAdmin && (
                  <th className="px-4 py-3 text-left">Added By</th>
                )}

                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3 text-right">MRP</th>
                <th className="px-4 py-3 text-right">GST %</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, index) => (
                <tr
                  key={p._id}
                  className={`border-t ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3">{p.category}</td>
                  <td className="px-4 py-3">{p.productType}</td>
                  <td className="px-4 py-3">
                    {p.companyId?.companyName ?? "—"}
                  </td>

                  {isAdmin && (
                    <td className="px-4 py-3 text-sm">
                      {p.createdBy?.name ?? "—"}
                    </td>
                  )}

                  <td className="px-4 py-3 text-right font-semibold">
                    {p.stock ?? 0}
                  </td>

                  <td className="px-4 py-3 text-right">
                    ₹ {p.mrp ?? 0}
                  </td>

                  <td className="px-4 py-3 text-right">
                    {p.taxPercent ?? 0} %
                  </td>

                  <td className="px-4 py-3 text-right font-semibold text-green-700">
                    ₹ {p.price}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <Link
                        to={`${ROUTES.PRODUCTS}/${p._id}/edit`}
                        className="px-3 py-1 border border-blue-500 text-blue-600 rounded"
                      >
                        Edit
                      </Link>

                      
                        <button
                          onClick={() => mutate(p._id)}
                          disabled={deletePending}
                          className="px-3 py-1 border border-red-500 text-red-600 rounded disabled:opacity-50"
                        >
                          Delete
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-3 py-1">Page {page}</span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsList;
