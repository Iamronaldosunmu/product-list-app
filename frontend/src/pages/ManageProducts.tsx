import { InboxIcon, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useCreateProduct, useDeleteProduct, useProducts, useUpdateProduct, useUserProducts } from "@/api/hooks/useProducts"
import { ProductData, Product as ProductType } from "@/api/productApi"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { z } from "zod"
import { motion } from 'framer-motion'

const productFormSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(100, "Name can't be more than 100 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description can't be more than 500 characters"),
    price: z.number().min(1, "Price must begreater than 0"),
    category: z.string().min(3, "Category must be at least 3 characters").max(50, "Category can't be more than 50 characters"),
    image_url: z.string().url("Must be a valid URL"),
});

interface EditProductModalProps {
    product: ProductType
}
const EditProduct: React.FC<EditProductModalProps> = ({ product }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast()
    const editProductForm = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            image_url: product.image_url
        },
    })

    const updateProduct = useUpdateProduct(product._id)
    const onAddProductFormSubmit: SubmitHandler<ProductData> = (data) => {
        updateProduct.mutate(data, {
            onSuccess: () => {
                toast({
                    description: `${product.name} has been updated`,
                })
                editProductForm.reset()
            }
        })
        setIsModalOpen(false);
    };
    // https://images.pexels.com/photos/28880087/pexels-photo-28880087/free-photo-of-urban-scene-with-tattered-cloth-on-rope.jpeg
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <p className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer" onClick={() => setIsModalOpen(true)}>Edit Product</p>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <Form {...editProductForm} >
                    {/* @ts-expect-error quick fix */}
                    <form onSubmit={editProductForm.handleSubmit(onAddProductFormSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={editProductForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">Name</FormLabel>
                                        <FormControl>
                                            <Input id="name" className="col-span-3" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-right mt-[] w-full text-[12px]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={editProductForm.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">Price ($)</FormLabel>
                                        <FormControl>
                                            <Input id="price" type="number" className="col-span-3" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-right mt-[] w-full text-[12px]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={editProductForm.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">

                                        <FormLabel className="text-right">Category</FormLabel>
                                        <div className="col-span-3">
                                            <Select defaultValue={product.category} onValueChange={Value => field.onChange(Value)}>
                                                <FormControl>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="col-span-3">
                                                    <SelectGroup>
                                                        <SelectItem value="Casual">Casual</SelectItem>
                                                        <SelectItem value="Sports Wear">Sports Wear</SelectItem>
                                                        <SelectItem value="Jerseys">Jerseys</SelectItem>
                                                        <SelectItem value="Luxury">Luxury</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <FormMessage className="text-right mt-[] w-full text-[12px]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={editProductForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">

                                        <FormLabel className="text-right">Description</FormLabel>
                                        <FormControl>
                                            <Input id="description" className="col-span-3" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-right mt-[] w-full text-[12px]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={editProductForm.control}
                            name="image_url"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">Image Url</FormLabel>
                                        <FormControl>
                                            <Input id="image_url" className="col-span-3" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-right mt-[] w-full text-[12px]" />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button onClick={() => console.log(editProductForm.formState.errors)} type="submit">{!updateProduct.isPending && <span>Save</span>}{updateProduct.isPending && <Spinner size="small" className="text-white" />}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

const AddProduct = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast()
    const addProductForm = useForm<z.infer<typeof productFormSchema>>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            category: ""
        },
    })
    const createProduct = useCreateProduct()
    const onAddProductFormSubmit: SubmitHandler<ProductData> = (data) => {
        createProduct.mutate(data, {
            onSuccess: () => {
                toast({
                    description: "Your Product has been created",
                })
                addProductForm.reset()
            }
        })
        setIsModalOpen(false);
    };
    // https://images.pexels.com/photos/28880087/pexels-photo-28880087/free-photo-of-urban-scene-with-tattered-cloth-on-rope.jpeg
    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsModalOpen(true)}>Add Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Product</DialogTitle>
                </DialogHeader>
                <Form {...addProductForm} >
                    {/* @ts-expect-error quick fix */}
                    <form onSubmit={addProductForm.handleSubmit(onAddProductFormSubmit)} className="grid gap-4 py-4">
                        <FormField
                            control={addProductForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">Name</FormLabel>
                                        <FormControl>
                                            <Input id="name" className="col-span-3" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-right mt-[] w-full text-[12px]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={addProductForm.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">Price ($)</FormLabel>
                                        <FormControl>
                                            <Input id="price" type="number" className="col-span-3" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-right mt-[] w-full text-[12px]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={addProductForm.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">

                                        <FormLabel className="text-right">Category</FormLabel>
                                        <div className="col-span-3">
                                            <Select onValueChange={Value => field.onChange(Value)}>
                                                <FormControl>
                                                    <SelectTrigger className="col-span-3">
                                                        <SelectValue placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="col-span-3">
                                                    <SelectGroup>
                                                        <SelectItem value="Casual">Casual</SelectItem>
                                                        <SelectItem value="Sports Wear">Sports Wear</SelectItem>
                                                        <SelectItem value="Jerseys">Jerseys</SelectItem>
                                                        <SelectItem value="Luxury">Luxury</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <FormMessage className="text-right mt-[] w-full text-[12px]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={addProductForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">

                                        <FormLabel className="text-right">Description</FormLabel>
                                        <FormControl>
                                            <Input id="description" className="col-span-3" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-right mt-[] w-full text-[12px]" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={addProductForm.control}
                            name="image_url"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <FormLabel className="text-right">Image Url</FormLabel>
                                        <FormControl>
                                            <Input id="image_url" className="col-span-3" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-right mt-[] w-full text-[12px]" />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button onClick={() => console.log(addProductForm.formState.errors)} type="submit">{!createProduct.isPending && <span>Save</span>}{createProduct.isPending && <Spinner size="small" className="text-white" />}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

const ProductSkeleton = () => {
    return <TableRow>
        <TableCell className="hidden sm:table-cell">
            <Skeleton className="aspect-square rounded-md object-cover" />
        </TableCell>
        <TableCell className="font-medium">
            <Skeleton />
        </TableCell>
        <TableCell>
            <Badge variant="outline"><Skeleton width={40} /></Badge>
        </TableCell>
        <TableCell><Skeleton width={70} /></TableCell>
        <TableCell className="hidden md:table-cell">
            <Skeleton width={150} />
        </TableCell>
        <TableCell>
            <Skeleton width={25} />
        </TableCell>
    </TableRow>
}
interface ProductProps {
    product: {
        _id: string;
        name: string;
        image_url: string;
        category: string;
        price: number;
        dateAdded: string;
        description: string;
    }
}
const Product: React.FC<ProductProps> = ({ product }) => {
    const { image_url, name, category, price, dateAdded, _id } = product
    const deleteProductMutation = useDeleteProduct(_id)
    const { toast } = useToast()
    const deleteProduct = () => {
        deleteProductMutation.mutate(undefined, {
            onSuccess: () => {
                toast({
                    description: `${name} has been deleted`,
                })
                console.log('It was a success')
            }
        })

    }
    return <TableRow>
        <TableCell className="hidden sm:table-cell">
            <img
                alt="Product image"
                className="aspect-square rounded-md object-cover"
                height="64"
                src={image_url}
                width="64"
            />
        </TableCell>
        <TableCell className="font-medium">
            {name}
        </TableCell>
        <TableCell>
            <Badge variant="outline">{category}</Badge>
        </TableCell>
        <TableCell>${price}</TableCell>
        <TableCell className="hidden md:table-cell">
            {new Date(dateAdded).toLocaleDateString()}
        </TableCell>
        <TableCell>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <EditProduct product={product} />
                    <DropdownMenuItem onClick={deleteProduct}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </TableCell>
    </TableRow>
}

const ManageProducts = () => {
    const { data, isPending, isError } = useUserProducts();
    useEffect(() => {
        console.log(data)
    }, [data])
    return (
        <Card>
            <CardHeader className="flex flex-row justify-between">
                <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>
                        Manage your products efficiently
                    </CardDescription>
                </div>
                <AddProduct />
            </CardHeader>
            <CardContent>
                {/* @ts-expect-error quick fix */}
                {!((!isPending && data?.products?.length == 0) || isError) && <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="hidden w-[100px] sm:table-cell">
                                <span className="sr-only">Image</span>
                            </TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="hidden md:table-cell">Created at</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            isPending && [1, 2, 3, 4, 5].map(() => <ProductSkeleton />)
                        }
                        {/* @ts-expect-error quick fix */}
                        {!isPending && data?.products?.map((product: ProductType) => <Product key={product._id} product={product} />)}
                    </TableBody>
                </Table>}
                {/* @ts-expect-error quick fix */}
                {((!isPending && data?.products?.length == 0) || isError) && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} key={'empty-state'} className="flex flex-col items-center justify-center h-[50vh] gap-6 mx-auto">
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
            </CardContent>
        </Card>
    )
}


export default ManageProducts