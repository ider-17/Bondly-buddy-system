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

type SideBarMenuProps = {
    onSelectSection: (section: string) => void;
    selectedSection: string;
}

export default function SideBarMenu({ onSelectSection, selectedSection }: SideBarMenuProps) {
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
                    <div className='flex gap-2 p-2 bg-white rounded-xl'>
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h6 className='text-black text-sm font-medium'>Togtuun</h6>
                            <p className='text-xs text-[#737373] font-normal'>togtuun@apple.com</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h6 className='font-medium text-[#737373] text-xs mt-[10px] mb-[10px]'>Platform</h6>
                    <div className='w-full'>
                        {menuItems.map((item) => (
                            <div
                                key={item.label}
                                className={`w-full p-2 rounded-md flex gap-2 justify-between items-center cursor-pointer ${selectedSection === item.label ? 'bg-slate-200' : 'bg-white'
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

            <div className='w-full bg-white p-2 rounded-md flex gap-2 justify-between items-center cursor-pointer'>
                <div className='flex gap-2 items-center'>
                    <LogOut size={16} />
                    <p>Log out</p>
                </div>
                <ChevronRight size={16} />
            </div>
        </div>
    )
}