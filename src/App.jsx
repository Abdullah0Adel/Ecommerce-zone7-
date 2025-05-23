import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { CartProvider } from './context/CartContext';
import { ShopProvider } from './context/ShopContext';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    // <AuthProvider> {/* Add AuthProvider as the outermost provider */}
      <CartProvider>
        <ShopProvider>
          <WishlistProvider>
            <RouterProvider router={router} />
            <Toaster />
          </WishlistProvider>
        </ShopProvider>
      </CartProvider>
    // </AuthProvider>
  );
}

export default App;