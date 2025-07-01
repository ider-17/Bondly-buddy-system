import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "./ProfileCard";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CalendarDays, Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function BuddyProfile() {
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

    console.log(profile)
    return (
        <div className="w-full py-5 px-6 rounded-xl border border-gray-200 bg-white h-fit space-y-5">
            <div className="flex gap-3">
                <Avatar className="w-16 h-16">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback>{profile?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>

                <div>
                    <h2 className="text-lg font-medium">{profile?.name || "Loading..."}</h2>
                    <p className="text-neutral-500 text-sm font-medium">{profile?.role === "buddy" && "Buddy"}</p>
                </div>
            </div>

            <Separator />

            <div className="flex gap-5">
                <div className="w-1/3 rounded-lg border border-gray-200 bg-white py-2 px-6 space-y-3">
                    <Mail size={24} color="black" />

                    <div>
                        <p className="text-neutral-500 text-xs font-medium">И-мэйл</p>
                        <p className="text-sm">Taivanbat@apple.com</p>
                    </div>
                </div>

                <div className="w-1/3 rounded-lg border border-gray-200 bg-white py-2 px-6 space-y-3">
                    <Phone size={24} color="black" />

                    <div>
                        <p className="text-neutral-500 text-xs font-medium">Утасны дугаар</p>
                        <p className="text-sm">+976 88111234</p>
                    </div>
                </div>

                <div className="w-1/3 rounded-lg border border-gray-200 bg-white py-2 px-6 space-y-3">
                    <CalendarDays size={24} color="black" />

                    <div>
                        <p className="text-neutral-500 text-xs font-medium">Эхэлсэн хугацаа</p>
                        <p className="text-sm">2021 • 08 • 18</p>
                    </div>
                </div>
            </div>
        </div>
    )
}