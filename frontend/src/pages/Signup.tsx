
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from '@/components/ui/spinner'
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from 'framer-motion'
import { SubmitHandler, useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { UserSignupData } from "@/api/authApi"
import { useSignup } from "@/api/hooks/useAuth"
import { z } from "zod"

import RequestError from "@/components/RequestError"
import { AxiosError } from "axios"
import { useEffect } from "react"


const formSchema = z.object({
    first_name: z.string().min(3).max(50),
    last_name: z.string().min(3).max(50),
    email: z.string().email(),
    password: z.string().min(8).max(50),
});

const Signup = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            email: "",
            password: ""
        },
    })
    const signup = useSignup();
    const navigate = useNavigate()

    const onSubmit: SubmitHandler<UserSignupData> = (data) => {
        signup.mutate(data, {
            onSuccess: () => {
                navigate('/')
            },
        });
    };

    useEffect(() => {
        console.log(signup)
    }, [signup])

    return (
        <motion.div initial={{ opacity: 0 }} exit={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4 } }} className="flex items-center justify-center w-full h-screen px-[20px]">

            <Card className="mx-auto w-full max-w-xl my-auto">
                {signup.isError && <div className="px-6 pt-6"> <RequestError message={(signup.error as AxiosError<{ message: string }>)?.response?.data?.message} /></div>}
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="first_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>First name</FormLabel>
                                                <FormControl>
                                                    <Input id="first-name" placeholder="Max" required {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="last_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Last name</FormLabel>
                                                <FormControl>
                                                    <Input id="last-name" placeholder="Stone" required {...field} />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input id="email" type="email" placeholder="Stone" required {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input id="password" type="password" placeholder="Stone" required {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit">{!signup.isPending && <span>Create an account</span>}{signup.isPending && <Spinner size="small" className="text-white" />}</Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div >
    )
}

export default Signup