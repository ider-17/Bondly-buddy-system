"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SideBarMenu from "@/app/_components/SideBarHome";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Mountain, SquarePen, FilePlus2 } from "lucide-react";
import RotatingBuddyCard from "@/app/_components/RotatingBuddyCard";
import EventsThisWeek from "@/app/_components/EventsThisWeak";
import YourProgress from "@/app/_components/YourProgress";
import ActiveChallenges from "@/app/_components/ActiveChallenges";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProfileCard from "@/app/_components/ProfileCard";
import MyInterests from "@/app/_components/MyInterests";
import CareerGoals from "@/app/_components/CareerGoals";
import ProfileInfo from "@/app/_components/ProfileInfo";
import YourPrimaryBuddy from "@/app/_components/YourPrimaryBuddy";
import Introduction from "@/app/_components/Introduction";
import Interests from "@/app/_components/Interests";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AdviceContent } from "@/app/_components/AdviceContent";
import { submitChallenge } from "@/lib/actions/submitChallenge";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Challenge {
  id: string;
  title: string;
  week: string;
  difficulty: "Easy" | "Medium" | "Hard";
  note: string | null;
  status: string | null;
  user_id: string;
  created_at: string;
}

interface Submission {
  id: string;
  challenge_id: string;
  user_id: string;
  note: string;
  status: string;
  submitted_at: string;
}

