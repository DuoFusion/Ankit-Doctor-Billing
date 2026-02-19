import { useState } from "react";
import { useUsers, useUpdateUser } from "../../hooks/useUsers";
import EditUserModal from "../../components/EditUserModal";

const Users = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 10;

  const {
    data,
    isLoading,
    isFetching, // 👈 background fetching (NO UI blink)
  } = useUsers(page, limit, search);

  const { mutateAsync: updateUser } = useUpdateUser();
  const [selectedUser, setSelectedUser] = useState<any>(null);

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-gray-500">Loading users...</p>
    );
  }

  if (!data) {
    return <p className="text-center mt-10">No access</p>;
  }

  const { users, pagination } = data;

  const handleSave = async (role: string) => {
    await updateUser({
      id: selectedUser._id,
      role,
    });
    setSelectedUser(null);
  };

  return (
    <div className="p-6">
      {/* ================= Header + Search ================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-semibold">All Users</h1>

        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search by name or email..."
          className="w-full md:w-72 px-4 py-2 border rounded-lg
                     focus:ring-2 focus:ring-teal-500 outline-none"
        />
      </div>

      {/* ================= Table ================= */}
      <div className="relative">
        {/* Background loading overlay */}
        {isFetching && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-xl">
            <p className="text-sm text-gray-500">Updating...</p>
          </div>
        )}

        <table className="w-full bg-white border rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-10 text-gray-500"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u: any) => (
                <tr
                  key={u._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded bg-gray-100">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="px-3 py-1 text-sm bg-yellow-500
                                 text-white rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= Pagination ================= */}
      <div className="flex justify-between items-center mt-6">
        <span className="text-sm text-gray-500">
          Page {pagination.page} of {pagination.totalPages}
        </span>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-1.5 border rounded-lg
                       disabled:opacity-50 hover:bg-gray-50"
          >
            Prev
          </button>

          <button
            disabled={page === pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-1.5 border rounded-lg
                       disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= Modal ================= */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Users;
