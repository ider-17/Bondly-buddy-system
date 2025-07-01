'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { CalendarCheck, CalendarDays, Lightbulb, Mail, Mountain, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

export interface UserProfile {
    email: string
    phone_number?: bigint | number
    joined_at?: string
    name?: string
    role?: string
    profile_pic?: string
    rank?: string
    interests?: string[]
    career_goals?: string
}

export default function ProfileCard() {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeDays, setActiveDays] = useState<number>(0)
    const [completedChallenges, setCompletedChallenges] = useState<number>(0)
    const [readTips, setReadTips] = useState<number>(0)

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
                .select("*")
                .eq("id", userId)
                .single()

            if (!userError && userData) {
                setProfile({
                    email: userData.email,
                    phone_number: userData.phone_number,
                    joined_at: userData.created_at || "2025-06-12",
                    name: userData.name || "Unknown",
                    role: userData.role || "newbie",
                    profile_pic: userData.profile_pic || null,
                    rank: userData.rank,
                    interests: userData.interests,
                    career_goals: userData.career_goals
                })
            }

            // Fetch progress data in parallel
            const [
                { count: activeDaysCount, error: activeDaysError },
                { count: completedChallengesCount, error: challengesError },
                { count: readTipsCount, error: readTipsError }
            ] = await Promise.all([
                supabase
                    .from("user_activity")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", userId),
                supabase
                    .from("submissions")
                    .select("*", { count: "exact", head: true })
                    .eq("status", "approved")
                    .eq("user_id", userId),
                supabase
                    .from("read_tips")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", userId)
            ])

            if (activeDaysError) {
                console.error("Error fetching active days:", activeDaysError)
            } else {
                setActiveDays(activeDaysCount || 0)
            }

            if (challengesError) {
                console.error("Error fetching completed challenges:", challengesError)
            } else {
                setCompletedChallenges(completedChallengesCount || 0)
            }

            if (readTipsError) {
                console.error("Error fetching read tips:", readTipsError)
            } else {
                setReadTips(readTipsCount || 0)
            }

        } catch (error) {
            console.error("Error in fetchUserProfile:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUserProfile()

        // Set up real-time subscriptions
        const readTipsSubscription = supabase
            .channel("profile_read_tips_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "read_tips",
                },
                (payload) => {
                    fetchUserProfile()
                }
            )
            .subscribe()

        const activitySubscription = supabase
            .channel("profile_activity_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "user_activity",
                },
                (payload) => {
                    fetchUserProfile()
                }
            )
            .subscribe()

        const submissionsSubscription = supabase
            .channel("profile_submissions_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "submissions",
                },
                (payload) => {
                    fetchUserProfile()
                }
            )
            .subscribe()

        const usersSubscription = supabase
            .channel("profile_users_changes")
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
            supabase.removeChannel(readTipsSubscription)
            supabase.removeChannel(activitySubscription)
            supabase.removeChannel(submissionsSubscription)
            supabase.removeChannel(usersSubscription)
        }
    }, [])

    console.log(profile, "profileas")

    if (loading) {
        return (
            <div className="w-full py-5 px-6 border border-gray-200 rounded-xl bg-white space-y-5">
                {/* Profile Header Skeleton */}
                <div className="flex gap-3 items-center">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>

                <hr />

                {/* Title Skeleton */}
                <Skeleton className="h-4 w-48" />

                {/* Stats Cards Skeleton */}
                <div className="flex gap-3 mb-5">
                    <div className="w-1/3 border border-gray-200 bg-white p-3 rounded-lg space-y-3">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-4" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>

                    <div className="w-1/3 border border-gray-200 bg-white p-3 rounded-lg space-y-3">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-4" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>

                    <div className="w-1/3 border border-gray-200 bg-white p-3 rounded-lg space-y-3">
                        <Skeleton className="w-8 h-8 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-4" />
                            <Skeleton className="h-4 w-18" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Generate avatar fallback from name or email
    const getAvatarFallback = () => {
        if (profile?.name) {
            return profile.name.charAt(0).toUpperCase()
        }
        if (profile?.email) {
            return profile.email.charAt(0).toUpperCase()
        }
        return "U"
    }

    return (
        <div className="w-full py-5 px-6 border border-gray-200 rounded-xl bg-white space-y-5">
            <div className="flex gap-3 items-center">
                <Avatar className="w-16 h-16">
                    {profile?.profile_pic ? (
                        <AvatarImage 
                            src={profile.profile_pic} 
                            alt={`${profile.name || 'User'}'s avatar`}
                            onError={(e) => {
                                console.error("Failed to load avatar image:", profile.profile_pic)
                                // Hide the image if it fails to load, fallback will show
                                e.currentTarget.style.display = 'none'
                            }}
                        />
                    ) : null}
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                        {getAvatarFallback()}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-lg font-medium">{profile?.name || "Loading..."}</h2>
                    <p className="text-neutral-600 text-sm font-medium">{profile?.rank}</p>
                </div>
            </div>

            <hr />

            <h6 className="text-sm font-semibold">Таны Onboarding-ийн ахиц</h6>

            <div className="flex gap-3 mb-5">
                <div className="w-1/3 border border-gray-200 bg-white p-3 rounded-lg space-y-3">
                    <div className="w-8 h-8 bg-blue-100 flex justify-center items-center rounded-lg">
                        <CalendarCheck size={18} color="#2563EB" />
                    </div>

                    <div>
                        <h5 className="text-base font-bold">{activeDays}</h5>
                        <p className="text-sm font-medium">Идэвхтэй
                            өдрүүд</p>
                    </div>
                </div>

                <div className="w-1/3 border border-gray-200 bg-white p-3 rounded-lg space-y-3">
                    <div className="w-8 h-8 bg-amber-100 flex justify-center items-center rounded-lg">
                        <Mountain size={18} color="#D97706" />
                    </div>

                    <div>
                        <h5 className="text-base font-bold">{completedChallenges}</h5>
                        <p className="text-sm font-medium">Биелүүлсэн
                            сорилтууд</p>
                    </div>
                </div>

                <div className="w-1/3 border border-gray-200 bg-white p-3 rounded-lg space-y-3">
                    <div className="w-8 h-8 bg-violet-100 flex justify-center items-center rounded-lg">
                        <Lightbulb size={18} color="#7C3AED" />
                    </div>

                    <div>
                        <h5 className="text-base font-bold">{readTips}</h5>
                        <p className="text-sm font-medium">Уншсан
                            зөвлөмжүүд</p>
                    </div>
                </div>
            </div>
        </div>
    )
}