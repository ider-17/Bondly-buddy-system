'use client'

import {
    Handshake,
    HeartHandshake,
    House,
    Lightbulb,
    LogOut,
    Mountain,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from 'react'
import { supabase } from "@/lib/supabase"

type SideBarMenuProps = {
    onSelectSection: (section: string) => void;
    selectedSection: string;
}

interface UserProfile {
    email: string
    name?: string
    profile_pic?: string  // Changed from avatar_url to profile_pic
    role: 'newbie' | 'buddy'
}

export default function SideBarMenu({ onSelectSection, selectedSection }: SideBarMenuProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser()

                if (userError || !user) {
                    console.error('User error:', userError)
                    setLoading(false)
                    return
                }

                const { data, error } = await supabase
                    .from("users")
                    .select("*")
                    .eq("id", user.id)
                    .single()

                if (!error && data) {
                    setProfile({
                        email: data.email,
                        name: data.name || "Unknown",
                        profile_pic: data.profile_pic || null,  // Changed from avatar_url to profile_pic
                        role: data.role
                    })
                } else {
                    console.error('Profile fetch error:', error)
                }
            } catch (err) {
                console.error('Unexpected error:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [])

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('Logout error:', error.message)
        } else {
            window.location.href = '/login'
        }
    }

    // Generate avatar fallback from name or email (similar to ProfileCard)
    const getAvatarFallback = () => {
        if (profile?.name) {
            return profile.name.charAt(0).toUpperCase()
        }
        if (profile?.email) {
            return profile.email.charAt(0).toUpperCase()
        }
        return "U"
    }

    const baseMenuItems = [
        { icon: <House size={16} />, label: 'Нүүр' },
        { icon: <Mountain size={16} />, label: 'Сорилтууд' },
        { icon: <Lightbulb size={16} />, label: 'Зөвлөмжүүд' },
    ]

    const newbieOnlyItems = [
        { icon: <Handshake size={16} />, label: 'Primary Buddy' },
    ]

    const menuItems = profile?.role === 'newbie' 
        ? [...baseMenuItems, ...newbieOnlyItems]
        : baseMenuItems

    if (loading) {
        return (
            <div className='fixed top-0 left-0 min-w-[312px] h-screen py-3 px-5 bg-white flex flex-col justify-between border-r border-gray-200 z-10'>
                <div>
                    {/* Logo section skeleton */}
                    <div className='flex gap-4 bg-white rounded-xl py-3 px-5'>
                        <Skeleton className='w-8 h-8 rounded-full' />
                        <div className='space-y-2'>
                            <Skeleton className='h-4 w-16' />
                            <Skeleton className='h-3 w-40' />
                        </div>
                    </div>

                    <hr />

                    <div className='mt-3 space-y-3'>
                        <div>
                            <Skeleton className='h-3 w-16 mt-[10px] mb-[10px]' />
                            <div className='w-full space-y-2'>
                                {/* Menu items skeleton */}
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className='w-full py-3 px-5 rounded-lg flex gap-4 items-center'>
                                        <Skeleton className='w-4 h-4' />
                                        <Skeleton className='h-4 w-24' />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Skeleton className='h-3 w-12 mt-[10px] mb-[10px]' />
                            <div className='flex gap-4 py-3 px-5 rounded-lg items-center'>
                                <Skeleton className='w-10 h-10 rounded-full' />
                                <div className='space-y-2'>
                                    <Skeleton className='h-4 w-20' />
                                    <Skeleton className='h-3 w-32' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout skeleton */}
                <div className='w-full bg-white py-3 px-5 rounded-lg flex gap-4 items-center'>
                    <Skeleton className='w-4 h-4' />
                    <Skeleton className='h-4 w-12' />
                </div>
            </div>
        )
    }

    return (
        <div className='fixed top-0 left-0 min-w-[312px] h-screen py-3 px-5 bg-white flex flex-col justify-between border-r border-gray-200 z-10'>
            <div>
                <div className='flex gap-4 bg-white rounded-xl py-3 px-5'>
                    <div className='w-8 h-8 p-2 rounded-full bg-black flex items-center justify-center'>
                        <HeartHandshake color='white' />
                    </div>
                    <div>
                        <h6 className='text-sm'>Bondly</h6>
                        <p className='text-[#737373] text-sm font-normal'>New hire support platform</p>
                    </div>
                </div>

                <hr />

                <div className='mt-3 space-y-3'>
                    <div>
                        <h6 className='font-medium text-[#737373] text-xs mt-[10px] mb-[10px]'>Platform</h6>
                        <div className='w-full'>
                            {menuItems.map((item) => (
                                <div
                                    key={item.label}
                                    className={`w-full py-3 px-5 rounded-lg flex gap-4 items-center cursor-pointer hover:bg-slate-50 select-none ${selectedSection === item.label ? 'bg-slate-50' : 'bg-white'
                                        }`}
                                    onClick={() => onSelectSection(item.label)}
                                >
                                    <div className={`flex gap-4 items-center ${selectedSection === item.label ? 'text-[#FB923C]' : 'text-black'} `}>
                                        {item.icon}
                                        <p className='text-black text-sm'>{item.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h6 className='font-medium text-[#737373] text-xs mt-[10px] mb-[10px]'>Profile</h6>
                        <div onClick={() => onSelectSection("Profile")} className={`flex gap-4 py-3 px-5 rounded-lg cursor-pointer hover:bg-slate-50 active:bg-slate-50 items-center ${selectedSection === "Profile" ? "bg-slate-50" : "bg-white"}`}>
                            <Avatar>
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
                                <h6 className='text-black text-sm font-medium select-none'>
                                    {profile?.name || 'Loading...'}
                                </h6>
                                <p className='text-xs text-[#737373] font-normal'>
                                    {profile?.email || 'Loading...'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                onClick={handleLogout}
                className='w-full bg-white py-3 px-5 rounded-lg flex gap-4 items-center cursor-pointer hover:bg-slate-100 active:bg-slate-300 transition'
            >
                <div className='flex gap-4 items-center'>
                    <LogOut size={16} />
                    <p>Гарах</p>
                </div>
            </div>
        </div>
    )
}