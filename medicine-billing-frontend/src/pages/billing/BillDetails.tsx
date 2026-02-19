import { useRef } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useBill } from "../../hooks/useBills";

/* =====================
   LOGO URL HELPER
===================== */
const getLogoUrl = (logo?: string) => {
  if (!logo) return "";
  if (logo.startsWith("http")) return logo;
  return `${import.meta.env.VITE_API_URL}/${logo}`;
};

const BillView = () => {
  const { id } = useParams();
  const { data, isLoading } = useBill(id!);

  const printRef = useRef<HTMLDivElement>(null);

  /* =====================
     PRINT FUNCTION (TS SAFE)
  ===================== */
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Invoice",
  });

  if (isLoading) return <p>Loading...</p>;
  if (!data) return null;

  const { bill, items } = data;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* PRINT BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handlePrint}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Print / Download PDF
        </button>
      </div>

      {/* ================= PRINT AREA ================= */}
      <div ref={printRef} className="border p-6 bg-white text-black">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <div className="flex items-center gap-3">
            {/* COMPANY LOGO FROM API */}
            {bill.companyId?.logo && (
                
              <img
                src={getLogoUrl(bill.companyId.logo)}
                alt="Company Logo"
                className="h-16 w-16 object-contain"
              />
            )}

            <div>
              <h2 className="text-xl font-bold">
                {bill.companyId?.companyName}
              </h2>
              <p>GST No: {bill.companyId?.gstNumber || "-"}</p>
            </div>
          </div>

          <div className="text-right">
            <h3 className="text-lg font-semibold">TAX INVOICE</h3>
            <p>Bill No: {bill.billNo}</p>
            <p>
              Date:{" "}
              {new Date(bill.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Product</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i: any) => (
              <tr key={i._id} className="text-center">
                <td className="border p-2">{i.productName}</td>
                <td className="border p-2">{i.qty}</td>
                <td className="border p-2">₹ {i.rate}</td>
                <td className="border p-2">₹ {i.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER */}
        <div className="flex justify-end mt-4">
          <h3 className="text-lg font-bold">
            Grand Total: ₹ {bill.grandTotal.toFixed(2)}
          </h3>
        </div>
      </div>
      {/* ================= END PRINT AREA ================= */}
    </div>
  );
};

export default BillView;
