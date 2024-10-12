"use client"

import {
    Card
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


import { useProducts } from "@/api/hooks/useProducts";
import { Product as ProductType } from "@/api/productApi";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CartItem, useCart } from "@/context/CartContext";
import { SelectGroup } from "@radix-ui/react-select";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useDebounce } from '../hooks/useDebounce';



interface ProductProps {
    product: ProductType
}
const Product: React.FC<ProductProps> = ({ product }) => {
    const { image_url, name, price, description } = product;
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(0)

    const handleAddToCart = (product: CartItem) => {
        addItem({ ...product, quantity: 1 });
    };
    return (
        <div>
            <div className="w-full aspect-square rounded-md ">
                <img src={image_url} alt={name} className="object-cover w-full h-full rounded-md" />
            </div>
            <div className="flex flex-col items-center mt-[10px] gap-[10px]">
                <Label>{name}</Label>
                <Label>${price}</Label>
                <Dialog>
                    <DialogTrigger className="w-full"><Button className="w-full">View</Button></DialogTrigger>
                    <DialogContent className="max-w-[800px] w-full">
                        <div className="w-full grid grid-cols-2 gap-[30px]">
                            <div className="w-full aspect-square"><img className="w-full h-full objcet-cover rounded-md" src={image_url} /></div>
                            <div><h1 className="text-[28px]">{name}</h1>
                                <p className="text-[18px] mt-[24px]">{description}</p>
                                <p className="text-[24px] mt-[24px]">${price}</p>
                                <div className="grid gap-3 mt-[24px]">
                                    <Label htmlFor="top-k">Quantity</Label>
                                    <Input value={quantity.toString()} onChange={(value) => setQuantity(Number(value))} id="top-k" type="number" placeholder="0" />
                                </div>
                                <Button className="mt-[24px] w-full">Add to Cart</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <Button className="w-full" onClick={() => handleAddToCart({ id: product._id, name: product.name, price: product.price, quantity: 1 })}>Add To Cart</Button>
            </div>
        </div>
    )
}
const ProductSkeleton = () => {
    return (
        <div>
            <Skeleton className="w-full aspect-square block" containerClassName="h-fit" inline />
            <div className="flex flex-col items-center gap-[10px] mt-[10px]">
                <Skeleton containerClassName="w-[100px] h-[0.875rem] max-w-full text-sm" inline className="text-sm" />
                <Skeleton containerClassName="w-[35px] max-w-full text-sm" inline className="text-sm" />
                <Skeleton containerClassName="w-full max-w-full text-sm h-[40px]" className="h-[40px]" />
                <Skeleton containerClassName="w-full max-w-full text-sm h-[40px]" className="h-[40px]" />
            </div>
        </div>
    )
}

const InboxIcon = ({ className }: { className: string }) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
            <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
    )
}

const Home = () => {
    const [products, setProducts] = useState([1])
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [searchCategory, setSearchCategory] = useState('')
    const [finalCategory, setFinalCategory] = useState('')

    const { data: productData, isPending: productDataPending } = useProducts(debouncedSearchTerm, finalCategory);

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Store</h1>
            </div>
            <div className="w-full grid lg:grid-cols-[300px_auto] gap-[30px]">
                <div
                    className="relative flex-col items-start gap-8 md:flex"
                >
                    <form className="grid w-full items-start gap-6">
                        <fieldset className="grid gap-6 rounded-lg border p-4">
                            <legend className="-ml-1 px-1 text-sm font-medium">Filter Products</legend>
                            <div className="grid gap-3">
                                <Label htmlFor="model">Category</Label>
                                <Select value={searchCategory} onValueChange={value => setSearchCategory(value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Casual">Casual</SelectItem>
                                            <SelectItem value="Sports Wear">Sports Wear</SelectItem>
                                            <SelectItem value="Jerseys">Jerseys</SelectItem>
                                            <SelectItem value="Luxury">Luxury</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex flex-col">
                                <Button className="mb-0" onClick={(e) => { e.preventDefault(); setFinalCategory(searchCategory) }}>Apply Filter</Button>
                                <Button className="mt-[10px]" onClick={(e) => { e.preventDefault(); setFinalCategory(''); setSearchCategory('') }}>Reset Filter</Button>
                            </div>
                        </fieldset>
                    </form>
                </div>

                <div>
                    <Card className="sm:col-span-2 p-6">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                onChange={(e) => setSearchTerm(e.target.value)}
                                type="search"
                                placeholder="Search product names..."
                                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-full"
                            />
                        </div>
                        <AnimatePresence mode="wait">
                            {productDataPending && <>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} key={'loader'} className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-[30px] gap-x-[16px] gap-y-[40px]">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((_, i) => <ProductSkeleton key={i} />)}
                                </motion.div>
                            </>}
                            {!productDataPending && products.length !== 0 && <>
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} key={'products'} className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-[30px] gap-x-[16px] gap-y-[40px]">
                                    {productData?.products?.map(product => <Product product={product} />)}
                                </motion.div>
                            </>}
                            {!productDataPending && productData?.products?.length == 0 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} key={'empty-state'} className="flex flex-col items-center justify-center h-[50vh] gap-6 mx-auto">
                                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full dark:bg-gray-800">
                                    <InboxIcon className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                                </div>
                                <div className="space-y-2 text-center">
                                    <h2 className="text-2xl font-bold tracking-tight">No data to display</h2>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        It looks like there's no data available yet. Try adding some new items.
                                    </p>
                                </div>
                            </motion.div>}
                        </AnimatePresence>

                    </Card>
                </div>

            </div>
        </>
    )
}

export default Home;
