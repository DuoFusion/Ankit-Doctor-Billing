import { Link } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { useProfile, useDeleteAccount } from "../../hooks/useProfile";

const Profile = () => {
  const { data: user, isLoading } = useProfile();
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccount();

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return null;

  const handleDelete = async () => {
    const ok = confirm("Are you sure? Your account will be deleted.");
    if (!ok) return;
    await deleteAccount();
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-xl font-semibold mt-3 text-slate-800">
            {user.name}
          </h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>

        {/* Info */}
        <div className="space-y-4 text-sm text-slate-700">
          <div className="flex justify-between">
            <span className="font-medium">Role</span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs">
              {user.role}
            </span>
          </div>
        </div>

        {/* Actions */}
        <Link
          to={ROUTES.EDITPROFILE}
          className="
            block w-full mt-6 text-center bg-cyan-600 text-white py-2.5 rounded-lg
            hover:bg-cyan-700 transition font-medium
          "
        >
          Edit Profile
        </Link>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="
            w-full mt-3 py-2.5 rounded-lg border border-red-500 text-red-600
            hover:bg-red-50 transition disabled:opacity-50
          "
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