export default function NewbieHome() {
  const [selectedSection, setSelectedSection] = useState("Нүүр");
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedWeek, setSelectedWeek] = useState("all");
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [note, setNote] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  // Initialize user session and set up real-time subscriptions
  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        toast.error("User session not found");
        return;
      }

      const currentUserId = session.user.id;
      setUserId(currentUserId);

      // Initial data fetch
      await fetchInitialData(currentUserId);

      // Set up real-time subscriptions
      setupRealtimeSubscriptions(currentUserId);
    };

    initializeAuth();

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  // Fetch initial data
  const fetchInitialData = async (currentUserId: string) => {
    setLoading(true);

    try {
      // Fetch challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from("challenges")
        .select("*")
        .eq("user_id", currentUserId)
        .order("created_at", { ascending: false });

      if (challengesError) {
        toast.error("Failed to fetch challenges: " + challengesError.message);
      } else {
        setChallenges(challengesData || []);
      }

      // Fetch submissions
      const { data: submissionsData, error: submissionsError } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", currentUserId);

      if (submissionsError) {
        toast.error("Failed to fetch submissions: " + submissionsError.message);
      } else {
        setSubmissions(submissionsData || []);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set up real-time subscriptions
  const setupRealtimeSubscriptions = (currentUserId: string) => {
    // Subscribe to challenges table changes
    const challengesChannel = supabase
      .channel('challenges-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'challenges',
          filter: `user_id=eq.${currentUserId}`
        }, 
        (payload) => {
          console.log('Challenge change received:', payload);
          handleChallengeChange(payload);
        }
      )
      .subscribe();

    // Subscribe to submissions table changes
    const submissionsChannel = supabase
      .channel('submissions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'submissions',
          filter: `user_id=eq.${currentUserId}`
        }, 
        (payload) => {
          console.log('Submission change received:', payload);
          handleSubmissionChange(payload);
        }
      )
      .subscribe();

    // Optional: Listen for connection status
    challengesChannel.on('system', {}, (status) => {
      console.log('Challenges channel status:', status);
    });

    submissionsChannel.on('system', {}, (status) => {
      console.log('Submissions channel status:', status);
    });
  };

  // Handle real-time challenge changes
  const handleChallengeChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        setChallenges(prev => [newRecord, ...prev]);
        toast.success("New challenge added!");
        break;
      
      case 'UPDATE':
        setChallenges(prev => 
          prev.map(challenge => 
            challenge.id === newRecord.id ? newRecord : challenge
          )
        );
        toast.info("Challenge updated!");
        break;
      
      case 'DELETE':
        setChallenges(prev => 
          prev.filter(challenge => challenge.id !== oldRecord.id)
        );
        toast.info("Challenge removed!");
        break;
    }
  };

  // Handle real-time submission changes
  const handleSubmissionChange = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    switch (eventType) {
      case 'INSERT':
        setSubmissions(prev => [...prev, newRecord]);
        toast.success("Submission created!");
        break;
      
      case 'UPDATE':
        setSubmissions(prev => 
          prev.map(submission => 
            submission.id === newRecord.id ? newRecord : submission
          )
        );
        if (newRecord.status === 'approved') {
          toast.success("Challenge approved! 🎉");
        } else if (newRecord.status === 'rejected') {
          toast.error("Challenge was rejected. Please try again.");
        }
        break;
      
      case 'DELETE':
        setSubmissions(prev => 
          prev.filter(submission => submission.id !== oldRecord.id)
        );
        toast.info("Submission removed!");
        break;
    }
  };

  // Enhanced submit function with optimistic updates
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedChallenge || !userId) return;

    // Optimistic update - immediately show pending status
    const optimisticSubmission: Submission = {
      id: `temp-${Date.now()}`,
      challenge_id: selectedChallenge.id,
      user_id: userId,
      note,
      status: 'pending',
      submitted_at: new Date().toISOString(),
    };

    setSubmissions(prev => [...prev, optimisticSubmission]);
    toast.info("Submitting...");

    try {
      await submitChallenge({ challengeId: selectedChallenge.id, note });
      // The real-time subscription will handle the actual update
      setNote("");
      setSelectedChallenge(null);
    } catch (error) {
      // Revert optimistic update on error
      setSubmissions(prev => 
        prev.filter(sub => sub.id !== optimisticSubmission.id)
      );
      toast.error("Failed to submit: " + (error as Error).message);
    }
  }

  // Helper function to determine if a challenge is active
  const isActiveChallenge = (challengeId: string) => {
    return !submissions.find((sub) => sub.challenge_id === challengeId);
  };

  // Get only active challenges (no submissions)
  const activeChallenges = challenges.filter((challenge) =>
    isActiveChallenge(challenge.id)
  );

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

    // Then filter by week if specific week is selected
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

  const renderHeader = () => {
    if (selectedSection === "Нүүр") {
      return (
        <div>
          <header className="h-fit header p-5 px-20 flex justify-between bg-white items-center border-b border-gray-200">
            <div className="flex gap-3 items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h6 className="text-base font-medium">Сайн уу👋 Тогтуун</h6>
                <p className="text-neutral-500 font-medium text-sm">
                  UX/UI Designer
                </p>
              </div>
            </div>
            <div>
              <Popover>
                <PopoverTrigger>
                  <Bell className="cursor-pointer" size={18} />
                </PopoverTrigger>
                <PopoverContent>Notifications</PopoverContent>
              </Popover>
            </div>
          </header>

          <div className="flex gap-5 py-10 px-20 bg-slate-100">
            <div className="w-1/2 space-y-5">
              <RotatingBuddyCard />

              <div className="rounded-lg border border-gray-200 py-5 px-6 space-y-5 bg-white">
                <div className="flex items-center">
                  <h6 className="text-lg font-medium">Идэвхтэй сорилтууд</h6>
                </div>
                <ActiveChallenges />
              </div>

            </div>
            <div className="w-1/2 space-y-5">

              <div className='rounded-lg border border-gray-200 py-5 px-6 space-y-5 bg-white'>
                <div>
                  <h6 className='text-lg font-medium mb-5'>Таны прогресс</h6>

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

            {/* Filter dropdown only */}
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

            {/* Challenge List with loading state */}
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
                      className="rounded-lg py-5 bg-white"
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
                            {challenge.derivedStatus == "active" && (
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
                          {/* {challenge.note && (
                          <p className="text-gray-700 text-sm mb-3">
                            {challenge.note}
                          </p>
                        )} */}
                          {challenge.derivedStatus === "active" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  className="flex gap-2 border border-neutral-300 py-2 px-3 bg-white rounded-lg items-center w-fit cursor-pointer select-none hover:bg-sky-100 active:bg-black active:text-white"
                                  onClick={() => {
                                    setSelectedChallenge(challenge);
                                    setNote(challenge.note ?? "");
                                  }}
                                >
                                  Тэмдэглэл бичих
                                  <FilePlus2 size={20} />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[445px]">
                                <DialogHeader>
                                  <DialogTitle className="my-3 text-xl">
                                    Тэмдэглэл бичих
                                  </DialogTitle>
                                  <hr className="py-3"></hr>
                                  <DialogDescription className="text-[16px] text-black">
                                    Сорилтын тэмдэглэл
                                  </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit}>
                                  <textarea
                                    name="note"
                                    placeholder="Ахиц дэвшлээ, тулгарсан сорилтууд болон сурсан зүйлсээ бичнэ үү..."
                                    className="w-full border border-neutral-300 bg-white py-2 px-3 rounded-md mb-4 min-h-[100px]"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    required
                                  />

                                  <hr className="py-3"></hr>

                                  <div className="flex gap-[10px] justify-between">
                                    <DialogClose asChild>
                                      <button
                                        type="button"
                                        className="w-1/2 py-1 px-4 flex justify-center items-center border border-neutral-300 rounded-md cursor-pointer text-black hover:bg-sky-100 active:bg-black active:text-white"
                                      >
                                        Cancel
                                      </button>
                                    </DialogClose>
                                    <button
                                      type="submit"
                                      className="w-1/2 border py-2 px-4 bg-black text-white flex justify-center items-center rounded-md cursor-pointer hover:bg-gray-800 active:bg-sky-100 active:text-black"
                                    >
                                      Submit for Approval
                                    </button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          )}

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
          </header>

          <div className="py-3 px-20 bg-slate-100 min-h-screen">
            <AdviceContent />
          </div>
        </div>
      );
    } else if (selectedSection === "Profile") {
      return (
        <div>
          <header className="h-fit header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300">
            <div>
              <h1 className="text-base font-medium">Profile</h1>
              <p className="text-sm font-medium text-neutral-600">
                Өөрийн хувийн мэдээллээ харах, удирдах боломжтой.
              </p>
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