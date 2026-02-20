import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, InputNumber, Select, Typography, App } from "antd";
import { useCompanies } from "../../hooks/useCompanies";
import { useCreateProduct } from "../../hooks/useProducts";
import { ROUTES } from "../../Constants";
import { useCategoryDropdown } from "../../hooks/useCategories";

const CreateProduct = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { data: companyData, isLoading } = useCompanies(1, 100, "");
  const { data: categoryData } = useCategoryDropdown();
  const { mutateAsync, isPending } = useCreateProduct();

  const companies = companyData?.companies ?? [];
  const categories = categoryData ?? [];

  const submit = async (values: any) => {
    try {
      await mutateAsync({
        ...values,
        mrp: Number(values.mrp || 0),
        price: Number(values.price || 0),
        taxPercent: Number(values.taxPercent || 0),
        stock: Number(values.stock || 0),
      });
      message.success("Product created");
      navigate(ROUTES.PRODUCTS);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to create product");
    }
  };

  if (isLoading) return <p>Loading companies...</p>;

  return (
    <Card style={{ maxWidth: 820, margin: "0 auto" }}>
      <Typography.Title level={4}>Create Product</Typography.Title>
      <Form form={form} layout="vertical" onFinish={submit} requiredMark={false}>
        <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
          <Select
            placeholder="Select category"
            options={categories.map((c) => ({ value: c.name, label: c.name }))}
          />
        </Form.Item>

        <Form.Item name="productType" label="Product Type" rules={[{ required: true }]}>
          <Input placeholder="Tablet / Syrup / Item" />
        </Form.Item>

        <Form.Item name="companyId" label="Company" rules={[{ required: true }]}>
          <Select
            placeholder="Select company"
            options={companies.map((c: any) => ({ value: c._id, label: c.companyName }))}
          />
        </Form.Item>

        <Form.Item label="Pricing" style={{ marginBottom: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="mrp" label="MRP">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="price" label="Selling Price">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item label="Tax & Stock" style={{ marginBottom: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Form.Item name="taxPercent" label="GST (%)">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
            <Form.Item name="stock" label="Opening Stock">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button onClick={() => navigate(ROUTES.PRODUCTS)} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Create Product
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateProduct;
