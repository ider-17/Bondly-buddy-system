'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { CalendarCheck, CalendarDays, Lightbulb, Mail, Mountain, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface UserProfile {
    email: string
    phone_number?: string
    joined_at?: string
    name?: string
    role?: string
    avatar_url?: string
    rank?: string
}

export default function ProfileCard() {
    const [profile, setProfile] = useState<UserProfile | null>(null)

    useEffect(() => {
        async function fetchUserProfile() {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser()

            if (userError || !user) return

            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("id", user.id)
                .single()

            if (!error && data) {
                setProfile({
                    email: data.email,
                    phone_number: data.phone_number,
                    joined_at: data.created_at?.split("T")[0] || "2025-06-12",
                    name: data.name || "Unknown",
                    role: data.role || "Newbie",
                    avatar_url: data.avatar_url || "https://github.com/shadcn.png"
                })
            }
        }

        fetchUserProfile()
    }, [])

    console.log(profile, "profileas")

    return (
        <div className="w-full py-5 px-6 border border-gray-200 rounded-xl bg-white space-y-5">
            <div className="flex gap-3 items-center">
                <Avatar className="w-16 h-16">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback>{profile?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-lg font-medium">{profile?.name || "Loading..."}</h2>
                    <p className="text-neutral-600 text-sm font-medium">{profile?.role}</p>
                </div>
            </div>

            <hr />

            {/* <div className="flex gap-5">
                <           div className="w-1/3 py-5 px-6 flex gap-2 items-center bg-white rounded-lg">
                    <Mail size={24} color="black" />
                    <div>
                        <p className="text-neutral-600 text-sm font-medium">Mail</p>
                        <p className="text-sm font-medium">{profile?.email}</p>
                    </div>
                </div>

                <div className="w-1/3 py-5 px-6 flex gap-2 items-center bg-white rounded-lg">
                    <CalendarDays size={24} color="black" />
                    <div>
                        <p className="text-neutral-600 text-sm font-medium">Started</p>
                        <p className="text-neutral-600 text-sm font-medium">{profile?.joined_at}</p>
                    </div>
                </div>

                <div className="w-1/3 py-5 px-6 flex gap-2 items-center bg-white rounded-lg">
                    <Phone size={24} color="black" />
                    <div>
                        <p className="text-neutral-600 text-sm font-medium">Phone number</p>
                        <p className="text-neutral-600 text-sm font-medium">{profile?.phone_number}</p>
                    </div>
                </div>
            </div> */}

            <h6 className="text-sm font-semibold">Таны Onboarding-ийн ахиц</h6>

            <div className="flex gap-3 mb-5">
                <div className="w-1/3 border border-gray-200 bg-white p-3 rounded-lg space-y-3">
                    <div className="w-8 h-8 bg-blue-100 flex justify-center items-center rounded-lg">
                        <CalendarCheck size={18} color="#2563EB" />
                    </div>

                    <div>
                        <h5 className="text-base font-bold">2</h5>
                        <p className="text-sm font-medium">Идэвхтэй
                            өдрүүд</p>
                    </div>
                </div>

                <div className="w-1/3 border border-gray-200 bg-white p-3 rounded-lg space-y-3">
                    <div className="w-8 h-8 bg-amber-100 flex justify-center items-center rounded-lg">
                        <Mountain size={18} color="#D97706" />
                    </div>

                    <div>
                        <h5 className="text-base font-bold">1</h5>
                        <p className="text-sm font-medium">Биелүүлсэн
                            сорилтууд</p>
                    </div>
                </div>

                <div className="w-1/3 border border-gray-200 bg-white p-3 rounded-lg space-y-3">
                    <div className="w-8 h-8 bg-violet-100 flex justify-center items-center rounded-lg">
                        <Lightbulb size={18} color="#7C3AED" />
                    </div>

                    <div>
                        <h5 className="text-base font-bold">2</h5>
                        <p className="text-sm font-medium">Уншсан
                            зөвлөмжүүд</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
