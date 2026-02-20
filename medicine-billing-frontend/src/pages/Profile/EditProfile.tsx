import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Typography, App } from "antd";
import { ROUTES } from "../../Constants";
import { useProfile, useUpdateProfile } from "../../hooks/useProfile";

const EditProfile = () => {
  const { message } = App.useApp();
  const { data: user } = useProfile();
  const { mutateAsync, isPending } = useUpdateProfile();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!user) return;
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
    });
  }, [user, form]);

  if (!user) return null;

  const handleSave = async (values: any) => {
    try {
      await mutateAsync(values);
      message.success("Profile updated");
      navigate(ROUTES.PROFILE);
    } catch {
      message.error("Failed to update profile");
    }
  };

  return (
    <Card style={{ maxWidth: 760, margin: "0 auto" }}>
      <Typography.Title level={4}>Update Profile</Typography.Title>
      <Form form={form} layout="vertical" onFinish={handleSave} requiredMark={false}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button onClick={() => navigate(ROUTES.PROFILE)} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditProfile;
