import { Avatar, Space, Tag, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useMe } from "../../Hooks/useMe";
import { useProfile } from "../../Hooks/useProfile";

type NavbarProps = {
  compact?: boolean;
};

const Navbar = ({ compact = false }: NavbarProps) => {
  const { data: me } = useMe();
  const { data: profile } = useProfile();

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minWidth: 0 }}>
      <Typography.Title
        level={compact ? 5 : 5}
        style={{
          margin: 0,
          color: "#102A43",
          maxWidth: compact ? 150 : "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {compact ? "MedBill" : "Medicine Billing Management"}
      </Typography.Title>

      <Space size={compact ? 8 : 12}>
        <Avatar style={{ backgroundColor: "#1E6F5C" }} icon={<UserOutlined />} />
        <div style={{ lineHeight: 1.1, minWidth: 0 }}>
          <Typography.Text strong>{profile?.name || "User"}</Typography.Text>
          <div>
            <Tag color="green" style={{ marginTop: 4, borderRadius: 999 }}>
              {me?.role || "USER"}
            </Tag>
          </div>
        </div>
      </Space>
    </div>
  );
};

export default Navbar;
