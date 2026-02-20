import { Modal, Select, Typography } from "antd";
import { useState } from "react";

interface Props {
  user: any;
  onClose: () => void;
  onSave: (role: string) => Promise<void>;
  isLoading?: boolean;
}

const EditUserModal = ({ user, onClose, onSave, isLoading }: Props) => {
  const [role, setRole] = useState(user.role);

  return (
    <Modal
      open
      title="Edit User Role"
      onCancel={onClose}
      onOk={() => onSave(role)}
      okText={isLoading ? "Saving..." : "Save"}
      okButtonProps={{ loading: isLoading }}
      destroyOnHidden
    >
      <Typography.Text type="secondary">{user.name}</Typography.Text>
      <div style={{ marginTop: 12 }}>
        <Select
          value={role}
          onChange={setRole}
          style={{ width: "100%" }}
          options={[
            { value: "USER", label: "USER" },
            { value: "ADMIN", label: "ADMIN" },
          ]}
          disabled={isLoading}
        />
      </div>
    </Modal>
  );
};

export default EditUserModal;
