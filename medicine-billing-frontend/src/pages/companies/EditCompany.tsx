import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ROUTES } from "../../Constants";
import { useCompanies, useUpdateCompany } from "../../hooks/useCompanies";

const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useCompanies(1, 100, "" );
  const { mutate, isPending } = useUpdateCompany();

  const company = data?.companies.find((c) => c._id === id);

  const [form, setForm] = useState({
    companyName: "",
    gstNumber: "",
    email: "",
    phone: "",
    state: "",
    address: "",
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (company) {
      setForm({
        companyName: company.companyName || "",
        gstNumber: company.gstNumber || "",
        email: company.email || "",
        phone: company.phone || "",
        state: company.state || "",
        address: company.address || "",
      });

      if (company.logo) {
        setPreview(
          `${import.meta.env.VITE_API_URL}/uploads/${company.logo}`
        );
      }
    }
  }, [company]);

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!company) return <p className="text-center mt-10">Company not found</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );

    if (logo) {
      formData.append("logo", logo);
    }

    mutate(
      { id: company._id, formData },
      {
        onSuccess: () => {
          navigate(`${ROUTES.COMPANIES}/${company._id}`);
        },
      }
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link
        to={`${ROUTES.COMPANIES}/${company._id}`}
        className="text-cyan-600 text-sm hover:underline"
      >
        ← Back to Details
      </Link>

      <div className="bg-white mt-4 p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-6">Edit Company</h1>

        {/* LOGO */}
        <div className="mb-6">
          <div className="h-28 w-28 border rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
            {preview ? (
              <img
                src={preview}
                alt="Company Logo"
                className="object-contain h-full w-full"
              />
            ) : (
              <span className="text-xs text-gray-400">No Logo</span>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="mt-2 text-sm"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="companyName" value={form.companyName} onChange={handleChange} className="input" />
          <input name="gstNumber" value={form.gstNumber} onChange={handleChange} className="input" />
          <input name="email" value={form.email} onChange={handleChange} className="input" />
          <input name="phone" value={form.phone} onChange={handleChange} className="input" />
          <input name="state" value={form.state} onChange={handleChange} className="input" />
          <textarea name="address" value={form.address} onChange={handleChange} className="input h-24" />

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-cyan-600 text-white py-2 rounded-lg
            hover:bg-cyan-700 disabled:opacity-60"
          >
            {isPending ? "Updating..." : "Update Company"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCompany;
