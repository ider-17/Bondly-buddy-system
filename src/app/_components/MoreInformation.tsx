'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Skeleton } from "@/components/ui/skeleton"

export interface UserProfile {
    email: string
    phone_number?: bigint | number
    created_at?: string
}

export default function MoreInformation() {
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
                .select("email, phone_number, created_at")
                .eq("id", userId)
                .single()

            if (!userError && userData) {
                setProfile({
                    email: userData.email,
                    phone_number: userData.phone_number,
                    created_at: userData.created_at
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
            .channel("more_info_users_changes")
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

    // Format date helper function
    const formatDate = (dateString?: string) => {
        if (!dateString) return "2025 • 06 • 12"
        
        const date = new Date(dateString)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        
        return `${year} • ${month} • ${day}`
    }

    if (loading) {
        return (
            <div className="py-5 px-6 rounded-xl bg-white border border-gray-200 space-y-6">
                <Skeleton className="h-6 w-48" />
                <hr />
                <div className="space-y-3">
                    <div className="py-2 px-6 border border-gray-200 rounded-lg space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="py-2 px-6 border border-gray-200 rounded-lg space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-32" />
                    </div>
                    <div className="py-2 px-6 border border-gray-200 rounded-lg space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-5 w-28" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="py-5 px-6 rounded-xl bg-white border border-gray-200 space-y-6">
            <h6 className="text-lg font-semibold">Дэлгэрэнгүй мэдээлэл</h6>

            <hr />

            <div className="space-y-3">
                <div className="py-2 px-6 border border-gray-200 rounded-lg">
                    <p className="text-neutral-600 font-medium">Mail</p>
                    <p className="font-medium">{profile?.email || "Loading..."}</p>
                </div>

                <div className="py-2 px-6 border border-gray-200 rounded-lg">
                    <p className="text-neutral-600 font-medium">Phone number</p>
                    <p className="font-medium">
                        {profile?.phone_number ? `+976 ${profile.phone_number}` : "Not provided"}
                    </p>
                </div>

                <div className="py-2 px-6 border border-gray-200 rounded-lg">
                    <p className="text-neutral-600 font-medium">Started</p>
                    <p className="font-medium">{formatDate(profile?.created_at)}</p>
                </div>
            </div>
        </div>
    )
}