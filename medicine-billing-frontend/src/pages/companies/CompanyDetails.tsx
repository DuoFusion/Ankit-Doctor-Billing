import { useParams, Link } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { useCompanies } from "../../hooks/useCompanies";

const CompanyDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useCompanies(1, 100, ""); // Fetch all companies to find the one with matching ID

  if (isLoading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  const company = data?.companies.find((c) => c._id === id);

  if (!company) {
    return <p className="text-center mt-20">Company not found</p>;
  }

  // ✅ CORRECT LOGO URL
  const logoUrl =
    company.logo &&
    `http://localhost:5000/uploads/${company.logo}`;

  console.log("LOGO URL =>", logoUrl);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to={ROUTES.COMPANIES}
          className="text-cyan-600 text-sm hover:underline"
        >
          ← Back to Companies
        </Link>

        <Link
          to={`${ROUTES.COMPANIES}/${company._id}/edit`}
          className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 text-sm"
        >
          Edit Company
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white p-8 rounded-2xl shadow">
        <div className="flex items-start gap-6">
          {/* LOGO */}
          <div className="h-32 w-32 flex items-center justify-center border rounded-xl bg-gray-50 overflow-hidden">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Company Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  console.error("Image load error");
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/150?text=No+Logo";
                }}
              />
            ) : (
              <span className="text-gray-400 text-sm text-center">
                No Logo
              </span>
            )}
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-semibold mb-1">
              {company.companyName}
            </h1>
            <p className="text-sm text-gray-500">
              GST: {company.gstNumber}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-6">
          <p><b>Email:</b> {company.email || "-"}</p>
          <p><b>Phone:</b> {company.phone || "-"}</p>
          <p><b>State:</b> {company.state || "-"}</p>

          <p className="md:col-span-2">
            <b>Address:</b> {company.address || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
