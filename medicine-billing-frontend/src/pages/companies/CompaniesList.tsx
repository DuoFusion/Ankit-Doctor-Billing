import { Link } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { useCompanies, useDeleteCompany } from "../../hooks/useCompanies";
import { useState } from "react";

const CompaniesList = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, isLoading } = useCompanies(page, limit, search);
  const { mutate: deleteCompany, isPending } = useDeleteCompany();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  const companies = data?.companies ?? [];
  const pagination = data?.pagination;

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      setDeletingId(id);
      deleteCompany(id, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Companies</h1>

        <Link
          to={ROUTES.CREATE_COMPANY}
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Company
        </Link>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => {
          setPage(1);
          setSearch(e.target.value);
        }}
        placeholder="Search company..."
        className="w-full mb-5 px-3 py-2 border rounded-lg"
      />

      {/* Empty */}
      {companies.length === 0 && (
        <p className="text-center text-gray-500 mt-20">
          No companies found
        </p>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company: any) => (
          <div
            key={company._id}
            className="border rounded-2xl p-5 bg-white shadow-sm
            hover:shadow-md transition flex flex-col justify-between"
          >
            <Link to={`${ROUTES.COMPANIES}/${company._id}`}>
              <h2 className="text-lg font-semibold mb-1">
                {company.companyName}
              </h2>
              <p className="text-sm text-gray-500">
                {company.gstNumber}
              </p>
            </Link>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleDelete(company._id)}
                disabled={isPending && deletingId === company._id}
                className="bg-red-600 text-white px-3 py-1 rounded
                disabled:opacity-60"
              >
                {isPending && deletingId === company._id
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-end gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-3 py-1">
            Page {page} of {pagination.totalPages}
          </span>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CompaniesList;
