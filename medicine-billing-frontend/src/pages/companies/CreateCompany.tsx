import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { useCreateCompany } from "../../hooks/useCompanies";

const CreateCompany = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateCompany();

  const [form, setForm] = useState({
    companyName: "",
    gstNumber: "",
    address: "",
    phone: "",
    email: "",
    state: "",
  });

  const [logo, setLogo] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );

    if (logo) formData.append("logo", logo);

    await mutateAsync(formData);
    navigate(ROUTES.COMPANIES);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow">
      <h1 className="text-2xl font-semibold mb-6">Create Company</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          name="gstNumber"
          placeholder="GST Number"
          value={form.gstNumber}
          onChange={handleChange}
          required
          className="input"
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="input"
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="input"
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          className="input"
        />

        <textarea
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          className="input h-24"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
          className="block text-sm"
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-cyan-600 text-white py-3 rounded-xl
          hover:bg-cyan-700 transition disabled:opacity-50"
        >
          {isPending ? "Creating..." : "Create Company"}
        </button>
      </form>
    </div>
  );
};

export default CreateCompany;
