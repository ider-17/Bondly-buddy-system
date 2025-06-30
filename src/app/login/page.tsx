'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { HeartHandshake } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function Login() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [selectedRole, setSelectedRole] = useState<"newbie" | "buddy" | null>(null)
    const [errorMessage, setErrorMessage] = useState("")

    const router = useRouter()

    // Autofill logic
    useEffect(() => {
        if (selectedRole === "newbie") {
            setEmail("ider@gmail.com")
            setPassword("ider1234")
        } else if (selectedRole === "buddy") {
            setEmail("buddytest@gmail.com")
            setPassword("test1234")
        } else {
            setEmail("")
            setPassword("")
        }
    }, [selectedRole])

    // Load from localStorage
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail")
        const savedPassword = localStorage.getItem("rememberedPassword")

        if (savedEmail && savedPassword) {
            setEmail(savedEmail)
            setPassword(savedPassword)
            setRememberMe(true)
        }
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage("") // reset

        if (!email || !password) {
            setErrorMessage("Имэйл болон нууц үг хоёулаа шаардлагатай.")
            return
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setErrorMessage("Имэйл эсвэл нууц үг буруу байна.")
            return
        }

        // Remember me logic
        if (rememberMe) {
            localStorage.setItem("rememberedEmail", email)
            localStorage.setItem("rememberedPassword", password)
        } else {
            localStorage.removeItem("rememberedEmail")
            localStorage.removeItem("rememberedPassword")
        }

        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role, first_login')
            .eq('id', data.user.id)
            .single()

        if (userError || !userData) {
            setErrorMessage("Хэрэглэгчийн мэдээлэл олдсонгүй.")
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

            <form
                onSubmit={handleLogin}
                className="border border-neutral-300 py-5 px-6 space-y-6 rounded-xl w-full max-w-md"
            >
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2">Log in to your account</h2>
                    <p className="text-neutral-600 text-sm font-medium">
                        Enter your email and password to access your dashboard
                    </p>
                </div>

                {errorMessage && (
                    <p className="text-red-600 text-sm font-medium text-center">
                        {errorMessage}
                    </p>
                )}

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

                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={e => setRememberMe(e.target.checked)}
                        />
                        <p className="font-medium">Remember me</p>
                    </div>
                </div>

                <div>
                    <h6 className="font-medium">Auto fill</h6>
                    <div className="flex gap-3 mt-3">
                        <div className="flex gap-2 items-center">
                            <input
                                type="checkbox"
                                checked={selectedRole === "newbie"}
                                onChange={() =>
                                    setSelectedRole(prev => prev === "newbie" ? null : "newbie")
                                }
                            />
                            <p>Newbie</p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <input
                                type="checkbox"
                                checked={selectedRole === "buddy"}
                                onChange={() =>
                                    setSelectedRole(prev => prev === "buddy" ? null : "buddy")
                                }
                            />
                            <p>Buddy</p>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="py-2 px-4 rounded-lg bg-black text-center text-white w-full cursor-pointer select-none hover:bg-gray-800 active:bg-white active:text-black active:border-black border"
                >
                    Sign in
                </button>
            </form>
        </div>
    )
}
