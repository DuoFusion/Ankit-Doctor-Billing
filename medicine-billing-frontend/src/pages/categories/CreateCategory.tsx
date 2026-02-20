import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Typography, message } from "antd";
import axios from "axios";
import { ROUTES } from "../../Constants";
import { useCreateCategory } from "../../hooks/useCategories";

const CreateCategory = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateCategory();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { name: string; description?: string }) => {
    try {
      await mutateAsync({
        name: values.name,
        description: values.description || undefined,
      });
      message.success("Category created");
      navigate(ROUTES.CATEGORIES);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message || "Failed to create category");
        return;
      }
      message.error("Failed to create category");
    }
  };

  return (
    <Card style={{ maxWidth: 720, margin: "0 auto" }}>
      <Typography.Title level={4}>Create Category</Typography.Title>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 16 }}
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Category Name"
          rules={[{ required: true, message: "Category name is required" }]}
        >
          <Input placeholder="Enter category name" />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea rows={4} placeholder="Enter description (optional)" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Create Category
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateCategory;
