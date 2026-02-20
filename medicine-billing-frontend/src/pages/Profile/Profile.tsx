import { useNavigate } from "react-router-dom";
import { Avatar, Button, Card, Descriptions, Popconfirm, Space, Tag, Typography } from "antd";
import { EditOutlined, LockOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { ROUTES } from "../../Constants";
import { useProfile, useDeleteAccount } from "../../hooks/useProfile";
import { useAuth } from "../../hooks/useAuth";

const Profile = () => {
  const navigate = useNavigate();
  const { data: user, isLoading } = useProfile();
  const { mutateAsync: deleteAccount, isPending } = useDeleteAccount();
  const { logout } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!user) return null;

  return (
    <Card style={{ maxWidth: 760, margin: "0 auto" }}>
      <Space align="start" style={{ width: "100%", justifyContent: "space-between" }}>
        <Space>
          <Avatar size={72} icon={<UserOutlined />} style={{ backgroundColor: "#1E6F5C" }} />
          <div>
            <Typography.Title level={4} style={{ margin: 0 }}>
              {user.name}
            </Typography.Title>
            <Typography.Text type="secondary">{user.email}</Typography.Text>
            <div style={{ marginTop: 8 }}>
              <Tag color="green">{user.role}</Tag>
            </div>
          </div>
        </Space>
      </Space>

      <Descriptions style={{ marginTop: 20 }} column={1} bordered size="small">
        <Descriptions.Item label="Phone">{user.phone || "-"}</Descriptions.Item>
        <Descriptions.Item label="Address">{user.address || "-"}</Descriptions.Item>
      </Descriptions>

      <Space style={{ marginTop: 16 }}>
        <Button icon={<EditOutlined />} onClick={() => navigate(ROUTES.EDITPROFILE)}>
          Edit Profile
        </Button>
        <Button icon={<LockOutlined />} onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}>
          Change Password
        </Button>
        <Button icon={<LogoutOutlined />} onClick={() => logout()}>
          Logout
        </Button>
        <Popconfirm
          title="Delete account?"
          description="Your account will be deleted."
          okText="Delete"
          cancelText="Cancel"
          onConfirm={() => deleteAccount()}
        >
          <Button danger loading={isPending}>Delete Account</Button>
        </Popconfirm>
      </Space>
    </Card>
  );
};

export default Profile;
