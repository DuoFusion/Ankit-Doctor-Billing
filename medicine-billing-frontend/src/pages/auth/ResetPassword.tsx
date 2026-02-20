import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resetPasswordApi } from "../../api/auth.api";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || "";
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await resetPasswordApi({ email, otp, newPassword });
      alert("Password reset successful");
      navigate("/");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-5">
        <h2 className="text-2xl font-semibold text-center">Reset Password</h2>

        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
          className="w-full p-3 border rounded-lg"
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full p-3 border rounded-lg"
        />

        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-3 rounded-lg">
          {loading ? "Saving..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
