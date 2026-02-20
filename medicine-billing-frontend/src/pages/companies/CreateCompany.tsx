import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Typography, Upload, App } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ROUTES } from "../../Constants";
import { useCreateCompany } from "../../hooks/useCompanies";

const CreateCompany = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateCompany();
  const [form] = Form.useForm();
  const [logo, setLogo] = useState<File | null>(null);

  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, String(value || "")));
    if (logo) formData.append("logo", logo);

    try {
      await mutateAsync(formData);
      message.success("Company created");
      navigate(ROUTES.COMPANIES);
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to create company");
    }
  };

  return (
    <Card style={{ maxWidth: 820, margin: "0 auto" }}>
      <Typography.Title level={4}>Create Company</Typography.Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item name="companyName" label="Company Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="gstNumber" label="GST Number" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="state" label="State">
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Logo">
          <Upload beforeUpload={(file) => { setLogo(file); return false; }} maxCount={1}>
            <Button icon={<UploadOutlined />}>Select Logo</Button>
          </Upload>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button onClick={() => navigate(ROUTES.COMPANIES)} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Create Company
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateCompany;
