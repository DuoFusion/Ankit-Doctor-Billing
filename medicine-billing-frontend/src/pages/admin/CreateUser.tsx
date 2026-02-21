import { useNavigate } from "react-router-dom";
import { Button, Card, Form, Input, Select, Typography, App } from "antd";
import { ROUTES } from "../../Constants";
import { useCreateUser } from "../../Hooks/useUsers";

const CreateUser: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { mutateAsync: createUser, isPending } = useCreateUser();
  const [form] = Form.useForm();

  const handleSubmit = async (values: any) => {
    try {
      await createUser(values);
      message.success("User created");
      navigate(ROUTES.USERS);
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Failed to create user");
    }
  };

  return (
    <Card style={{ maxWidth: 720, margin: "0 auto" }}>
      <Typography.Title level={4}>Create User</Typography.Title>
      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Role" initialValue="USER">
          <Select options={[{ value: "USER", label: "USER" }, { value: "ADMIN", label: "ADMIN" }]} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button onClick={() => navigate(ROUTES.USERS)} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            Create User
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateUser;
