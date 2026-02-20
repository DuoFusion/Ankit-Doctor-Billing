import { useState } from "react";

interface Props {
  onClose: () => void;
  onCreate: (data: any) => Promise<void>;
  isLoading?: boolean;
}

const CreateUserModal = ({ onClose, onCreate, isLoading }: Props) => {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", role: "USER" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Create User</h2>

        <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" placeholder="Name" />
        <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" placeholder="Email" />
        <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" placeholder="Password" />
        <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-2" placeholder="Phone" />

        <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded px-3 py-2 mb-4">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm bg-gray-200 rounded disabled:opacity-50">Cancel</button>
          <button onClick={() => onCreate(form)} disabled={isLoading} className="px-4 py-2 text-sm bg-cyan-600 text-white rounded disabled:opacity-50">{isLoading ? "Creating..." : "Create"}</button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
