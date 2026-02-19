import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { useProfile, useUpdateProfile } from "../../hooks/useProfile";

type FormState = {
  name: string;
  email: string;
};

const EditProfile = () => {
  const { data: user } = useProfile();
  const { mutateAsync, isPending } = useUpdateProfile();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);

  if (!user) return null;

  const handleSave = async () => {
    await mutateAsync(form);
    navigate(ROUTES.PROFILE);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border">
    <h1 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
      Update Profile
    </h1>

    {/* Name */}
    <div className="mb-5">
      <label className="block text-sm font-medium text-slate-600 mb-1">
        Name
      </label>
      <input
        value={form.name}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, name: e.target.value }))
        }
        placeholder="Enter your name"
        className="
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-cyan-500
          transition
        "
      />
    </div>

    {/* Email */}
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-600 mb-1">
        Email
      </label>
      <input
        value={form.email}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder="Enter your email"
        className="
          w-full px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-cyan-500
          transition
        "
      />
    </div>

    <button
      onClick={handleSave}
      disabled={isPending}
      className="
        w-full bg-cyan-600 text-white py-2.5 rounded-lg
        font-medium tracking-wide
        hover:bg-cyan-700
        active:scale-[0.98]
        transition
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {isPending ? "Saving..." : "Save Changes"}
    </button>

    <button
      onClick={() => navigate(ROUTES.PROFILE)}
      className="
        w-full mt-3 text-sm text-slate-500
        hover:text-slate-700
      "
    >
      Cancel
    </button>
  </div>
</div>
  );
};

export default EditProfile;
