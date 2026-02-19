import { useState } from "react";

interface Props {
  user: any;
  onClose: () => void;
  onSave: (role: string) => Promise<void>;
  isLoading?: boolean; // ✅ ADD THIS
}

const EditUserModal = ({ user, onClose, onSave, isLoading }: Props) => {
  const [role, setRole] = useState(user.role);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Edit User</h2>

        <p className="text-sm text-gray-600 mb-2">{user.name}</p>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          disabled={isLoading}
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(role)}
            disabled={isLoading}
            className="px-4 py-2 text-sm bg-cyan-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
