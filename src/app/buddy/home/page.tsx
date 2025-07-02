"use client";

import SideBarMenu from "@/app/_components/SideBarHome";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Mountain } from "lucide-react";
import EventsThisWeek from "@/app/_components/EventsThisWeak";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InternYouGuiding from "@/app/_components/InternYou'reGuiding";
import ApprovalRequests from "@/app/_components/ApprovalRequests";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BuddyAdvice } from "@/app/_components/BuddyAdvice";
import BuddyProfile from "@/app/_components/BuddyProfile";
import BuddyInterests from "@/app/_components/BuddyInterest";
import { Skeleton } from "@/components/ui/skeleton";
import ProgressTracker from "@/app/_components/BuddyProgress";

interface Challenge {
  id: string;
  title: string;
  week: string;
  difficulty: "Easy" | "Medium" | "Hard";
  note: string | null;
  status: string | null;
  user_id: string;
  created_at: string;
  derivedStatus?: string;
  users?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Submission {
  id: string;
  challenge_id: string;
  user_id: string;
  note: string;
  status: string;
  submitted_at: string;
}

type Notification = {
  id: string;
  message: string;
  created_at: string;
};

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  position?: string;
  avatar_url?: string;
  rank?: string;
  profile_pic?: string;
}

export default function BuddyHome() {
  const [selectedSection, setSelectedSection] = useState("Нүүр");
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedWeek, setSelectedWeek] = useState("all");
  const [loading, setLoading] = useState(false);

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [note, setNote] = useState("");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Add user profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoadingProfile(true);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.error("Error getting user:", authError?.message);
          return;
        }

        setUserId(user.id);

        // Fetch user profile from your users table
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("id, name, email, role, rank, profile_pic")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError.message);
          // Fallback to auth user data
          setUserProfile({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            role: 'newbie',
            avatar_url: user.user_metadata?.avatar_url,
          });
        } else {
          setUserProfile(profileData);
        }
      } catch (error) {
        console.error("Error in fetchUserProfile:", error);
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchUserProfile();
  }, []);

  // Original notification fetching logic
  useEffect(() => {
    async function fetchNotifications() {
      if (!userId) return;

      setLoadingNotifications(true);
      const { data, error } = await supabase
        .from("notification")
        .select("id, message, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.error("Error fetching notifications:", error.message);
      } else {
        setNotifications(data ?? []);
      }
      setLoadingNotifications(false);
    }

    if (userId) {
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
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    async function fetchData() {
      setLoading(true);

      try {
        // Fixed the join - using 'users' instead of 'user' to match your database schema
        const { data: challengesData, error: challengesError } = await supabase
          .from("challenges")
          .select(`
            *,
            users:user_id (
              id,
              name,
              email
            )
          `)
          .order("created_at", { ascending: false });

        if (challengesError) {
          console.error("Error fetching challenges:", challengesError.message);
        } else {
          setChallenges(challengesData || []);
        }

        const { data: submissionsData, error: submissionsError } = await supabase
          .from("submissions")
          .select("*")
          .order("submitted_at", { ascending: false });

        if (submissionsError) {
          console.error("Error fetching submissions:", submissionsError.message);
        } else {
          setSubmissions(submissionsData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userId]);

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

  const getChallengeStatus = (challengeId: string) => {
    const submission = submissions.find(
      (sub) => sub.challenge_id === challengeId
    );
    if (!submission) {
      return "active";
    }
    return submission.status === "approved" ? "completed" : "pending";
  };

  const getFilteredChallenges = () => {
    const challengesWithStatus = challenges.map((challenge) => ({
      ...challenge,
      derivedStatus: getChallengeStatus(challenge.id),
    }));

    let filteredByStatus;
    switch (activeTab.toLowerCase()) {
      case "active":
        filteredByStatus = challengesWithStatus.filter(
          (ch) => ch.derivedStatus === "active"
        );
        break;
      case "pending":
        filteredByStatus = challengesWithStatus.filter(
          (ch) => ch.derivedStatus === "pending"
        );
        break;
      case "completed":
        filteredByStatus = challengesWithStatus.filter(
          (ch) => ch.derivedStatus === "completed"
        );
        break;
      default:
        filteredByStatus = challengesWithStatus;
    }

    if (selectedWeek === "all") {
      return filteredByStatus;
    } else {
      return filteredByStatus.filter((ch) => ch.week === selectedWeek);
    }
  };

  const filteredChallenges = getFilteredChallenges();

  const getStatusCounts = () => {
    const challengesWithStatus = challenges.map((challenge) => ({
      ...challenge,
      derivedStatus: getChallengeStatus(challenge.id),
    }));

    const weekFilteredChallenges =
      selectedWeek === "all"
        ? challengesWithStatus
        : challengesWithStatus.filter((ch) => ch.week === selectedWeek);

    return {
      active: weekFilteredChallenges.filter(
        (ch) => ch.derivedStatus === "active"
      ).length,
      pending: weekFilteredChallenges.filter(
        (ch) => ch.derivedStatus === "pending"
      ).length,
      completed: weekFilteredChallenges.filter(
        (ch) => ch.derivedStatus === "completed"
      ).length,
    };
  };

  const statusCounts = getStatusCounts();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedChallenge || !userId) return;

    try {
      const { error } = await supabase
        .from("challenges")
        .update({
          note: note,
          status: "pending"
        })
        .eq("id", selectedChallenge.id);

      if (error) {
        toast.error("Failed to submit: " + error.message);
        return;
      }

      const { error: submissionError } = await supabase
        .from("submissions")
        .insert({
          challenge_id: selectedChallenge.id,
          user_id: userId,
          note: note,
          status: "pending"
        });

      if (submissionError) {
        toast.error("Failed to create submission: " + submissionError.message);
        return;
      }

      toast.success("Challenge submitted for approval!");
      setNote("");
      setSelectedChallenge(null);

      // Refresh data after successful submission
      const { data: updatedChallenges } = await supabase
        .from("challenges")
        .select(`
          *,
          users:user_id (
            id,
            name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      const { data: updatedSubmissions } = await supabase
        .from("submissions")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (updatedChallenges) setChallenges(updatedChallenges);
      if (updatedSubmissions) setSubmissions(updatedSubmissions);

    } catch (error) {
      console.error("Error submitting challenge:", error);
      toast.error("Failed to submit challenge");
    }
  }

  // Generate avatar fallback from name (matching HomePage.tsx pattern)
  const getAvatarFallback = () => {
    if (userProfile?.name) {
      return userProfile.name.charAt(0).toUpperCase()
    }
    return "U"
  }

  // Format role display (matching HomePage.tsx pattern)
  const getRoleDisplay = () => {
    if (!userProfile?.rank) return "User"

    // Capitalize first letter and handle role formatting
    const roleMap: { [key: string]: string } = {
      'newbie': 'Newbie',
      'buddy': 'Buddy'
    }

    return roleMap[userProfile.rank] || userProfile.rank
  }

  // Get display name (matching HomePage.tsx pattern)
  const getDisplayName = () => {
    if (!userProfile?.name) return "User"

    return userProfile.name
  }

  // Helper function to format position/role display
  const getDisplayPosition = (profile: UserProfile | null) => {
    if (!profile) return 'User';
    if (profile.role === 'buddy') return 'Buddy';
    if (profile.role === 'newbie') return 'Intern';
    return 'User';
  };

  const renderHeader = () => {
    if (selectedSection === "Нүүр") {
      return (
        <div className="bg-slate-100">
          <header className="h-fit header p-5 px-20 flex justify-between bg-white items-center border-b border-gray-200">
            <div className="flex gap-3 items-center">
              {loadingProfile ? (
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
                    {userProfile?.profile_pic ? (
                      <AvatarImage
                        src={userProfile.profile_pic}
                        alt={`${userProfile.name || 'User'}'s avatar`}
                        onError={(e) => {
                          console.error("Failed to load avatar image:", userProfile.profile_pic)
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

          <div className="flex flex-col gap-8 px-20 py-10 w-full">
            <div className="w-full">
              <ProgressTracker />
            </div>

            <InternYouGuiding />

            <div className="flex gap-5">
              <div className="w-1/2 h-fit rounded-lg border border-gray-200 bg-white">
                <ApprovalRequests />
              </div>
              <EventsThisWeek />
            </div>
          </div>
        </div>
      );

    } else if (selectedSection === "Сорилтууд") {
      return (
        <div>
          <header className="h-fit header p-5 px-20 flex justify-between bg-white items-center border-b border-gray-200">
            <div>
              <h1 className="text-xl font-semibold">Сорилтууд</h1>
              <p className="text-sm font-medium text-neutral-600">
                Идэвхтэй, хүлээгдэж байгаа болон биелэгдсэн сорилтуудаа хянах
                боломжтой
              </p>
            </div>
          </header>

          <div className="py-10 px-20 bg-slate-100 space-y-5 min-h-screen">
            <div className="w-full flex gap-5">
              {[
                {
                  name: "Идэвхтэй",
                  count: statusCounts.active,
                  key: "Active",
                },
                {
                  name: "Хүлээгдэж байгаа",
                  count: statusCounts.pending,
                  key: "Pending",
                },
                {
                  name: "Биелэгдсэн",
                  count: statusCounts.completed,
                  key: "Completed",
                },
              ].map((status, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab(status.key)}
                  className={`w-1/3 bg-white border rounded-xl p-5 flex flex-col gap-2 cursor-pointer hover:bg-slate-100 transition-colors ${activeTab === status.key
                    ? "border-gray-400"
                    : "border-gray-200"
                    }`}
                >
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex justify-center items-center">
                    <Mountain size={18} color="#D97706" />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-lg font-bold">
                      {status.count}
                    </p>
                    <p className="text-sm font-normal">{status.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-self-end justify-between items-center">
              <Select value={selectedWeek} onValueChange={setSelectedWeek}>
                <SelectTrigger className="py-5 rounded-lg text-sm bg-white border border-gray-200 select-none">
                  <SelectValue placeholder="All weeks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Бүх долоо хоног</SelectItem>
                  <SelectItem value="1-р долоо хоног">1-р долоо хоног</SelectItem>
                  <SelectItem value="2-р долоо хоног">2-р долоо хоног</SelectItem>
                  <SelectItem value="3-р долоо хоног">3-р долоо хоног</SelectItem>
                  <SelectItem value="4-р долоо хоног">4-р долоо хоног</SelectItem>
                  <SelectItem value="5-р долоо хоног">5-р долоо хоног</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-5 border border-gray-200 rounded-xl bg-white">
              {loading ? (
                <div className="text-center py-8">
                  <p>Сорилтуудыг ачааллаж байна...</p>
                </div>
              ) : filteredChallenges.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {activeTab === "Active"
                      ? "Идэвхтэй"
                      : activeTab === "Pending"
                        ? "Хүлээгдэж байгаа"
                        : "Биелэгдсэн"}{" "}
                    сорилт олдсонгүй.
                  </p>
                </div>
              ) : (
                <div>
                  {filteredChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className="rounded-lg py-2 bg-white"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-5">
                          <h3 className="font-medium text-base mb-5">
                            {challenge.title}
                          </h3>

                          <div className="flex gap-2">
                            {challenge.derivedStatus === "pending" && (
                              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                Хүлээгдэж байгаа
                              </span>
                            )}
                            {challenge.derivedStatus === "completed" && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Биелэгдсэн
                              </span>
                            )}
                            {challenge.derivedStatus === "active" && (
                              <span className="px-[10px] py-1 border border-gray-200 rounded-full text-xs font-medium">
                                {challenge.week || "1-р долоо хоног"}
                              </span>
                            )}
                            <span className="h-fit px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              {challenge.difficulty === "Easy"
                                ? "Хялбар"
                                : challenge.difficulty === "Medium"
                                  ? "Дунд"
                                  : challenge.difficulty === "Hard"
                                    ? "Хэцүү"
                                    : "Хялбар"}
                            </span>
                          </div>

                          <hr className="mt-10" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
        <div>
          <header className="h-fit header p-5 px-20 flex bg-white items-center border-b border-gray-200">
            <div>
              <h6 className="text-base font-medium">Профайл</h6>
              <p className="text-xs font-medium text-neutral-500">
                Өөрийн хувийн мэдээллээ харах, хянах боломжтой
              </p>
            </div>
          </header>

          <div className="bg-slate-100 py-10 px-20 min-h-screen space-y-5">
            <BuddyProfile />
            <BuddyInterests />
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