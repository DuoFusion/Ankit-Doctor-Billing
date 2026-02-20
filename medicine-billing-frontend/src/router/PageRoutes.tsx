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
import CategoriesList from "../pages/categories/CategoriesList";
import CreateCategory from "../pages/categories/CreateCategory";
import EditCategory from "../pages/categories/EditCategory";

// Profile
import Profile from "../pages/Profile/Profile";
import EditProfile from "../pages/Profile/EditProfile";
import ChangePassword from "../pages/Profile/ChangePassword";

// Admin
import Users from "../pages/admin/Users";
import CreateUser from "../pages/admin/CreateUser";

// Auth
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import VerifyOtp from "../pages/auth/VerifyOtp";

import { ROUTES } from "../Constants";
import ProtectedRoute from "../components/protected/ProtectedRoute";
import PublicOnlyRoute from "../components/protected/PublicOnlyRoute";
import Layout from "../components/layout/Layout";
import BillDetails from "../pages/billing/BillDetails";
import CreateBill from "../pages/billing/CreateBill";
import BillList from "../pages/billing/BillList";
import EditBill from "../pages/billing/EditBill";
import NotFound from "../pages/NotFound";
export const PageRoutes = [
  /* ============ PUBLIC ============ */
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: <Login />,
      },
      {
        path: ROUTES.SIGNUP,
        element: <Signup />,
      },
      {
        path: ROUTES.FORGOT_PASSWORD,
        element: <ForgotPassword />,
      },
      {
        path: ROUTES.RESET_PASSWORD,
        element: <ResetPassword />,
      },
      {
        path: ROUTES.VERIFY_OTP,
        element: <VerifyOtp />,
      },
    ],
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

          /* CATEGORIES */
          {
            path: ROUTES.CATEGORIES,
            element: <CategoriesList />,
          },
          {
            path: ROUTES.CREATE_CATEGORY,
            element: <CreateCategory />,
          },
          {
            path: `${ROUTES.CATEGORIES}/:id/edit`,
            element: <EditCategory />,
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
          {
            path: ROUTES.CHANGE_PASSWORD,
            element: <ChangePassword />,
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
            path: ROUTES.BILL_EDIT,
            element: <EditBill />,
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
              {
                path: ROUTES.CREATE_USER,
                element: <CreateUser />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
