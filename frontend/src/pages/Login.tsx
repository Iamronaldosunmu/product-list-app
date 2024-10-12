
import { UserLoginData } from "@/api/authApi"
import { useLogin } from "@/api/hooks/useAuth"
import RequestError from "@/components/RequestError"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useAuth } from "@/context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { motion } from 'framer-motion'
import { SubmitHandler, useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"


const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(50),
});

const Login = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })
    const navigate = useNavigate();
    const { login } = useAuth();
    const loginMutation = useLogin();

    const onSubmit: SubmitHandler<UserLoginData> = (data) => {
        loginMutation.mutate(data, {
            onSuccess: (response) => {
                login(response.token)
                navigate('/dashboard')
            },
        });
    };

    return (
        <motion.div initial={{ opacity: 0 }} exit={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4 } }} className="flex items-center justify-center w-full h-screen px-[20px]">

            <Card className="mx-auto max-w-xl w-full my-auto">
                {loginMutation.isError && <div className="px-6 pt-6"> <RequestError message={(loginMutation.error as AxiosError<{ message: string }>)?.response?.data?.message} /></div>}
                <CardHeader>
                    <CardTitle className="text-xl">Log in</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input id="email" type="email" placeholder="ronaldosunmu@gmail.com" required {...field} />
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
                                                <Input id="password" type="password" placeholder="Password" required {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit">{!loginMutation.isPending && <span>Create an account</span>}{loginMutation.isPending && <Spinner size="small" className="text-white" />}</Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to='/signup' className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default Login