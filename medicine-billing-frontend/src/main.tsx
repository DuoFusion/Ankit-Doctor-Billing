import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import App from "./App";
import "antd/dist/reset.css";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1E6F5C",
            colorInfo: "#1E6F5C",
            colorSuccess: "#2E8B57",
            colorWarning: "#D97706",
            colorError: "#C2410C",
            borderRadius: 12,
            fontSize: 14,
            colorBgLayout: "#EEF2F6",
            colorText: "#1F2937",
          },
          components: {
            Layout: {
              headerBg: "#ffffff",
              siderBg: "#102A43",
            },
            Card: {
              colorBgContainer: "#ffffff",
            },
            Menu: {
              darkItemBg: "#102A43",
              darkItemHoverBg: "#1F3A56",
              darkItemSelectedBg: "#1E6F5C",
              darkItemSelectedColor: "#ffffff",
              itemColor: "#dbeafe",
            },
            Table: {
              headerBg: "#F8FAFC",
            },
          },
        }}
      >
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
