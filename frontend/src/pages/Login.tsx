
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from 'framer-motion'
import { Link } from "react-router-dom"

export const description =
    "A sign up form with first name, last name, email and password inside a card. There's an option to sign up with GitHub and a link to login if you already have an account"

const Login = () => {
    return (
        <motion.div initial={{ opacity: 0 }} exit={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.4 } }} className="flex items-center justify-center w-full h-screen">

            <Card className="mx-auto max-w-sm my-auto">
                <CardHeader>
                    <CardTitle className="text-xl">Log in</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" />
                        </div>
                        <Button type="submit" className="w-full">
                            Create an account
                        </Button>
                    </div>
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