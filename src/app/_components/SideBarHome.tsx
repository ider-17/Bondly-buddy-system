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
import { useEffect, useState } from 'react'
import { supabase } from "@/lib/supabase"

type SideBarMenuProps = {
    onSelectSection: (section: string) => void;
    selectedSection: string;
}

interface UserProfile {
    email: string
    name?: string
    avatar_url?: string
}

export default function SideBarMenu({ onSelectSection, selectedSection }: SideBarMenuProps) {
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
                    name: data.name || "Unknown",
                    avatar_url: data.avatar_url || "https://github.com/shadcn.png"
                })
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
                    <div onClick={() => onSelectSection("Profile")} className='flex gap-2 p-2 bg-white rounded-xl cursor-pointer hover:bg-slate-100 active:bg-slate-200 items-center'>
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