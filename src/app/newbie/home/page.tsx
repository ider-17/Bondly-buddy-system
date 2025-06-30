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
  const [selectedSection, setSelectedSection] = useState("Home");
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedWeek, setSelectedWeek] = useState("all");
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [note, setNote] = useState("");

  // Fetch both challenges and submissions for the current user
  async function fetchData() {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      toast.error("User session not found");
      return;
    }

    const userId = session.user.id;

    // Fetch all challenges for the user
    const { data: challengesData, error: challengesError } = await supabase
      .from("challenges")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (challengesError) {
      toast.error("Failed to fetch challenges: " + challengesError.message);
      return;
    }

    // Fetch all submissions for the user
    const { data: submissionsData, error: submissionsError } = await supabase
      .from("submissions")
      .select("*")
      .eq("user_id", userId);

    if (submissionsError) {
      toast.error("Failed to fetch submissions: " + submissionsError.message);
      return;
    }

    setChallenges(challengesData ?? []);
    setSubmissions(submissionsData ?? []);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to determine if a challenge is active
  const isActiveChallenge = (challengeId: string) => {
    return !submissions.find((sub) => sub.challenge_id === challengeId);
  };

  // Get only active challenges (no submissions)
  const activeChallenges = challenges.filter((challenge) =>
    isActiveChallenge(challenge.id)
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedChallenge) return;

    try {
      await submitChallenge({ challengeId: selectedChallenge.id, note });
      toast.success("Approval request sent!");
      setNote("");
      setSelectedChallenge(null);
      fetchData(); // Refresh data
    } catch (error) {
      toast.error("Failed to submit: " + (error as Error).message);
    }
  }

  useEffect(() => {
    const fetchChallengesAndSubmissions = async () => {
      setLoading(true);

      // Get current user session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("User session not found");
        setLoading(false);
        return;
      }

      const userId = session.user.id;

      const { data: challengesData, error: challengesError } = await supabase
        .from("challenges")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (challengesError) {
        console.error("Failed to fetch challenges:", challengesError);
      } else {
        setChallenges(challengesData || []);
      }

      const { data: submissionsData, error: submissionsError } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", userId);

      if (submissionsError) {
        console.error("Failed to fetch submissions:", submissionsError);
      } else {
        setSubmissions(submissionsData || []);
      }

      setLoading(false);
    };

    fetchChallengesAndSubmissions();
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
    if (selectedSection === "Home") {
      return (
        <div>
          <header className="h-fit header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300">
            <div className="flex gap-3 items-center">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h6 className="text-base font-medium">Welcome Togtuun</h6>
                <p className="text-[#525252] font-medium text-sm">
                  UX/UI Designer • Design
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
      );
    } else if (selectedSection === "Challenges") {
      return (
        <div>
          <header className="h-fit header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300">
            <div>
              <h1 className="text-xl font-semibold">Сорилтууд</h1>
              <p className="text-sm font-medium text-neutral-600">
                Идэвхтэй, хүлээгдэж байгаа болон биелэгдсэн сорилтуудаа хянах
                боломжтой
              </p>
            </div>
          </header>

          <div className="w-full flex gap-5 p-5 pb-0 pr-15">
            {[
              {
                name: "Идэвхтэй",
                count: statusCounts.active,
                color: "text-blue-700",
                key: "Active",
              },
              {
                name: "Хүлээгдэж байгаа",
                count: statusCounts.pending,
                color: "text-yellow-700",
                key: "Pending",
              },
              {
                name: "Биелэгдсэн",
                count: statusCounts.completed,
                color: "text-green-700",
                key: "Completed",
              },
            ].map((status, idx) => (
              <div
                key={idx}
                onClick={() => setActiveTab(status.key)}
                className={`w-1/3 bg-slate-50 border border-neutral-300 rounded-xl py-5 flex flex-col gap-2 items-center cursor-pointer hover:bg-slate-100 transition-colors ${activeTab === status.key
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : ""
                  }`}
              >
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex justify-center items-center">
                  <Mountain size={18} color="#F97316" />
                </div>
                <div className="flex flex-col items-center text-center">
                  <p className={`text-lg font-bold ${status.color}`}>
                    {status.count}
                  </p>
                  <p className="text-sm text-neutral-600">{status.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Filter dropdown only */}
          <div className="flex justify-end items-center p-5 pr-15">
            <Select value={selectedWeek} onValueChange={setSelectedWeek}>
              <SelectTrigger className="w-[160px] py-5 shadow-sm rounded-lg text-sm">
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
          <div className="p-5 mr-10">
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
              <div className="space-y-4">
                {filteredChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="border border-neutral-300 rounded-lg p-4 bg-white"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-base mb-3">
                          {challenge.title}
                        </h3>
                        <div className="flex gap-2 mb-3">
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
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {challenge.difficulty === "Easy"
                              ? "Хялбар"
                              : challenge.difficulty === "Medium"
                                ? "Дунд"
                                : challenge.difficulty === "Hard"
                                  ? "Хэцүү"
                                  : "Хялбар"}
                          </span>
                          {challenge.derivedStatus == "active" && (
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                              {challenge.week || "1-р долоо хоног"}
                            </span>
                          )}
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
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } else if (selectedSection === "Advice") {
      return (
        <div>
          <header className="h-fit header p-5 pr-20 flex justify-between bg-white items-center border-b border-neutral-300">
            <div>
              <h1 className="text-xl font-semibold">Зөвлөмж</h1>
              <p className="text-sm font-medium text-neutral-600">
                Туршлага дээр суурилсан зөвлөмжүүдийг уншаарай
              </p>
            </div>
          </header>

          <div className="py-3 px-20 bg-slate-100">
            <AdviceContent />
          </div>
        </div>
      );
    } else if (selectedSection === "Profile") {
      return (
        <div>
          <header className="h-fit header p-5 pr-20 flex justify-between bg-slate-50 items-center border-b border-neutral-300">
            <div>
              <h1 className="text-xl font-semibold">Profile</h1>
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
      <div className="w-full pl-[264px] flex flex-col h-screen overflow-auto">
        {renderHeader()}
      </div>
    </div>
  );
}
