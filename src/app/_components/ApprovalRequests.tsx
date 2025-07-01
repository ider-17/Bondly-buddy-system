"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CircleCheckBig, CircleMinus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge"

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
                        `New approval request: "${item.challenges.title}" from ${item.users?.name || item.users?.email
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
        <div className="bg-white  rounded-xl ">
            <h6 className="text-xl py-5 px-6 font-semibold">Зөвшөөрөх хүсэлтүүд</h6>

            <hr />

            <div className="py-5 px-6">
                {requests.length === 0 && (
                    <p className="text-sm text-gray-500">Одоогоор хүсэлт ирээгүй байна.</p>
                )}

                {requests.map((submission) => (
                    <div
                        key={submission.id}
                        className="py-[10px] space-y-4 border-b border-neutral-200"
                    >
                        <div className="flex gap-3">
                            <div className="w-full">
                                <p className=" font-semibold">{submission.challenges?.title}</p>

                                <div className="flex gap-3 mt-2">
                                    <div className="rounded-full py-1 px-[10px] bg-white border text-xs font-semibold">
                                        {submission.challenges?.week}
                                    </div>
                                    <div className={`rounded-full py-1 px-[10px] ${submission.challenges?.difficulty === "Easy" && "bg-green-100 text-green-800"} ${submission.challenges?.difficulty === "Medium" && "bg-amber-100 text-amber-800"} ${submission.challenges?.difficulty === "Hard" && "bg-pink-100 text-pink-800"} text-xs font-medium`}>
                                        {submission.challenges?.difficulty === "Easy" && "Хялбар"}
                                        {submission.challenges?.difficulty === "Medium" && "Дундаж"}
                                        {submission.challenges?.difficulty === "Hard" && "Хэцүү"}
                                    </div>
                                </div>

                                {submission.note && (
                                    <p className="text-sm p-1 text-gray-700 mt-1 whitespace-pre-line">
                                        {submission.note}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleDecline(submission.id)}
                                className="w-1/2 border border-neutral-300 py-2 px-3 rounded-lg flex gap-2 items-center justify-center select-none bg-transparent text-black hover:bg-orange-100 active:bg-orange-500 active:text-white"
                            >
                                <p className="text-sm font-medium">Decline</p>
                            </button>

                            <button
                                onClick={() => handleApprove(submission.id)}
                                className="w-1/2 border border-green-500 py-2 px-3 rounded-lg flex gap-2 items-center justify-center hover:bg-green-200 active:bg-green-500 active:text-white select-none cursor-pointer text-black"
                            >
                                <p className="text-sm font-medium">Approve</p>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}
