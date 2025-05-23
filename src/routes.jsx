import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout/Layout";
import Error from "./Pages/Error/Error";
import Home from "./Pages/Home/Home";
import AboutUs from "./Pages/AboutUs/AboutUs";
import ContactUs from "./Pages/ContactUs/ContactUs";
import FAQs from "./Pages/FAQs/FAQs";
import Shop from "./Pages/Shop/Shop";
import ShopByCategory from "./Pages/ShopByCategory/ShopByCategory";
import SingleProducts from "./Pages/SingleProducts/SingleProducts";
import StoreDirection from "./Pages/StoreDirection/StoreDirection";
import StroeLocation from "./Pages/StoreLocation/StroeLocation";
import Register from "./Pages/Rigister/Register";
import CartPage from "./Pages/CartPage/CartPage";
import WishlistPage from "./Pages/WishlistPage/WishlistPage"; // Import WishlistPage
import Login from "./Pages/Login/Login";
import CheckoutPage from "./Pages/CheckoutPage/CheckoutPage";
import YourOrder from "./Pages/YourOrder/YourOrder";
import ProductResults from "./Pages/ProductResults/ProductResults";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/aboutus", element: <AboutUs /> },
      { path: "/contactus", element: <ContactUs /> },
      { path: "/FAQs", element: <FAQs /> },
      { path: "/shop", element: <Shop /> },
      { path: "/shopbycategory", element: <ShopByCategory /> },
      { path: "/products/:id", element: <SingleProducts /> },
      { path: "/storedirection", element: <StoreDirection /> },
      { path: "/storelocation", element: <StroeLocation /> },
      { path: "/cartpage", element: <CartPage /> },
      { path: "/wishlist", element: <WishlistPage /> }, // Add WishlistPage route
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/your-order", element: <YourOrder />},
      { path: "/productresults", element: <ProductResults />}
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

export default router;