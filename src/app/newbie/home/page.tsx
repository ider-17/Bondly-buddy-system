'use client'

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

import SideBarMenu from "@/app/_components/SideBarHome"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, LayoutGrid, List, Mountain, SquarePen } from "lucide-react"
import RotatingBuddyCard from "@/app/_components/RotatingBuddyCard"
import EventsThisWeek from "@/app/_components/EventsThisWeak"
import YourProgress from "@/app/_components/YourProgress"
import ActiveChallenges from "@/app/_components/ActiveChallenges"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import ProfileCard from "@/app/_components/ProfileCard"
import MyInterests from "@/app/_components/MyInterests"
import CareerGoals from "@/app/_components/CareerGoals"
import ProfileInfo from "@/app/_components/ProfileInfo"
import YourPrimaryBuddy from "@/app/_components/YourPrimaryBuddy"
import Introduction from "@/app/_components/Introduction"
import Interests from "@/app/_components/Interests"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const tabs = ["Active", "Completed", "Upcoming"]

export default function NewbieHome() {
    const [selectedSection, setSelectedSection] = useState("Home")
    const [activeTab, setActiveTab] = useState("Active")
    const [challenges, setChallenges] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchChallenges = async () => {
            setLoading(true)
            const { data, error } = await supabase.from("challenges").select("*")
            if (error) {
                console.error("Failed to fetch challenges:", error)
            } else {
                setChallenges(data)
            }
            setLoading(false)
        }

        fetchChallenges()
    }, [])

    const filteredChallenges = challenges.filter(
        (ch) => ch.status?.toLowerCase() === activeTab.toLowerCase()
    )

    const renderHeader = () => {
        if (selectedSection === "Home") {
            return (
                <div>
                    <header className='h-fit header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300'>
                        <div className='flex gap-3 items-center'>
                            <Avatar className='w-10 h-10'>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                                <h6 className='text-base font-medium'>Welcome Togtuun</h6>
                                <p className='text-[#525252] font-medium text-sm'>UX/UI Designer • Design</p>
                            </div>
                        </div>
                        <div>
                            <Popover>
                                <PopoverTrigger><Bell className="cursor-pointer" size={18} /></PopoverTrigger>
                                <PopoverContent>Notifications</PopoverContent>
                            </Popover>
                        </div>
                    </header>

                    <div className="flex gap-5 p-5 mr-10">
                        <div className="w-1/2 space-y-5">
                            <RotatingBuddyCard />
                            <EventsThisWeek />
                        </div>
                        <div className="w-1/2 space-y-5">
                            <YourProgress />
                            <ActiveChallenges />
                        </div>
                    </div>
                </div>
            )
        } else if (selectedSection === "Challenges") {
            return (
                <div>
                    <header className='h-fit header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300'>
                        <div>
                            <h1 className='text-xl font-semibold'>Your Challenges</h1>
                            <p className="text-sm font-medium text-neutral-600">Идэвхтэй, дууссан болон удахгүй болох сорилтуудаа эндээс хянах боломжтой</p>
                        </div>
                    </header>

                    <div className="w-full flex gap-5 p-5 pb-0 pr-15">
                        {/* Overview cards */}
                        {["Active", "Completed", "Upcoming"].map((status, idx) => (
                            <div
                                key={idx}
                                className='w-1/3 bg-slate-50 border border-neutral-300 rounded-xl py-5 flex flex-col gap-2 items-center'
                            >
                                <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                                    <Mountain size={18} color='#22C55E' />
                                </div>
                                <div className='flex flex-col items-center text-center'>
                                    <p className={`text-lg font-bold ${status === "Active"
                                        ? "text-blue-700"
                                        : status === "Completed"
                                            ? "text-green-700"
                                            : "text-violet-700"
                                        }`}>
                                        {challenges.filter(ch => ch.status?.toLowerCase() === status.toLowerCase()).length}
                                    </p>
                                    <p>{status}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-between items-center gap-4 mt-5 p-5 pr-15">
                        <div className="flex-1">
                            <div className="bg-gray-100 rounded-xl p-1 flex justify-between w-full">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`w-full py-2 rounded-xl text-sm font-medium transition-all duration-200
                                            ${activeTab === tab ? "bg-white shadow text-black" : "text-gray-600"}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 items-center">
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" className="rounded-lg shadow-sm w-10 h-10">
                                    <LayoutGrid className="w-5 h-5" />
                                </Button>
                                <Button variant="outline" size="icon" className="rounded-lg shadow-sm w-10 h-10">
                                    <List className="w-5 h-5" />
                                </Button>
                            </div>

                            <Select>
                                <SelectTrigger className="w-[160px] py-5 shadow-sm rounded-lg text-sm">
                                    <SelectValue placeholder="All weeks" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All weeks</SelectItem>
                                    <SelectItem value="week1">Week 1</SelectItem>
                                    <SelectItem value="week2">Week 2</SelectItem>
                                    <SelectItem value="week3">Week 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Challenge List */}
                    <div className="p-5 mr-10"> <ActiveChallenges /> </div>
                </div>
            )
        } else if (selectedSection === "Advice") {
            return (
                <div>
                    <header className='h-fit header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300'>
                        <div>
                            <h1 className='text-xl font-semibold'>Your Advices</h1>
                            <p className="text-sm font-medium text-neutral-600">Туршлага дээр суурилсан зөвлөмжүүдийг уншаарай</p>
                        </div>
                    </header>

                    <div className="p-5 mr-10">
                        <p className="text-gray-600">Advice content is coming soon...</p>
                    </div>
                </div>
            )
        } else if (selectedSection === "Profile") {
            return (
                <div>
                    <header className='h-fit header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300'>
                        <div>
                            <h1 className='text-xl font-semibold'>Profile</h1>
                            <p className="text-sm font-medium text-neutral-600">Өөрийн хувийн мэдээллээ харах, удирдах боломжтой.</p>
                        </div>
                        <div className="flex gap-2 py-2 px-3 border border-neutral-300 rounded-lg items-center">
                            <SquarePen size={20} color="black" />
                            <p className="text-sm font-medium">Edit</p>
                        </div>
                    </header>

                    <div className="p-5 mr-10 space-y-5">
                        <ProfileCard />

                        <div className="flex gap-5">
                            <div className="w-1/2 space-y-5">
                                <MyInterests />
                                <CareerGoals />
                            </div>

                            <div className="w-1/2">
                                <YourProgress />
                            </div>
                        </div>

                        <YourPrimaryBuddy />
                        <ProfileInfo />

                        <div className="flex gap-5">
                            <Introduction />
                            <Interests />
                        </div>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="w-full h-screen bg-white flex">
            <SideBarMenu
                selectedSection={selectedSection}
                onSelectSection={(section) => setSelectedSection(section)}
            />
            <div className="w-full pl-[264px] flex flex-col h-screen overflow-auto">
                {renderHeader()}
            </div>
        </div>
    )
}
