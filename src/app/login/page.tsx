'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HeartHandshake } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleLogin = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            alert(error.message)
            return
        }

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, first_login')
            .eq('id', data.user.id)
            .single()

        if (userError || !userData) {
            alert("User info not found")
            return
        }

        if (userData.first_login) {
            router.push("/onboarding")
        } else if (userData.role === "newbie") {
            router.push("/newbie/home")
        } else if (userData.role === "buddy") {
            router.push("/buddy/home")
        }
    }

    return (
        <div className="w-full h-screen flex flex-col gap-10 justify-center items-center bg-slate-50 text-black">
            <div className="flex flex-col gap-4 items-center text-center">
                <div>
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex justify-center items-center">
                        <HeartHandshake size={26} color="white" />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-semibold">BuddyConnect</h2>
                    <p className="text-sm font-medium text-neutral-600">
                        You’re here to guide a journey. Let’s get started.
                    </p>
                </div>
            </div>

            <div className="border border-neutral-300 py-5 px-6 space-y-6 rounded-xl">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">Sign in to your account</h2>
                    <p className="text-neutral-600 text-sm font-medium">
                        Enter your email and password to access your dashboard
                    </p>
                </div>

                <div>
                    <h6 className="text-base font-medium mb-2">Email address</h6>
                    <input
                        placeholder="Your.email@company.com"
                        className="w-full border border-neutral-300 rounded-lg py-3 px-2"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <h6 className="text-base font-medium mb-2">Password</h6>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="w-full border border-neutral-300 rounded-lg py-3 px-2"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <input type="checkbox" />
                        <p className="font-medium">Remember me</p>
                    </div>
                    <p className="font-medium">Forgot password?</p>
                </div>

                <button
                    onClick={handleLogin}
                    className="py-2 px-4 rounded-lg bg-black text-center text-white w-full"
                >
                    Sign in
                </button>
            </div>
        </div>
    )
}
