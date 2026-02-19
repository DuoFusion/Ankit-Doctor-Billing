import Dashboard from "../pages/dashboard";

// Products
import ProductsList from "../pages/Product/ProductsList";
import CreateProduct from "../pages/Product/CreateProduct";
import EditProduct from "../pages/Product/EditProduct";

// Companies
import CompaniesList from "../pages/companies/CompaniesList";
import CreateCompany from "../pages/companies/CreateCompany";
import CompanyDetails from "../pages/companies/CompanyDetails";
import EditCompany from "../pages/companies/EditCompany";

// Profile
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";

// Admin
import Users from "../pages/admin/Users";

// Auth
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import VerifyOtp from "../pages/auth/VerifyOtp";

import { ROUTES } from "../Constants";
import ProtectedRoute from "../components/protected/ProtectedRoute";
import Layout from "../components/layout/Layout";
import BillDetails from "../pages/billing/BillDetails";
import CreateBill from "../pages/billing/CreateBill";
import BillList from "../pages/billing/BillList";
export const PageRoutes = [
  /* ============ PUBLIC ============ */
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: ROUTES.SIGNUP,
    element: <Signup />,
  },
  {
    path: ROUTES.VERIFY_OTP,
    element: <VerifyOtp />,
  },

  /* ============ PROTECTED WRAPPER ============ */
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: ROUTES.DASHBOARD,
            element: <Dashboard />,
          },

          /* PRODUCTS */
          {
            path: ROUTES.PRODUCTS,
            element: <ProductsList />,
          },
          {
            path: ROUTES.CREATE_PRODUCT,
            element: <CreateProduct />,
          },
          {
            path: `${ROUTES.PRODUCTS}/:id/edit`,
            element: <EditProduct />,
          },

          /* COMPANIES */
          {
            path: ROUTES.COMPANIES,
            element: <CompaniesList />,
          },
          {
            path: ROUTES.CREATE_COMPANY,
            element: <CreateCompany />,
          },
          {
            path: `${ROUTES.COMPANIES}/:id`,
            element: <CompanyDetails />,
          },
          {
            path: `${ROUTES.COMPANIES}/:id/edit`,
            element: <EditCompany />,
          },

          /* PROFILE */
          {
            path: ROUTES.PROFILE,
            element: <Profile />,
          },
          {
            path: ROUTES.EDITPROFILE,
            element: <EditProfile />,
          },

          /* BILLING */
          {
            path: ROUTES.BILLING,
            element: <BillList />,
          },
          {
            path: ROUTES.CREATE_BILL,
            element: <CreateBill />,
          },
          {
            path: `${ROUTES.BILL_DETAILS(":id")}`,
            element: <BillDetails />,
          },

          /* ADMIN ONLY */
          {
            element: <ProtectedRoute roles={["ADMIN"]} />,
            children: [
              {
                path: ROUTES.USERS,
                element: <Users />,
              },
            ],
          },
        ],
      },
    ],
  },
];
