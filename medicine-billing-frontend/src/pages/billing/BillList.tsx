import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBills, useDeleteBill } from "../../hooks/useBills";
import { ROUTES } from "../../Constants";

const BillList = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useBills(page, 10, search);
  const { mutate } = useDeleteBill();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bill no"
          className="border px-3 py-2 rounded"
        />

        <button
          onClick={() => navigate(ROUTES.CREATE_BILL)}
          className="bg-teal-600 text-white px-4 py-2 rounded"
        >
          + New Bill
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-center">
            <th>Bill No</th>
            <th>Company</th>
            <th>Added By</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data?.data.map((b: any) => (
            <tr key={b._id} className="border-t text-center">
              <td>{b.billNo}</td>

              {/* ✅ Company name */}
              <td>{b.companyId?.name || "-"}</td>

              {/* ✅ User name */}
              <td>{b.userId?.name || "-"}</td>

              <td>₹ {b.grandTotal.toFixed(2)}</td>

              <td className="space-x-3">
                <button
                  onClick={() =>
                    navigate(`${ROUTES.BILLING}/${b._id}`)
                  }
                  className="text-blue-600"
                >
                  View
                </button>

                <button
                  onClick={() => mutate(b._id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mt-4">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))}>
          Prev
        </button>
        <span>{page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default BillList;
