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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AdviceContent } from "@/app/_components/AdviceContent";
import { submitChallenge } from "@/lib/actions/submitChallenge";
import { toast } from "sonner";
import MoreInformation from "@/app/_components/MoreInformation";
import MyInterests from "@/app/_components/MyInterests";
import CareerGoals from "@/app/_components/CareerGoals";
import BuddyProfile from "@/app/_components/BuddyProfile";
import Home from "./_components/HomePage";
import Challenges from "./_components/ChallengePage";
import Advice from "./_components/AdvicePage";
import Profile from "./_components/ProfilePage";
import YourPrimaryBuddy from "./_components/YourBuddyPage";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Challenge {
  id: string;
  title: string;
  week: string;
  difficulty: "Easy" | "Medium" | "Hard";
  note: string | null;
  status: string | null;
  user_id: string;
  created_at: string;
}

export interface Submission {
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
  const [headerLoading, setHeaderLoading] = useState(true);

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
  switch (selectedSection) {
    case "Нүүр":
      return <Home />;
    case "Сорилтууд":
      return (
        <Challenges 
          challenges={challenges}
          submissions={submissions}
          loading={loading}
          onSubmit={async (challengeId: string, note: string) => {
            await submitChallenge({ challengeId, note });
          }}
        />
      );
    case "Зөвлөмжүүд":
      return <Advice />;
    case "Profile":
      return <Profile />;
    case "Primary Buddy":
      return <YourPrimaryBuddy />;
    default:
      return <Home />;
  }
};

  return (
    <div className="w-full h-screen bg-white flex">
      <SideBarMenu
        selectedSection={selectedSection}
        onSelectSection={(section) => setSelectedSection(section)}
      />
      <div className="w-full pl-[312px] flex flex-col max-h-screen overflow-hidden">
        {renderHeader()}
      </div>
    </div>
  );
}