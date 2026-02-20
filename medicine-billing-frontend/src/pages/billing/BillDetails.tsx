import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Divider, Row, Space, Table, Typography } from "antd";
import { EditOutlined, FilePdfOutlined } from "@ant-design/icons";
import { ROUTES } from "../../Constants";
import { useBill } from "../../hooks/useBills";

const getLogoUrl = (logo?: string) => {
  if (!logo) return "";
  if (logo.startsWith("http")) return logo;
  const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
  return `${apiBase}/uploads/${logo}`;
};

const BillView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useBill(id!);
  const printRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return null;

  const { bill, items } = data;
  const companyName = bill.companyId?.companyName || (bill.companyId as any)?.name || "Company";
  const companyGst = bill.companyId?.gstNumber || (bill.companyId as any)?.gstNo || "-";
  const companyAddress = bill.companyId?.address || "-";
  const companyPhone = bill.companyId?.phone || "-";
  const companyEmail = bill.companyId?.email || "-";
  const userName = bill.userId?.name || (bill as any)?.createdBy?.name || "-";

  const userEmail = bill.userId?.email || (bill as any)?.createdBy?.email || "-";
  const userPhone = bill.userId?.phone || (bill as any)?.createdBy?.phone || "-";
  const userAddress = bill.userId?.address || (bill as any)?.createdBy?.address || "-";

  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default;

    await html2pdf()
      .set({
        margin: [10, 10, 10, 10],
        filename: `${bill.billNo || "invoice"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      } as any)
      .from(printRef.current)
      .save();
  };

  const hasHsn = items.some((item: any) => item.hsn);
  const hasBatch = items.some((item: any) => item.batch);
  const hasExp = items.some((item: any) => item.exp);
  const hasPayment = items.some((item: any) => item.payment);
  const hasStatus = items.some((item: any) => item.status);

  const columns = [
    {
      title: "No",
      key: "srNo",
      width: 60,
      render: (_: any, item: any, index: number) => item.srNo || index + 1,
    },
    { title: "Product", dataIndex: "productName", key: "productName", width: 200 },
    ...(hasHsn
      ? [
          {
            title: "HSN",
            key: "hsn",
            width: 100,
            render: (_: any, item: any) => item.hsn || "-",
          },
        ]
      : []),
    ...(hasBatch
      ? [
          {
            title: "Batch",
            key: "batch",
            width: 100,
            render: (_: any, item: any) => item.batch || "-",
          },
        ]
      : []),
    ...(hasExp
      ? [
          {
            title: "Exp",
            key: "exp",
            width: 100,
            render: (_: any, item: any) => item.exp || "-",
          },
        ]
      : []),
    {
      title: "Qty",
      dataIndex: "qty",
      key: "qty",
      align: "right" as const,
      width: 80,
    },
    {
      title: "Rate",
      key: "rate",
      align: "right" as const,
      width: 110,
      render: (_: any, item: any) => `Rs ${Number(item.rate || 0).toFixed(2)}`,
    },
    {
      title: "GST%",
      key: "gstPercent",
      align: "right" as const,
      width: 90,
      render: (_: any, item: any) => `${Number(item.taxPercent || 0).toFixed(2)}%`,
    },
    {
      title: "GST Amt",
      key: "gstAmount",
      align: "right" as const,
      width: 120,
      render: (_: any, item: any) =>
        `Rs ${Number((item.cgst || 0) + (item.sgst || 0)).toFixed(2)}`,
    },
    ...(hasPayment
      ? [
          {
            title: "Payment",
            key: "payment",
            width: 100,
            render: (_: any, item: any) => item.payment || "-",
          },
        ]
      : []),
    ...(hasStatus
      ? [
          {
            title: "Status",
            key: "status",
            width: 100,
            render: (_: any, item: any) => item.status || "-",
          },
        ]
      : []),
    {
      title: "Total",
      key: "total",
      align: "right" as const,
      width: 120,
      render: (_: any, item: any) => `Rs ${Number(item.total || 0).toFixed(2)}`,
    },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <Typography.Title level={4} style={{ margin: 0, color: "#102A43", fontWeight: 700 }}>
            Invoice Details
          </Typography.Title>
          <Typography.Text type="secondary">Professional bill view for medical billing records</Typography.Text>
        </div>
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => id && navigate(ROUTES.BILL_EDIT.replace(":id", id))}
          >
            Edit Bill
          </Button>
          <Button type="primary" icon={<FilePdfOutlined />} onClick={handleDownloadPdf}>
            Download PDF
          </Button>
        </Space>
      </div>

      <Card style={{ borderRadius: 14 }} bodyStyle={{ padding: 22 }}>
        <div
          ref={printRef}
          style={{
            fontFamily: "Inter, Poppins, Roboto, 'Segoe UI', sans-serif",
            lineHeight: 1.55,
            letterSpacing: 0.2,
            color: "#0f172a",
          }}
        >
          <style>{`
            .invoice-pdf .ant-typography {
              line-height: 1.55;
              letter-spacing: 0.2px;
            }
            .invoice-pdf .ant-table {
              font-size: 13px;
            }
            .invoice-pdf .ant-table-thead > tr > th {
              font-weight: 700 !important;
              font-size: 12.5px;
              letter-spacing: 0.25px;
              background: #f8fafc !important;
              padding-top: 12px !important;
              padding-bottom: 12px !important;
            }
            .invoice-pdf .ant-table-tbody > tr > td {
              padding-top: 12px !important;
              padding-bottom: 12px !important;
            }
          `}</style>

          <div className="invoice-pdf">
            <div
              style={{
                padding: "4px 0 14px",
                marginBottom: 18,
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <Row justify="space-between" align="middle" gutter={[14, 10]}>
                <Col xs={24} md={15}>
                  <Typography.Text
                    style={{
                      fontSize: 12.5,
                      letterSpacing: 1.1,
                      color: "#1E6F5C",
                      fontWeight: 700,
                    }}
                  >
                    TAX INVOICE
                  </Typography.Text>
                  <Typography.Title level={4} style={{ margin: "6px 0 0", fontWeight: 700 }}>
                    {companyName}
                  </Typography.Title>
                </Col>
                <Col xs={24} md={9} style={{ textAlign: "right" }}>
                  <Typography.Text style={{ display: "block", fontSize: 13.5, fontWeight: 600 }}>
                    Bill No: {bill.billNo || "-"}
                  </Typography.Text>
                  <Typography.Text type="secondary">
                    Date: {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "-"}
                  </Typography.Text>
                </Col>
              </Row>
            </div>

            <Row gutter={[18, 18]} align="top">
              <Col xs={24} md={13}>
                <div
                  style={{
                    padding: "2px 0",
                    minHeight: 130,
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    {bill.companyId?.logo && (
                      <img
                        src={getLogoUrl(bill.companyId.logo)}
                        alt="Company Logo"
                        style={{ width: 62, height: 62, objectFit: "contain" }}
                      />
                    )}
                    <div>
                      <Typography.Text style={{ fontWeight: 700, fontSize: 13.5, display: "block", marginBottom: 6 }}>
                        Company Information
                      </Typography.Text>
                      <Typography.Text type="secondary" style={{ display: "block" }}>GST No: {companyGst}</Typography.Text>
                      <Typography.Text type="secondary" style={{ display: "block" }}>Address: {companyAddress}</Typography.Text>
                      <Typography.Text type="secondary" style={{ display: "block" }}>Phone: {companyPhone}</Typography.Text>
                      <Typography.Text type="secondary" style={{ display: "block" }}>Email: {companyEmail}</Typography.Text>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={11}>
                <div
                  style={{
                    padding: "2px 0",
                    minHeight: 130,
                  }}
                >
                  <Typography.Text style={{ fontWeight: 700, fontSize: 13.5, display: "block", marginBottom: 8 }}>
                    Billing Details
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ display: "block" }}>Created By: {userName}</Typography.Text>
                  <Typography.Text type="secondary" style={{ display: "block" }}>Email: {userEmail}</Typography.Text>
                  <Typography.Text type="secondary" style={{ display: "block" }}>Phone: {userPhone}</Typography.Text>
                  <Typography.Text type="secondary" style={{ display: "block" }}>Address: {userAddress}</Typography.Text>
                </div>
              </Col>
            </Row>

            <Divider style={{ margin: "14px 0 10px" }} />

            <Table
              style={{ marginTop: 8 }}
              rowKey="_id"
              columns={columns}
              dataSource={items}
              pagination={false}
              scroll={{ x: "max-content" }}
              size="middle"
              bordered
            />

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  width: 370,
                  padding: "2px 0",
                }}
              >
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Typography.Text type="secondary" style={{ fontWeight: 500 }}>Sub Total</Typography.Text>
                  <Typography.Text style={{ fontWeight: 500 }}>Rs {Number(bill.subTotal || 0).toFixed(2)}</Typography.Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 8 }}>
                  <Typography.Text type="secondary" style={{ fontWeight: 500 }}>Total Tax</Typography.Text>
                  <Typography.Text style={{ fontWeight: 500 }}>Rs {Number(bill.totalTax || 0).toFixed(2)}</Typography.Text>
                </Row>
                <Row justify="space-between" style={{ marginBottom: 10 }}>
                  <Typography.Text type="secondary" style={{ fontWeight: 500 }}>Discount</Typography.Text>
                  <Typography.Text style={{ fontWeight: 500 }}>- Rs {Number(bill.discount || 0).toFixed(2)}</Typography.Text>
                </Row>
                <Divider style={{ margin: "10px 0 12px" }} />
                <Row justify="space-between">
                  <Typography.Title level={4} style={{ margin: 0, fontWeight: 700 }}>
                    Grand Total
                  </Typography.Title>
                  <Typography.Title level={4} style={{ margin: 0, color: "#102A43", fontWeight: 800 }}>
                    Rs {Number(bill.grandTotal || 0).toFixed(2)}
                  </Typography.Title>
                </Row>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BillView;
