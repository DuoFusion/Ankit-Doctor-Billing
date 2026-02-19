import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { VerifyOtpPayload } from "../../types";
import { ROUTES } from "../../Constants";

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOtp, loading } = useAuth();

  const emailFromState = location.state?.email || "";

  const [formData, setFormData] = useState<VerifyOtpPayload>({
    email: emailFromState,
    otp: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      await verifyOtp(formData)
      alert("OTP verified successfully!");
      navigate(ROUTES.DASHBOARD);
      
    } catch (error: any) {
      alert("OTP verification failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-semibold text-center">
          Verify OTP
        </h2>

        {/* Email readonly */}
        <input
          type="email"
          name="email"
          value={formData.email}
          readOnly
          className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
        />

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={formData.otp}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
