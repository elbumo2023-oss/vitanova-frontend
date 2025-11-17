import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "../layouts/PublicLayout";
import Home from "../pages/Home";
import Products from "../pages/Products";
import Services from "../pages/Services";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Update from "../pages/Update";
import Quotes from "../pages/Quotes";
import MyQuotes from "../pages/MyQuotes";
import ErrorDetails from "../components/ErrorDetails";
import ProtectedRoute from "../layouts/ProtectedRoutes";
import AdminLayout from "../layouts/AdminLayout";
import PublicRoute from "../layouts/PublicRoute";
import Dashboard from "../admin/Dashboard";
import ClientsAdmin from "../admin/ClientsAdmin";
import ProductsAdmin from "../admin/ProductsAdmin";
import ServicesAdmin from "../admin/ServicesAdmin";
import QuotesAdmin from "../admin/QuotesAdmin";
import RecoverPassword from "../pages/Authentication/RecoverPassword";
import ChangePassword from "../pages/Authentication/ChangePassword";
import Chat from "../pages/Chat";
import ChatAdmin from "../admin/ChatAdmin";

const routes = createBrowserRouter([
    {path: "/", element: <PublicRoute>
        <PublicLayout/>
        </PublicRoute>,
        children: [
            {index: true, element: <Home/>},
            {path:"products", element: <Products/>},
            {path: "services", element: <Services/>},
            {path: "login", element: <Login/>},
            {path: "register", element: <Register/>},
            {path: "profile", element: <Profile/>},
            {path: "update-profile", element: <Update/>},
            {path: "quote", element: <Quotes/>},
             { path: "my-quotes", element: <MyQuotes /> },
             {path: "recover-password", element: <RecoverPassword/>},
             {path: "change-password", element: <ChangePassword/>},
            {path: "chat", element: <ProtectedRoute roles={["ROLE_USER"]}>
      <Chat />
    </ProtectedRoute>},
        ], errorElement: <ErrorDetails/>
    },
    {path: "/admin", element: (
        <ProtectedRoute roles={["ROLE_ADMIN"]}>
            <AdminLayout/>
        </ProtectedRoute>
    ), children: [
        { index: true, element: <Dashboard/>},
        { path: "clients", element: <ClientsAdmin/>},
        { path: "products", element: <ProductsAdmin/>},
        { path: "services", element: <ServicesAdmin /> },
        { path: "quotes", element: <QuotesAdmin /> },
        { path: "chat", element: <ChatAdmin /> },
    ], errorElement :<ErrorDetails/>},
     { path: "*", element: <ErrorDetails /> },
])
export default routes;