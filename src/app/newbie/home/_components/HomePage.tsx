'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"
import RotatingBuddyCard from "@/app/_components/RotatingBuddyCard";
import EventsThisWeek from "@/app/_components/EventsThisWeak";
import YourProgress from "@/app/_components/YourProgress";
import ActiveChallenges from "@/app/_components/ActiveChallenges";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface UserProfile {
  name?: string
  role?: string
  profile_pic?: string
  rank?: string
}

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session) {
        console.error("User session not found")
        setLoading(false)
        return
      }

      const userId = session.user.id

      // Fetch user profile data
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("name, role, profile_pic, rank")
        .eq("id", userId)
        .single()

      if (!userError && userData) {
        setProfile({
          name: userData.name || "User",
          role: userData.role || "newbie",
          profile_pic: userData.profile_pic || null,
          rank: userData.rank || null
        })
      }

    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserProfile()

    // Set up real-time subscription for user data changes
    const usersSubscription = supabase
      .channel("homepage_users_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
        },
        (payload) => {
          fetchUserProfile()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(usersSubscription)
    }
  }, [])

  // Generate avatar fallback from name
  const getAvatarFallback = () => {
    if (profile?.name) {
      return profile.name.charAt(0).toUpperCase()
    }
    return "U"
  }

  // Format role display
  const getRoleDisplay = () => {
    if (!profile?.rank) return "User"
    
    // Capitalize first letter and handle role formatting
    const roleMap: { [key: string]: string } = {
      'newbie': 'Newbie',
      'buddy': 'Buddy'
    }
    
    return roleMap[profile.rank] || profile.rank
  }

  // Get display name with rank if available
  const getDisplayName = () => {
    if (!profile?.name) return "User"
    
    return profile.name
  }

  return (
    <div>
      <header className="h-fit header p-5 px-20 flex justify-between bg-white items-center border-b border-gray-200">
        <div className="flex gap-3 items-center">
          {loading ? (
            <>
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="w-10 h-10">
                {profile?.profile_pic ? (
                  <AvatarImage 
                    src={profile.profile_pic} 
                    alt={`${profile.name || 'User'}'s avatar`}
                    onError={(e) => {
                      console.error("Failed to load avatar image:", profile.profile_pic)
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : null}
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {getAvatarFallback()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h6 className="text-base font-medium">
                  Сайн уу👋 {getDisplayName()}
                </h6>
                <p className="text-neutral-500 font-medium text-sm">
                  {getRoleDisplay()}
                </p>
              </div>
            </>
          )}
        </div>
        <div>
          <Popover>
            <PopoverTrigger>
              <Bell className="cursor-pointer" size={18} />
            </PopoverTrigger>
            <PopoverContent>Notifications</PopoverContent>
          </Popover>
        </div>
      </header>

      <div className="flex gap-5 py-10 px-20 bg-slate-100 min-h-screen">
        <div className="w-1/2 space-y-5">
          <RotatingBuddyCard />

          <div className="rounded-lg border border-gray-200 py-5 px-6 space-y-5 bg-white">
            <div className="flex items-center">
              <h6 className="text-lg font-medium">Идэвхтэй сорилтууд</h6>
            </div>
            <ActiveChallenges />
          </div>
        </div>
        
        <div className="w-1/2 space-y-5">
          <div className='rounded-lg border border-gray-200 py-5 px-6 space-y-5 bg-white'>
            <div>
              <h6 className='text-lg font-medium mb-5'>Таны прогресс</h6>
              <hr />
              <YourProgress />
            </div>
          </div>

          <EventsThisWeek />
        </div>
      </div>
    </div>
  );
}