// src/pages/bills/CreateBill.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { useCompanies } from "../../hooks/useCompanies";
import { useProducts } from "../../hooks/useProducts";
import { useCreateBill } from "../../hooks/useBills";

const CreateBill = () => {
  const navigate = useNavigate();
  const { data: companyData } = useCompanies(1, 100, "");
  const { data: productData } = useProducts(1, 100, "");
  const { mutateAsync, isPending } = useCreateBill();

  const companies = companyData?.companies ?? [];
  const products = productData?.products ?? [];

  const [companyId, setCompanyId] = useState("");
  const [discount, setDiscount] = useState(0);

  const [items, setItems] = useState<any[]>([
    {
      productId: "",
      qty: 1,
      freeQty: 0,
      rate: 0,
      mrp: 0,
      taxPercent: 0,
      discount: 0,
    },
  ]);

  /* ---------------- HELPERS ---------------- */

  const getProduct = (id: string) =>
    products.find((p: any) => p._id === id);

  const updateItem = (i: number, key: string, value: any) => {
    const copy = [...items];
    copy[i][key] = value;

    // auto-fill when product selected
    if (key === "productId") {
      const p = getProduct(value);
      if (p) {
        copy[i].rate = p.price;
        copy[i].mrp = p.mrp;
        copy[i].taxPercent = p.taxPercent || 0;
      }
    }

    setItems(copy);
  };

  const addRow = () =>
    setItems([
      ...items,
      {
        productId: "",
        qty: 1,
        freeQty: 0,
        rate: 0,
        mrp: 0,
        taxPercent: 0,
        discount: 0,
      },
    ]);

  const removeRow = (i: number) =>
    setItems(items.filter((_, index) => index !== i));

  /* ---------------- CALCULATIONS ---------------- */

  const rowTotals = useMemo(() => {
    return items.map((i) => {
      const amount = i.rate * i.qty;
      const discAmt = (amount * i.discount) / 100;
      const taxable = amount - discAmt;

      const cgst = (taxable * i.taxPercent) / 200;
      const sgst = (taxable * i.taxPercent) / 200;

      return {
        taxable,
        tax: cgst + sgst,
        total: taxable + cgst + sgst,
      };
    });
  }, [items]);

  const subTotal = rowTotals.reduce((s, r) => s + r.taxable, 0);
  const totalTax = rowTotals.reduce((s, r) => s + r.tax, 0);
  const grandTotal = subTotal + totalTax - discount;

  /* ---------------- SUBMIT ---------------- */

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    await mutateAsync({
      companyId,
      discount,
      items,
    });

    navigate(ROUTES.BILLING);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Bill</h1>

      <form onSubmit={submit} className="space-y-4">
        {/* Company */}
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Select Company</option>
          {companies.map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.companyName}
            </option>
          ))}
        </select>

        {/* Items */}
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Free</th>
                <th>Rate</th>
                <th>MRP</th>
                <th>GST%</th>
                <th>Disc%</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-t text-center">
                  <td>
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        updateItem(i, "productId", e.target.value)
                      }
                      className="border p-1"
                      required
                    >
                      <option value="">Product</option>
                      {products.map((p: any) => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(i, "qty", Number(e.target.value))
                      }
                      className="border p-1 w-16"
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={item.freeQty}
                      onChange={(e) =>
                        updateItem(i, "freeQty", Number(e.target.value))
                      }
                      className="border p-1 w-16"
                    />
                  </td>

                  <td>{item.rate}</td>
                  <td>{item.mrp}</td>

                  <td>{item.taxPercent}%</td>

                  <td>
                    <input
                      type="number"
                      value={item.discount}
                      onChange={(e) =>
                        updateItem(i, "discount", Number(e.target.value))
                      }
                      className="border p-1 w-16"
                    />
                  </td>

                  <td className="font-semibold">
                    ₹ {rowTotals[i]?.total.toFixed(2)}
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      className="text-red-600"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addRow}
          className="px-3 py-1 border rounded"
        >
          + Add Item
        </button>

        {/* TOTALS */}
        <div className="text-right space-y-1">
          <div>Sub Total: ₹ {subTotal.toFixed(2)}</div>
          <div>Tax: ₹ {totalTax.toFixed(2)}</div>

          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            placeholder="Bill Discount"
            className="border p-2 rounded w-48"
          />

          <div className="text-xl font-bold">
            Grand Total: ₹ {grandTotal.toFixed(2)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.BILLING)}
            className="border px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            {isPending ? "Saving..." : "Create Bill"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBill;
