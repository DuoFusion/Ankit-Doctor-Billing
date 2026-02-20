import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Pagination,
  Popconfirm,
  Space,
  Table,
  Typography,
  App,
} from "antd";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined } from "@ant-design/icons";
import { ROLE, ROUTES } from "../../Constants";
import { useCompanies, useDeleteCompany } from "../../hooks/useCompanies";
import { useMe } from "../../hooks/useMe";
import type { Company } from "../../types/company";

const CompaniesList = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 1, search: "" });
  const limit = 10;

  const { data, isLoading } = useCompanies(filters.page, limit, filters.search);
  const { mutateAsync: deleteCompany, isPending } = useDeleteCompany();
  const { data: me } = useMe();
  const isAdmin = me?.role === ROLE.ADMIN;
  const companies: Company[] = data?.companies ?? [];
  const pagination = data?.pagination;

  const handleDelete = async (id: string) => {
    try {
      await deleteCompany(id);
      message.success("Company deleted");
    } catch {
      message.error("Failed to delete company");
    }
  };

  const columns = [
    { title: "Company", dataIndex: "companyName", key: "companyName" },
    { title: "GST", dataIndex: "gstNumber", key: "gstNumber" },
    { title: "Email", dataIndex: "email", key: "email", render: (v: string) => v || "-" },
    { title: "Phone", dataIndex: "phone", key: "phone", render: (v: string) => v || "-" },
    ...(isAdmin
      ? [
          {
            title: "Created By",
            key: "createdBy",
            render: (_: unknown, company: Company) => {
              const owner = company.userId;
              if (!owner || typeof owner === "string") return "-";
              return owner.name || owner.email || "-";
            },
          },
        ]
      : []),
    {
      title: "Action",
      key: "action",
      render: (_: unknown, company: Company) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => navigate(`${ROUTES.COMPANIES}/${company._id}`)}>
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`${ROUTES.COMPANIES}/${company._id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete company?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(company._id)}
          >
            <Button danger icon={<DeleteOutlined />} loading={isPending}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<Typography.Title level={4} style={{ margin: 0 }}>Companies</Typography.Title>}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTES.CREATE_COMPANY)}
        >
          Add Company
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search company..."
          allowClear
          value={filters.search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFilters({ page: 1, search: e.target.value });
          }}
          style={{ maxWidth: 360 }}
        />
      </div>

      <Table
        rowKey="_id"
        loading={isLoading}
        columns={columns}
        dataSource={companies}
        pagination={false}
        scroll={{ x: 900 }}
      />

      <div style={{ marginTop: 16, display: "flex", justifyContent: "end" }}>
        <Pagination
          current={filters.page}
          pageSize={limit}
          total={pagination?.total || 0}
          onChange={(p: number) =>
            setFilters((prev) => ({ ...prev, page: p }))
          }
          showSizeChanger={false}
        />
      </div>
    </Card>
  );
};

export default CompaniesList;
