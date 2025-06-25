'use client'

import {
    BookOpen,
    ChevronRight,
    HeartHandshake,
    House,
    LogOut,
    Mountain,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'

type SideBarMenuProps = {
    onSelectSection: (section: string) => void;
    selectedSection: string;
}

interface UserProfile {
    email: string
    name?: string
}

export default function SideBarMenu({ onSelectSection, selectedSection }: SideBarMenuProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const supabase = createClientComponentClient() // ✅ Move this before useEffect

    useEffect(() => {
        async function fetchUserProfile() {
            try {
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser()

                if (userError || !user) {
                    console.log('No user found:', userError?.message)
                    return
                }

                console.log('User found:', user.id) // Debug log
                console.log('User email from auth:', user.email) // Debug log

                // Try different approaches to get user data

                // Option 1: If your table is called "profiles" instead of "users"
                let { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single()

                // Option 2: If that fails, try "users" table
                if (error) {
                    console.log('Trying users table...')
                    const result = await supabase
                        .from("users")
                        .select("*")
                        .eq("id", user.id)
                        .single()

                    data = result.data
                    error = result.error
                }

                if (error) {
                    console.error('Error fetching user profile:', error.message)
                    console.log('Error details:', error)

                    // Fallback: use auth user data
                    setProfile({
                        email: user.email || "No email",
                        name: user.user_metadata?.name || user.user_metadata?.full_name || "Unknown",
                    })
                    return
                }

                if (data) {
                    console.log('Profile data:', data) // Debug log
                    setProfile({
                        email: data.email || user.email || "No email",
                        name: data.name || data.full_name || data.display_name || user.user_metadata?.name || "Unknown",
                    })
                } else {
                    console.log('No profile data found, using auth data')
                    // Fallback to auth user data
                    setProfile({
                        email: user.email || "No email",
                        name: user.user_metadata?.name || user.user_metadata?.full_name || "Unknown",
                    })
                }
            } catch (error) {
                console.error('Unexpected error:', error)
            }
        }

        fetchUserProfile()
    }, [supabase]) // Add supabase as dependency

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error('Logout error:', error.message)
        } else {
            window.location.href = '/login'
        }
    }

    const menuItems = [
        { icon: <House size={16} />, label: 'Home' },
        { icon: <Mountain size={16} />, label: 'Challenges' },
        { icon: <BookOpen size={16} />, label: 'Advice' },
    ]

    return (
        <div className='fixed top-0 left-0 min-w-[264px] h-screen py-6 px-3 bg-slate-50 flex flex-col justify-between border-r border-neutral-300 z-10'>
            <div className='space-y-3'>
                <div className='flex gap-2 bg-white rounded-xl p-2'>
                    <div className='w-8 h-8 p-2 rounded-full bg-black flex items-center justify-center'>
                        <HeartHandshake color='white' />
                    </div>
                    <div>
                        <h6 className='text-sm font-semibold'>Bondly</h6>
                        <p className='text-[#737373] text-xs font-normal'>Company</p>
                    </div>
                </div>

                <div>
                    <h6 className='font-medium text-[#737373] text-xs mt-[10px] mb-[10px]'>Profile</h6>
                    <div onClick={() => onSelectSection("Profile")} className='flex gap-2 p-2 bg-white rounded-xl cursor-pointer hover:bg-slate-100 active:bg-slate-200'>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
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

                <div>
                    <h6 className='font-medium text-[#737373] text-xs mt-[10px] mb-[10px]'>Platform</h6>
                    <div className='w-full'>
                        {menuItems.map((item) => (
                            <div
                                key={item.label}
                                className={`w-full p-2 rounded-md flex gap-2 justify-between items-center cursor-pointer hover:bg-slate-100 select-none ${selectedSection === item.label ? 'bg-slate-200' : 'bg-white'
                                    }`}
                                onClick={() => onSelectSection(item.label)}
                            >
                                <div className='flex gap-2 items-center'>
                                    {item.icon}
                                    <p>{item.label}</p>
                                </div>
                                <ChevronRight size={16} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div
                onClick={handleLogout}
                className='w-full bg-white p-2 rounded-md flex gap-2 justify-between items-center cursor-pointer hover:bg-slate-100 transition'
            >
                <div className='flex gap-2 items-center'>
                    <LogOut size={16} />
                    <p>Log out</p>
                </div>
                <ChevronRight size={16} />
            </div>
        </div>
    )
}