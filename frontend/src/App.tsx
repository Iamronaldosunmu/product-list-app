import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import './App.css';
import Login from './pages/Login';
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import EmptyPage from "./pages/EmptyPage";
import Home from "./pages/Home";
import ManageProducts from "./pages/ManageProducts";
import queryClient from './api/queryClient';
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "./context/CartContext";

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
