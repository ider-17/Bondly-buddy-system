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
                        avatar_url: data.avatar_url || "https://github.com/shadcn.png",
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

    const baseMenuItems = [
        { icon: <House size={16} />, label: 'Нүүр' },
        { icon: <Mountain size={16} />, label: 'Сорилтууд' },
        { icon: <Lightbulb size={16} />, label: 'Зөвлөмжүүд' },
    ]

    const newbieOnlyItems = [
        { icon: <Handshake size={16} />, label: 'Таны үндсэн хамтрагч' },
    ]

    const menuItems = profile?.role === 'newbie' 
        ? [...baseMenuItems, ...newbieOnlyItems]
        : baseMenuItems

    if (loading) {
        return (
            <div className='fixed top-0 left-0 min-w-[312px] h-screen py-3 px-5 bg-white flex flex-col justify-center items-center border-r border-gray-200 z-10'>
                <div className="text-center">
                    <p className="text-gray-500">Loading...</p>
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
                                <AvatarImage src={profile?.avatar_url || "https://github.com/shadcn.png"} />
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
                </div>
            </div>

            <div
                onClick={handleLogout}
                className='w-full bg-white py-3 px-5 rounded-lg flex gap-4 items-center cursor-pointer hover:bg-slate-50 transition'
            >
                <div className='flex gap-4 items-center'>
                    <LogOut size={16} />
                    <p>Гарах</p>
                </div>
            </div>
        </div>
    )
}