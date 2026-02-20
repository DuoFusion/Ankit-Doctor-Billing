import { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Divider, Row, Table, Typography } from "antd";
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
      <div style={{ display: "flex", justifyContent: "end", marginBottom: 12 }}>
        <Button
          icon={<EditOutlined />}
          onClick={() => id && navigate(ROUTES.BILL_EDIT.replace(":id", id))}
          style={{ marginRight: 8 }}
        >
          Edit Bill
        </Button>
        <Button type="primary" icon={<FilePdfOutlined />} onClick={handleDownloadPdf}>
          Download PDF
        </Button>
      </div>

      <Card ref={printRef as any} style={{ borderRadius: 14 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Typography.Text
              style={{
                fontSize: 12,
                letterSpacing: 1,
                color: "#1E6F5C",
                fontWeight: 700,
              }}
            >
              TAX INVOICE
            </Typography.Text>
          </Col>
          <Col>
            <Typography.Text strong>Bill No: {bill.billNo || "-"}</Typography.Text>
          </Col>
        </Row>

        <Divider style={{ margin: "12px 0" }} />

        <Row gutter={[16, 16]} align="top">
          <Col xs={24} md={13}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              {bill.companyId?.logo && (
                <img
                  src={getLogoUrl(bill.companyId.logo)}
                  alt="Company Logo"
                  style={{ width: 68, height: 68, objectFit: "contain" }}
                />
              )}
              <div>
                <Typography.Title level={4} style={{ margin: 0, marginBottom: 4 }}>
                  {companyName}
                </Typography.Title>
                <Typography.Text type="secondary">
                  GST No: {companyGst}
                </Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  Address: {companyAddress}
                </Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  Phone: {companyPhone}
                </Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  Email: {companyEmail}
                </Typography.Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={11}>
            <div
              style={{
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                padding: 12,
                background: "#FAFAFA",
              }}
            >
              <Typography.Text strong>Billing Details</Typography.Text>
              <div style={{ marginTop: 6 }}>
                <Typography.Text type="secondary">
                  Date: {bill.createdAt ? new Date(bill.createdAt).toLocaleDateString() : "-"}
                </Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  Created By: {userName}
                </Typography.Text>
                <br />
                <Typography.Text type="secondary">
                   Email: {userEmail}
                </Typography.Text>
                <br />
                <Typography.Text type="secondary">
                   Phone: {userPhone}
                </Typography.Text>
                <br />
                <Typography.Text type="secondary">
                   Address: {userAddress}
                </Typography.Text>
              </div>
            </div>
          </Col>
        </Row>

        <Table
          style={{ marginTop: 16 }}
          rowKey="_id"
          columns={columns}
          dataSource={items}
          pagination={false}
          scroll={{ x: "max-content" }}
          bordered
        />

        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 320 }}>
            <Row justify="space-between" style={{ marginBottom: 6 }}>
              <Typography.Text type="secondary">Sub Total</Typography.Text>
              <Typography.Text>Rs {Number(bill.subTotal || 0).toFixed(2)}</Typography.Text>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 6 }}>
              <Typography.Text type="secondary">Total Tax</Typography.Text>
              <Typography.Text>Rs {Number(bill.totalTax || 0).toFixed(2)}</Typography.Text>
            </Row>
            <Row justify="space-between" style={{ marginBottom: 8 }}>
              <Typography.Text type="secondary">Discount</Typography.Text>
              <Typography.Text>- Rs {Number(bill.discount || 0).toFixed(2)}</Typography.Text>
            </Row>
            <Divider style={{ margin: "8px 0" }} />
            <Row justify="space-between">
              <Typography.Title level={4} style={{ margin: 0 }}>
                Grand Total
              </Typography.Title>
              <Typography.Title level={4} style={{ margin: 0, color: "#102A43" }}>
                Rs {Number(bill.grandTotal || 0).toFixed(2)}
              </Typography.Title>
            </Row>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BillView;
