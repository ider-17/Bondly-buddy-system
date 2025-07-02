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
    derivedStatus?: string;
}

// Individual challenge component
function ChallengeItem({
    challenge,
    onSubmit,
    showDivider,
}: {
    challenge: Challenge;
    onSubmit: (challengeId: string, note: string) => Promise<void>;
    showDivider: boolean;
}) {
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
        <div className="rounded-lg bg-white">
            <div className="flex justify-between items-start">
                <div className="flex-1 space-y-5">
                    <h3 className="font-medium text-base mb-5">
                        {challenge.title}
                    </h3>

                    <div className="flex gap-2">
                        <span className="px-[10px] py-1 border border-gray-200 rounded-full text-xs font-medium">
                            {challenge.week || "1-р долоо хоног"}
                        </span>
                        <span
                            className={`h-fit px-3 py-1 rounded-full text-xs font-medium ${challenge.difficulty === "Easy"
                                ? "bg-green-100 text-green-800"
                                : challenge.difficulty === "Medium"
                                    ? "bg-amber-100 text-amber-800"
                                    : challenge.difficulty === "Hard"
                                        ? "bg-pink-100 text-pink-800"
                                        : "bg-green-100 text-green-800"
                                }`}
                        >
                            {challenge.difficulty === "Easy"
                                ? "Хялбар"
                                : challenge.difficulty === "Medium"
                                    ? "Дундаж"
                                    : challenge.difficulty === "Hard"
                                        ? "Хэцүү"
                                        : "Хялбар"}
                        </span>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <button className="flex gap-2 border border-neutral-300 py-2 px-3 rounded-lg items-center w-fit cursor-pointer select-none hover:bg-gray-200 active:bg-black active:text-white bg-transparent">
                                Тэмдэглэл бичих
                                <FilePlus2 size={20} />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[445px] bg-white">
                            <DialogHeader>
                                <DialogTitle className="text-xl px-5 py-8">
                                    Тэмдэглэл бичих
                                </DialogTitle>
                                <hr />
                                <DialogDescription className="px-5 pt-5 text-[16px] text-black">
                                    Сорилтын тэмдэглэл
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit}>
                                <textarea
                                    name="note"
                                    placeholder="Ахиц дэвшлээ, тулгарсан сорилтууд болон сурсан зүйлсээ бичнэ үү..."
                                    className="w-100 bg-white border border-gray-200 py-2 px-3 mx-5 rounded-md mb-4 min-h-[100px]"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    required
                                />

                                <hr />

                                <div className="flex gap-[10px] justify-between p-5 py-9">
                                    <DialogClose asChild>
                                        <button
                                            type="button"
                                            className="w-1/2 py-1 px-4 flex justify-center items-center border border-neutral-300 rounded-md cursor-pointer text-black hover:bg-gray-200 active:bg-black active:text-white"
                                        >
                                            Cancel
                                        </button>
                                    </DialogClose>
                                    <button
                                        type="submit"
                                        className="w-1/2 border py-2 px-4 bg-black text-white flex justify-center items-center rounded-md cursor-pointer hover:bg-gray-800 active:bg-gray-200 active:text-black"
                                    >
                                        Submit for Approval
                                    </button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {showDivider && <hr className="mb-5" />}
                </div>
            </div>
        </div>
    );
}

export default function ActiveChallenges() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const getSession = async () => {
            const {
                data: { session },
                error,
            } = await supabase.auth.getSession();
            if (error || !session) {
                toast.error("User session not found");
                return;
            }
            setUserId(session.user.id);
        };
        getSession();
    }, []);

    const { challenges: allChallenges, loading, error } = useRealtimeUserChallenges(userId || "");

    const activeChallenges = allChallenges.filter(
        (challenge) => challenge.derivedStatus === "active"
    );

    const handleChallengeSubmit = async (challengeId: string, note: string) => {
        console.log("Submitting challenge:", { challengeId, note });

        try {
            const result = await submitChallenge({ challengeId, note });
            console.log("Submission result:", result);
            toast.success("Approval request sent!");
        } catch (error) {
            console.error("Submission error:", error);
            const errorMessage =
                error instanceof Error ? error.message : "Unknown error occurred";
            toast.error("Failed to submit: " + errorMessage);
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="pb-5 px-6 h-[400px] flex items-center justify-center">
                <p className="text-sm text-gray-500">Loading challenges...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pb-5 px-6 h-[380px] flex items-center justify-center">
                <p className="text-sm text-red-500">Error loading challenges: {error}</p>
            </div>
        );
    }

    return (
        <div className="pb-5 px-6 h-[380px] overflow-y-scroll">
            {activeChallenges.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Идэвхтэй сорилт олдсонгүй.</p>
                </div>
            )}

            {activeChallenges.length > 0 && (
                <div>
                    {activeChallenges.map((challenge, index) => (
                        <ChallengeItem
                            key={challenge.id}
                            challenge={challenge}
                            onSubmit={handleChallengeSubmit}
                            showDivider={index !== activeChallenges.length - 1} // 👉 Last item дээр divider render хийхгүй
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
