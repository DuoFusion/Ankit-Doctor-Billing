import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, Typography } from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  ApartmentOutlined,
  TagsOutlined,
  ShoppingOutlined,
  TeamOutlined,
  FileDoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { ROUTES } from "../../Constants";
import { useMe } from "../../Hooks/useMe";

type SidebarProps = {
  onNavigate?: () => void;
};

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const { data, isLoading } = useMe();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading || !data) return null;

  const role = data.role;

  const menuItems: MenuProps["items"] = useMemo(
    () =>
      [
        {
          key: ROUTES.DASHBOARD,
          icon: <AppstoreOutlined />,
          label: "Dashboard",
          roles: ["ADMIN", "USER"],
        },
        {
          key: ROUTES.PRODUCTS,
          icon: <ShoppingOutlined />,
          label: "Medicines",
          roles: ["ADMIN", "USER"],
        },
        {
          key: ROUTES.COMPANIES,
          icon: <ApartmentOutlined />,
          label: "Companies",
          roles: ["ADMIN", "USER"],
        },
        {
          key: ROUTES.CATEGORIES,
          icon: <TagsOutlined />,
          label: "Categories",
          roles: ["ADMIN", "USER"],
        },
        {
          key: ROUTES.BILLING,
          icon: <FileDoneOutlined />,
          label: "Billing",
          roles: ["ADMIN", "USER"],
        },
        {
          key: ROUTES.USERS,
          icon: <TeamOutlined />,
          label: "Users",
          roles: ["ADMIN"],
        },
        {
          key: ROUTES.PROFILE,
          icon: <UserOutlined />,
          label: "Profile",
          roles: ["ADMIN", "USER"],
        },
      ].filter((item) => item.roles.includes(role)) as MenuProps["items"],
    [role]
  );

  const selectedKey =
    (menuItems || [])
      .map((item: any) => item.key)
      .find((key: string) => location.pathname.startsWith(key)) || ROUTES.DASHBOARD;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 16px", borderBottom: "1px solid #1b3f60" }}>
        <Typography.Title level={5} style={{ margin: 0, color: "#ffffff" }}>
          MedBill Pro
        </Typography.Title>
        <Typography.Text style={{ color: "#9FB3C8", fontSize: 12 }}>
          Billing & Inventory
        </Typography.Text>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }: { key: string }) => {
          navigate(key);
          onNavigate?.();
        }}
        style={{ borderRight: 0, paddingTop: 8, background: "transparent" }}
      />
    </div>
  );
};

export default Sidebar;
