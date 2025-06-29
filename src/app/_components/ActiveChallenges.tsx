"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowRight, FilePlus2, Mountain } from "lucide-react";
import { submitChallenge } from "@/lib/actions/submitChallenge";
import { toast } from "sonner";

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

export default function ActiveChallenges() {
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

  return (
    <div className="Events rounded-xl border border-neutral-300 py-5 px-6 space-y-7">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center">
            <Mountain size={18} color="#22C55E" />
          </div>
          <h6 className="text-lg font-semibold">Active Challenges</h6>
        </div>
        <div className="border border-neutral-300 bg-white rounded-lg py-2 px-3 flex items-center gap-2">
          <p>View all</p>
          <ArrowRight size={18} color="black" />
        </div>
      </div>

      {activeChallenges.length === 0 && (
        <p className="text-sm text-gray-500">
          No active challenges found. All challenges have been submitted or
          completed.
        </p>
      )}

      {activeChallenges.map((challenge) => (
        <div
          key={challenge.id}
          className="py-[10px] space-y-4 border-t border-neutral-300"
        >
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Mountain size={18} color="#22C55E" />
            </div>
            <p className="text-sm font-medium">{challenge.title}</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full py-1 px-[10px] bg-gray-100 text-xs font-semibold">
              {challenge.week}
            </div>
            <div className="rounded-full py-1 px-[10px] bg-green-200 text-green-700 text-xs font-semibold">
              {challenge.difficulty}
            </div>
            <div className="rounded-full py-1 px-[10px] bg-blue-200 text-blue-700 text-xs font-semibold">
              ACTIVE
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <button
                className="flex gap-2 border border-neutral-300 py-2 px-3 bg-white rounded-lg items-center w-fit cursor-pointer select-none hover:bg-sky-100 active:bg-black active:text-white"
                onClick={() => {
                  setSelectedChallenge(challenge);
                  setNote(challenge.note ?? "");
                }}
              >
                Submit Challenge
                <FilePlus2 size={20} />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[445px]">
              <DialogHeader>
                <DialogTitle>
                  Submit Challenge: "{selectedChallenge?.title}"
                </DialogTitle>
                <DialogDescription>
                  Describe your progress, challenges faced, and what you've
                  learned. This will be sent to your buddy for approval.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit}>
                <textarea
                  name="note"
                  placeholder="Describe your progress, what you learned, and any challenges you faced..."
                  className="w-full border border-neutral-300 bg-white py-2 px-3 rounded-md mb-4 min-h-[100px]"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  required
                />

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
        </div>
      ))}
    </div>
  );
}
