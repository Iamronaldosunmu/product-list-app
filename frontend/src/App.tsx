import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import queryClient from './api/queryClient';
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Login from './pages/Login';
import ManageProducts from "./pages/ManageProducts";
import Signup from "./pages/Signup";

function App() {
  const location = useLocation();

  return (

    <AuthProvider>
      <CartProvider>
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                <Route index element={<Home />} />
                <Route path="products" element={<ManageProducts />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </QueryClientProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
