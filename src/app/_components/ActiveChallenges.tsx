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
import { FilePlus2 } from "lucide-react";
import { submitChallenge, useRealtimeUserChallenges } from "@/lib/actions/submitChallenge";
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

// Individual challenge component to handle its own dialog state
function ChallengeItem({ challenge, onSubmit }: { challenge: Challenge; onSubmit: (challengeId: string, note: string) => Promise<void> }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [note, setNote] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!note?.trim()) {
            toast.error("Please enter a note");
            return;
        }

        try {
            await onSubmit(challenge.id, note.trim());
            setNote("");
            setIsDialogOpen(false);
        } catch (error) {
            // Error handling is done in parent component
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (open) {
            setNote(challenge.note ?? "");
        } else {
            setNote("");
        }
    };

    return (
        <div className="space-y-5">
            <p className="text-sm font-medium mb-4 mt-5">{challenge.title}</p>
            <div className="flex gap-3 mb-4">
                <div className="rounded-full py-1 px-[10px] text-xs border border-gray-200 font-semibold">
                    {challenge.week}
                </div>
                <div className={`rounded-full py-1 px-[10px] ${
                    challenge.difficulty === "Easy" && "bg-green-100 text-green-800"
                } ${
                    challenge.difficulty === "Medium" && "bg-amber-100 text-amber-800"
                } ${
                    challenge.difficulty === "Hard" && "bg-pink-100 text-pink-800"
                } text-xs font-medium`}>
                    {challenge.difficulty === "Easy" && "Хялбар"}
                    {challenge.difficulty === "Medium" && "Дундаж"}
                    {challenge.difficulty === "Hard" && "Хэцүү"}
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <button className="flex gap-2 border border-gray-200 py-2 px-3 bg-white rounded-lg items-center w-fit cursor-pointer select-none hover:bg-sky-100 active:bg-black active:text-white">
                        Тэмдэглэл бичих
                        <FilePlus2 size={20} />
                    </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] p-6">
                    <DialogHeader className="space-y-3 pb-4">
                        <DialogTitle className="text-lg font-semibold text-left">
                            Тэмдэглэл бичих
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Сорилтын тэмдэглэл
                            </label>
                            <textarea
                                name="note"
                                placeholder="Ахиц дэвшээ, тулгарсан сорилууд болон сурсан зүйлсээ бичнэ үү..."
                                className="w-full border border-gray-300 bg-white py-3 px-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <DialogClose asChild>
                                <button
                                    type="button"
                                    className="flex-1 py-2.5 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                            </DialogClose>
                            <button
                                type="submit"
                                className="flex-1 py-2.5 px-4 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                            >
                                Request Approval
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function ActiveChallenges() {
    const [userId, setUserId] = useState<string | null>(null);

    // Get user session
    useEffect(() => {
        const getSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                toast.error("User session not found");
                return;
            }
            setUserId(session.user.id);
        };
        getSession();
    }, []);

    // Use the real-time hook for challenges
    const { challenges: allChallenges, loading, error } = useRealtimeUserChallenges(userId || '');

    // Filter for active challenges (no submission or submission not approved)
    const activeChallenges = allChallenges.filter(challenge => 
        challenge.derivedStatus === 'active'
    );

    // Handle submission
    const handleChallengeSubmit = async (challengeId: string, note: string) => {
        console.log("Submitting challenge:", { challengeId, note });

        try {
            const result = await submitChallenge({ challengeId, note });
            console.log("Submission result:", result);
            toast.success("Approval request sent!");
        } catch (error) {
            console.error("Submission error:", error);
            const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
            toast.error("Failed to submit: " + errorMessage);
            throw error; // Re-throw to prevent dialog from closing
        }
    };

    // Show loading state
    if (loading) {
        return (
            <div className="pb-5 px-6 h-[400px] flex items-center justify-center">
                <p className="text-sm text-gray-500">Loading challenges...</p>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="pb-5 px-6 h-[400px] flex items-center justify-center">
                <p className="text-sm text-red-500">Error loading challenges: {error}</p>
            </div>
        );
    }

    return (
        <div className="pb-5 px-6 h-[400px] overflow-y-scroll">
            {activeChallenges.length === 0 && (
                <p className="text-sm text-gray-500">
                    Идэвхтэй сорилт олдсонгүй.
                </p>
            )}

            {activeChallenges.map((challenge, index) => (
                <div key={challenge.id}>
                    <ChallengeItem 
                        challenge={challenge} 
                        onSubmit={handleChallengeSubmit}
                    />
                    {index !== activeChallenges.length - 1 && <hr />}
                </div>
            ))}
        </div>
    );
}