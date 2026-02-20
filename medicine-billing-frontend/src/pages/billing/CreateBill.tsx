import { useNavigate } from "react-router-dom";
import { message } from "antd";
import BillForm from "../../components/billing/BillForm";
import { ROUTES } from "../../Constants";
import { useCompanies } from "../../hooks/useCompanies";
import { useProducts } from "../../hooks/useProducts";
import { useCreateBill } from "../../hooks/useBills";

const CreateBill = () => {
  const navigate = useNavigate();
  const { data: companyData } = useCompanies(1, 100, "");
  const { data: productData } = useProducts(1, 200, "");
  const { mutateAsync, isPending } = useCreateBill();

  const companies = companyData?.companies ?? [];
  const products = productData?.products ?? [];

  const handleSubmit = async (payload: {
    companyId: string;
    discount: number;
    items: any[];
  }) => {
    try {
      await mutateAsync(payload);
      message.success("Bill created successfully");
      navigate(ROUTES.BILLING);
    } catch (error: any) {
      message.error(error?.message || "Failed to create bill");
    }
  };

  return (
    <BillForm
      title="Create Bill"
      submitText="Create Bill"
      submitLoading={isPending}
      companies={companies}
      products={products}
      onSubmit={handleSubmit}
      onCancel={() => navigate(ROUTES.BILLING)}
    />
  );
};

export default CreateBill;
