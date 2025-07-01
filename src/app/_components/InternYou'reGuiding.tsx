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

interface NewbieProfile {
  id: string
  email: string
  phone_number?: string
  joined_at?: string
  name?: string
  role?: string
  profile_pic?: string
  rank?: string
}

export default function InternYouGuiding() {
  const [newbie, setNewbie] = useState<NewbieProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchNewbieProfile() {
      try {
        setLoading(true)

        // Fetch a random newbie user (you can modify this logic as needed)
        const { data, error } = await supabase
          .from("users")
          .select("id, email, phone_number, created_at, name, role, profile_pic, rank")
          .eq("role", "newbie")
          .limit(1)
          .single()

        if (!error && data) {
          setNewbie({
            id: data.id,
            email: data.email,
            phone_number: data.phone_number,
            joined_at: data.created_at?.split("T")[0] || "2025-06-12",
            name: data.name || "Unknown",
            role: data.role || "Newbie",
            profile_pic: data.profile_pic || null,
            rank: data.rank || "newbie"
          })
        }
      } catch (error) {
        console.error("Error fetching newbie profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNewbieProfile()

    // Set up real-time subscription for newbie changes
    const newbieSubscription = supabase
      .channel("intern_guiding_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: "rank=eq.newbie",
        },
        (payload) => {
          fetchNewbieProfile()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(newbieSubscription)
    }
  }, [])

  // Generate avatar fallback from name
  const getAvatarFallback = () => {
    if (newbie?.name) {
      return newbie.name.charAt(0).toUpperCase()
    }
    return "N"
  }

  // Format role display
  const getRoleDisplay = () => {
    if (!newbie?.rank) return "Newbie"
    
    // Capitalize first letter and handle role formatting
    const roleMap: { [key: string]: string } = {
      'newbie': 'Newbie',
      'buddy': 'Buddy'
    }
    
    return roleMap[newbie.rank] || newbie.rank
  }

  // Get display name
  const getDisplayName = () => {
    if (!newbie?.name) return "Unknown"
    return newbie.name
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200">
        <h6 className="font-semibold py-5 px-6 space-y-5 text-xl">Таны Newbie</h6>
        <hr />
        <div className="py-5 px-6">
          <div className="mb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-15 h-15 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="flex gap-5 w-fit">
                <div className="h-10 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!newbie) {
    return (
      <div className="bg-white rounded-xl border border-slate-200">
        <h6 className="font-semibold py-5 px-6 space-y-5 text-xl">Таны Newbie</h6>
        <hr />
        <div className="py-5 px-6 text-center">
          <p className="text-gray-500">Одоогоор newbie байхгүй байна.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 ">
      <h6 className="font-semibold py-5 px-6 space-y-5 text-xl">Таны Newbie</h6>
      
      <hr></hr>

      <div className="py-5 px-6">
        <div className="mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-15 h-15">
                {newbie?.profile_pic ? (
                  <AvatarImage 
                    src={newbie.profile_pic} 
                    alt={`${newbie.name || 'User'}'s avatar`}
                    onError={(e) => {
                      console.error("Failed to load avatar image:", newbie.profile_pic)
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : null}
                <AvatarFallback className="bg-green-100 text-green-600 font-semibold">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h6 className="text-base font-medium">{getDisplayName()}</h6>
                <p className="text-[#525252] text-sm font-medium">{getRoleDisplay()}</p>
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