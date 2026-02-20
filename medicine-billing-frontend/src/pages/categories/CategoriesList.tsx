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
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { ROUTES } from "../../Constants";
import { useCategories, useDeleteCategory } from "../../hooks/useCategories";
import { useMe } from "../../hooks/useMe";
import type { Category } from "../../types/category";

const CategoriesList = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ page: 1, search: "" });
  const limit = 10;

  const { data, isLoading, error } = useCategories(filters.page, limit, filters.search);
  const { mutateAsync: deleteCategory, isPending } = useDeleteCategory();
  const { data: me } = useMe();

  const categories = data?.categories ?? [];
  const pagination = data?.pagination;

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success("Category deleted");
    } catch {
      message.error("Failed to delete category");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (value: string) => value || "-",
    },
    ...(me?.role === "ADMIN"
      ? [
          {
            title: "Created By",
            key: "createdBy",
            render: (_: unknown, category: Category) => {
              const createdBy = category.createdBy;
              if (!createdBy || typeof createdBy === "string") return "-";
              return createdBy.name || createdBy.email || "-";
            },
          },
        ]
      : []),
    {
      title: "Action",
      key: "action",
      render: (_: unknown, category: Category) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(ROUTES.CATEGORY_EDIT.replace(":id", category._id))}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete category?"
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => handleDelete(category._id)}
          >
            <Button danger loading={isPending} icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <Card>
        <Typography.Text type="danger">Failed to load categories.</Typography.Text>
      </Card>
    );
  }

  return (
    <Card
      title={<Typography.Title level={4} style={{ margin: 0 }}>Categories</Typography.Title>}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTES.CREATE_CATEGORY)}
        >
          Add Category
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search category..."
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
        dataSource={categories}
        pagination={false}
        scroll={{ x: 700 }}
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

export default CategoriesList;
