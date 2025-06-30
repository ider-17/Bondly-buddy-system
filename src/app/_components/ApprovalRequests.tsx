"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CircleCheckBig, CircleMinus, SquareCheckBig } from "lucide-react";
import { toast } from "sonner";

interface SubmissionWithChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  note: string;
  status: string;
  submitted_at: string;
  challenges: {
    id: string;
    title: string;
    week: string;
    difficulty: "Easy" | "Medium" | "Hard";
    user_id: string;
  };
  users: {
    name: string;
    email: string;
  };
}

export default function ApprovalRequests() {
  const [requests, setRequests] = useState<SubmissionWithChallenge[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  async function fetchApprovalRequests() {
    // Fetch pending submissions with challenge and user details
    const { data, error } = await supabase
      .from("submissions")
      .select(
        `
        *,
        challenges!submissions_challenge_id_fkey (
          id,
          title,
          week,
          difficulty,
          user_id
        ),
        users!submissions_user_id_fkey (
          name,
          email
        )
      `
      )
      .eq("status", "pending")
      .order("submitted_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch approval requests: " + error.message);
      console.error("Fetch error:", error);
    } else {
      const submissions = data ?? [];

      // Check for new requests and show notifications
      const newOnes = submissions.filter((item) => !seenIds.has(item.id));

      newOnes.forEach((item) => {
        if (item.challenges) {
          toast.success(
            `New approval request: "${item.challenges.title}" from ${
              item.users?.name || item.users?.email
            }`
          );
          setSeenIds((prev) => new Set([...prev, item.id]));
        }
      });

      setRequests(submissions);
    }
  }

  useEffect(() => {
    fetchApprovalRequests();
    const interval = setInterval(fetchApprovalRequests, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  async function handleApprove(submissionId: string) {
    const { error } = await supabase
      .from("submissions")
      .update({ status: "approved" })
      .eq("id", submissionId);

    if (error) {
      toast.error("Failed to approve submission: " + error.message);
    } else {
      toast.success("Challenge approved!");
      fetchApprovalRequests();
    }
  }

  async function handleDecline(submissionId: string) {
    // Delete the submission (challenge goes back to active)
    const { error } = await supabase
      .from("submissions")
      .delete()
      .eq("id", submissionId);

    if (error) {
      toast.error("Failed to decline submission: " + error.message);
    } else {
      toast.success("Submission declined - challenge is now active again!");
      fetchApprovalRequests();
    }
  }

  return (
    <div className="bg-white py-5 px-6 rounded-xl border border-[#D4D4D4] space-y-4">
      <div className="flex gap-3 ">
        <h6 className="text-lg font-semibold">Зөвшөөрөх хүсэлтүүд</h6>
      </div>

      <hr />

      {requests.length === 0 && (
        <p className="text-sm text-gray-500">No pending submissions.</p>
      )}

      {requests.map((submission) => (
        <div
          key={submission.id}
          className="py-[10px] space-y-4 border-b border-neutral-200"
        >
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center">
              <SquareCheckBig size={20} color="#22C55E" />
            </div>
            <div>
              <p className="font-medium">{submission.challenges?.title}</p>
              <p className="text-xs text-gray-500 mb-2">
                Submitted by:{" "}
                {submission.users?.name || submission.users?.email}
              </p>
              {submission.note && (
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                  {submission.note}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <div className="rounded-full py-1 px-[10px] bg-gray-100 text-xs font-semibold">
              {submission.challenges?.week}
            </div>
            <div className="rounded-full py-1 px-[10px] bg-blue-200 text-blue-700 text-xs font-semibold">
              {new Date(submission.submitted_at).toLocaleDateString()}
            </div>
            <div className="rounded-full py-1 px-[10px] bg-green-200 text-green-700 text-xs font-semibold">
              {submission.challenges?.difficulty}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleDecline(submission.id)}
              className="w-1/2 border border-neutral-300 py-2 px-3 rounded-lg flex gap-2 items-center justify-center select-none bg-transparent text-black hover:bg-orange-100 active:bg-orange-500 active:text-white"
            >
              <p className="text-sm font-medium">Decline</p>
              <CircleMinus size={22} />
            </button>

            <button
              onClick={() => handleApprove(submission.id)}
              className="w-1/2 border border-neutral-300 py-2 px-3 rounded-lg flex gap-2 items-center justify-center bg-green-100 hover:bg-green-200 active:bg-green-500 active:text-white select-none cursor-pointer text-black"
            >
              <p className="text-sm font-medium">Approve</p>
              <CircleCheckBig size={22} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
