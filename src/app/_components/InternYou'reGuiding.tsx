import { ArrowRight, Handshake, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ProfileCard from "./ProfileCard";
import MyInterests from "./MyInterests";
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { CalendarDays, Phone } from "lucide-react"


interface UserProfile {
  email: string
  phone_number?: string
  joined_at?: string
  name?: string
  role?: string
  avatar_url?: string
}

export default function InternYouGuiding() {

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

  return (
    <div className="bg-white rounded-xl border border-slate-200 ">

      <h6 className="font-semibold py-5 px-6 space-y-5 text-xl">Таны Newbie</h6>

      <hr></hr>


      <div className="py-5 px-6">
        <div className="mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-15 h-15">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h6 className="text-base font-medium">Тогтуун</h6>
                <p className="text-[#525252] text-sm font-medium">UX/UI Designer</p>
              </div>
            </div>

            <div className="flex gap-5 w-fit">
              <div className="border border-neutral-300 rounded-lg py-2 px-6 flex gap-2 font-medium items-center justify-center cursor-pointer hover:bg-sky-100 active:bg-black active:text-white select-none">
                <p>Дэлгэрэнгүй</p>
              </div>
              <div className="rounded-lg py-2 px-6 flex gap-2 items-center justify-center font-medium bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-700 select-none">
                <Mail color="white" />
                <p className="text-white">Холбогдох</p>
              </div>
            </div>
          </div>
        </div>


        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-neutral-600">
              Энэ долоо хоногийн зорилго:
            </p>
          </div>
          <p>Шинэ ажилтантайгаа 1:1 уулзалт товлоорой 🙌</p>
        </div>
      </div>
    </div>
  );
}
