import {
    CircleUser,
    Home,
    Menu,
    Package,
    Package2,
    ShoppingCart
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Sheet, SheetContent, SheetDescription,
    SheetHeader,
    SheetTitle, SheetTrigger
} from "@/components/ui/sheet"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom"
const CartButton = () => {
    const { cartState, addItem, removeItem, clearCart, getTotalQuantity } = useCart();

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="secondary" size="icon" className="rounded-full relative bg-gray-100 hover:bg-gray-200 p-2">
                    <ShoppingCart className="h-5 w-5 text-gray-600" />
                    <span className="sr-only">Toggle cart menu</span>
                    <Badge className="ml-auto text-[10px] flex max-h-[20px] max-w-[20px] shrink-0 items-center justify-center rounded-full absolute -top-2 -right-2 bg-red-600 text-white">
                        {getTotalQuantity()}
                    </Badge>
                </Button>
            </SheetTrigger>
            <SheetContent className="bg-white p-4 rounded-lg shadow-lg w-full sm:w-[400px]">
                <SheetHeader className="mb-4">
                    <SheetTitle className="text-lg font-bold text-gray-700">Your Shopping Cart</SheetTitle>
                    <SheetDescription className="text-sm text-gray-500">
                        {cartState.items.length === 0 ? (
                            <p className="text-gray-600">Your cart is empty.</p>
                        ) : (
                            <ul className="space-y-4">
                                {cartState.items.map((item) => (
                                    <li key={item.id} className="flex justify-between items-center border-b pb-2">
                                        <div>
                                            <span className="text-gray-800 font-semibold">{item.name}</span>
                                            <span className="text-gray-500"> x {item.quantity}</span>
                                            <span className="text-gray-700"> - ${item.price}</span>
                                        </div>
                                        <button 
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-600 hover:text-red-800 transition"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </SheetDescription>
                </SheetHeader>
                {cartState.items.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-800">Total Amount: 
                            <span className="ml-2">${cartState.totalAmount.toFixed(2)}</span>
                        </h3>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button 
                                onClick={clearCart} 
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                            >
                                Clear Cart
                            </button>
                            <button 
                                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};


const Dashboard = () => {
    const { pathname } = useLocation()
    const { logout, user } = useAuth();
    const navigate = useNavigate()
    const logOut = () => {
        logout()
        navigate('/')
    }
    console.log(user)
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <Package2 className="h-6 w-6" />
                            <span className="">{user?.first_name}'s Store</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                to="/dashboard"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-primary ${pathname == '/dashboard' ? 'bg-muted text-primary' : ''}`}
                            >
                                <Home className="h-4 w-4" />
                               Store
                            </Link>
                            {/* <Link
                                to="/dashboard/orders"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-primary ${pathname == '/dashboard/orders' ? 'bg-muted text-primary' : ''}`}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                Orders
                                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                    6
                                </Badge>
                            </Link> */}
                            <Link
                                to="/dashboard/products"
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all duration-200 hover:text-primary ${pathname == '/dashboard/products' ? 'bg-muted text-primary' : ''}`}
                            >
                                <Package className="h-4 w-4" />
                                Products{" "}
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    to="/dashboard"
                                    className="flex items-center gap-2 text-lg font-semibold"
                                >
                                    <Package2 className="h-6 w-6" />
                                    <span className="">{user?.first_name}'s Store</span>
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </Link>
                                {/* <Link
                                    to="/dashboard/orders"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    Orders
                                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                        6
                                    </Badge>
                                </Link> */}
                                <Link
                                    to="/dashboard/products"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Package className="h-5 w-5" />
                                    Products
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">

                    </div>
                    <CartButton />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logOut}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {/* <div
                        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
                    >
                        <div className="flex flex-col items-center gap-1 text-center">
                            <h3 className="text-2xl font-bold tracking-tight">
                                You have no products
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                You can start selling as soon as you add a product.
                            </p>
                            <Button className="mt-4">Add Product</Button>
                        </div>
                    </div> */}
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default Dashboard;