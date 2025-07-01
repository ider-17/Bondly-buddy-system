"use client";

import SideBarMenu from "@/app/_components/SideBarHome";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, LayoutGrid, List, Mountain, SquarePen } from "lucide-react";
import EventsThisWeek from "@/app/_components/EventsThisWeak";
import ActiveChallenges from "@/app/_components/ActiveChallenges";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfileCard from "@/app/_components/ProfileCard";
import MyInterests from "@/app/_components/MyInterests";
import ProfileInfo from "@/app/_components/ProfileInfo";
import Introduction from "@/app/_components/Introduction";
import InternYouGuiding from "@/app/_components/InternYou'reGuiding";
import ApprovalRequests from "@/app/_components/ApprovalRequests";
import InternProgress from "@/app/_components/InternProgress";
import InternYouGuidingInfo from "@/app/_components/InternYouGuidingInfo";
import CareerGoals from "@/app/_components/CareerGoals";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import YourProgress from "@/app/_components/YourProgress";
import { BuddyAdvice } from "@/app/_components/BuddyAdvice";
import BuddyProfile from "@/app/_components/BuddyProfile";


const tabs = ["Active", "Completed", "Upcoming"];

type Notification = {
  id: string;
  message: string;
  created_at: string;
};

export default function NewbieHome() {
  const [selectedSection, setSelectedSection] = useState("Нүүр");
  const [activeTab, setActiveTab] = useState("Active");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);

  // Fetch current logged-in user ID
  useEffect(() => {
    async function fetchUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error getting user:", error.message);
        return;
      }
      if (user) {
        setUserId(user.id);
      }
    }
    fetchUser();
  }, []);

  // Fetch notifications + subscribe realtime for notifications for this user
  useEffect(() => {
    if (!userId) return;

    async function fetchNotifications() {
      setLoadingNotifications(true);
      const { data, error } = await supabase
        .from("notification")
        .select("id, message, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching notifications:", error.message);
        setLoadingNotifications(false);
        return;
      }

      setNotifications(data ?? []);
      setLoadingNotifications(false);
    }

    fetchNotifications();

    const channel = supabase
      .channel("notification-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notification",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Your existing challenge status update toast listener
  useEffect(() => {
    const channel = supabase
      .channel("challenge-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "challenges",
        },
        (payload) => {
          if (payload.new.status === "pending") {
            toast("📝 New Approval Request", {
              description: `Challenge "${payload.new.title}" has been submitted for approval.`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const renderHeader = () => {
    if (selectedSection === "Нүүр") {
      return (
        <div className="bg-slate-100">
          <header className="h-fit header p-5 px-20 flex justify-between bg-white items-center border-b border-gray-200">
            <div className="flex gap-3 items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h6 className="text-base font-medium">Сайн уу👋 Тайванбат</h6>
                <div className="flex">
                  <p className="text-[#525252] font-medium text-sm">
                    UX/UI Senior Designer
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Popover>
                <PopoverTrigger className="relative">
                  <Bell className="cursor-pointer" size={18} />
                  {notifications.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-[10px] px-[6px] font-bold">
                      {notifications.length}
                    </span>
                  )}
                </PopoverTrigger>

                <PopoverContent className="max-h-60 w-80 overflow-auto">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold">Notifications</h4>
                    {notifications.length > 0 && (
                      <button
                        onClick={async () => {
                          if (!userId) return;
                          const { error } = await supabase
                            .from("notification")
                            .delete()
                            .eq("user_id", userId);
                          if (error) {
                            console.error("Failed to clear notifications:", error.message);
                            return;
                          }
                          setNotifications([]);
                        }}
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {loadingNotifications && <p>Loading...</p>}
                  {!loadingNotifications && notifications.length === 0 && (
                    <p className="text-gray-500">No new notifications</p>
                  )}
                  <ul>
                    {notifications.map((notif) => (
                      <li
                        key={notif.id}
                        className="mb-2 border-b border-gray-200 pb-1 text-sm"
                      >
                        {notif.message}
                        <br />
                        <time className="text-xs text-gray-400">
                          {new Date(notif.created_at).toLocaleString()}
                        </time>
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>

            </div>
          </header>

          <div className="flex gap-5 p-10 ml-10 mr-10">
            <div className="w-1/2 space-y-5">
              <InternYouGuiding />
              <ApprovalRequests />
            </div>
            <div className="w-1/2 space-y-5">
              <div className='rounded-xl border border-gray-200 py-5 px-6 space-y-5 bg-white'>
                <div className="space-y-3">
                  <h6 className='text-xl font-medium'>Шинэ ажилтны прогресс</h6>

                  <hr />

                  <YourProgress />
                </div>
              </div>
              <EventsThisWeek />
            </div>
          </div>
        </div>
      );

    } else if (selectedSection === "Сорилтууд") {
      return (
        <div>
          <header className="h-fit header p-5 pr-20 flex justify-between bg-white items-center border-b border-neutral-300">
            <div className="mx-20">
              <h1 className="text-xl font-semibold">Your Challenges</h1>
              <p className="text-sm font-medium text-neutral-600">
                Идэвхтэй, дууссан болон удахгүй болох сорилтуудаа эндээс хянах
                боломжтой
              </p>
            </div>
          </header>

          <div className="max-w-screen-2xl p-15 mx-auto px-2 flex gap-5">
            <div className="w-1/3 bg-white border border-neutral-300 rounded-xl py-5 flex flex-col gap-2">
              <div className="w-8 h-8 ml-5 bg-amber-100 rounded-lg flex justify-center items-center">
                <Mountain size={18} color="#d97708" />
              </div>
              <div className="flex flex-col ml-5">
                <p className=" text-lg font-bold">8</p>
                <p>Идэвхтэй</p>
              </div>
            </div>

            <div className="w-1/3 bg-white border border-neutral-300 rounded-xl py-5 flex flex-col gap-2 ">
              <div className="w-8 h-8 ml-5 bg-amber-100 rounded-lg flex justify-center items-center">
                <Mountain size={18} color="#d97708" />
              </div>
              <div className="flex flex-col ml-5">
                <p className=" text-lg font-bold">1</p>
                <p>Хүлээгдэж байгаа</p>
              </div>
            </div>

            <div className="w-1/3 bg-white border border-neutral-300 rounded-xl py-5 flex flex-col gap-2 ">
              <div className="w-8 h-8 bg-amber-100 ml-5 rounded-lg flex justify-center items-center">
                <Mountain size={18} color="#d97708" />
              </div>
              <div className="flex flex-col ml-5">
                <p className=" text-lg font-bold">12</p>
                <p>Биелэгдсэн</p>
              </div>
            </div>
          </div>


          <div className="flex justify-between items-center gap-4 mt-5 p-5 pr-15">
            <div className="flex-1">
              <div className="bg-gray-100 rounded-xl p-1 flex justify-between w-full">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full py-2 rounded-xl text-sm font-medium transition-all duration-200
                                            ${activeTab === tab
                        ? "bg-white shadow text-black"
                        : "text-gray-600"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg shadow-sm w-10 h-10"
                >
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-lg shadow-sm w-10 h-10"
                >
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
                  <SelectItem value="week4">Week 4</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-5 mr-10">
            <ActiveChallenges />
          </div>
        </div>
      );
    } else if (selectedSection === "Зөвлөмжүүд") {
      return (
        <div>
          <header className="h-fit header py-3 px-20 flex justify-between bg-white items-center border-b border-neutral-300">
            <div>
              <h1 className="text-base font-medium">Зөвлөмж</h1>
              <p className="text-sm font-medium text-neutral-600">
                Туршлага дээр суурилсан богино зөвлөмжүүд
              </p>
            </div>
            <div>
              <Bell size={18} />
            </div>
          </header>

          <div className="py-3 px-20 bg-slate-100 min-h-screen">
            <BuddyAdvice />
          </div>
        </div>
      );
    } else if (selectedSection === "Profile") {
      return (
        // <div>
        //   <header className="h-fit header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300">
        //     <div>
        //       <h1 className="text-xl font-semibold">Profile</h1>
        //       <p className="text-sm font-medium text-neutral-600">
        //         Өөрийн хувийн мэдээллээ харах, удирдах боломжтой.
        //       </p>
        //     </div>
        //     <div className="flex gap-2 py-2 px-3 border border-neutral-300 rounded-lg items-center">
        //       <SquarePen size={20} color="black" />
        //       <p className="text-sm font-medium">Edit</p>
        //     </div>
        //   </header>

        //   <div className="p-5 mr-10 space-y-5">
        //     <ProfileCard />

        //     <div className="flex gap-5">
        //       <div className="w-1/2 space-y-5">
        //         <MyInterests />
        //       </div>

        //       <div className="w-1/2">
        //         <InternProgress />
        //       </div>
        //     </div>

        //     <InternYouGuidingInfo />

        //     <ProfileInfo />

        //     <div className="flex gap-5">
        //       <div className="w-1/2 space-y-5">
        //         <MyInterests />
        //         <Introduction />
        //       </div>
        //       <div className="w-1/2">
        //         <CareerGoals />
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <div>
          <header className="h-fit header p-5 px-20 flex bg-white items-center border-b border-gray-200">
            <div>
              <h6 className="text-base font-medium">Профайл</h6>
              <p className="text-xs font-medium text-neutral-500">
                Өөрийн хувийн мэдээллээ харах, хянах боломжтой
              </p>
            </div>
          </header>

          {/* <div className="p-5 mr-10 space-y-5">
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
                  </div> */}

          <div className="bg-slate-100 py-10 px-20 min-h-screen space-y-5">
            <BuddyProfile />
            <MyInterests />
          </div>
        </div>
      );
    }
  };

  return (
    <div className="w-full h-screen bg-white flex">
      <SideBarMenu
        selectedSection={selectedSection}
        onSelectSection={(section) => setSelectedSection(section)}
      />
      <div className="w-full pl-[312px] flex flex-col h-screen overflow-auto">
        {renderHeader()}
      </div>
    </div>
  );
}
