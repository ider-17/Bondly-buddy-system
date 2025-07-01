"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function BuddyInterests() {
    const [buddyInterests, setBuddyInterests] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBuddyInterests() {
            setLoading(true);

            try {
                // Fetch interests from all buddy-roled users
                const { data, error } = await supabase
                    .from("users")
                    .select("interests")
                    .eq("role", "buddy");

                if (error) {
                    console.error("Failed to fetch buddy interests:", error);
                } else if (data) {
                    // Combine all interests from all buddies into one array
                    const allInterests = data
                        .filter(buddy => buddy.interests && buddy.interests.length > 0)
                        .flatMap(buddy => buddy.interests);
                    
                    // Remove duplicates
                    const uniqueInterests = [...new Set(allInterests)];
                    setBuddyInterests(uniqueInterests);
                }
            } catch (error) {
                console.error("Error fetching buddy interests:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchBuddyInterests();

        // Set up real-time subscription for buddy changes
        const buddySubscription = supabase
            .channel("buddy_interests_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "users",
                    filter: "role=eq.buddy",
                },
                (payload) => {
                    fetchBuddyInterests();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(buddySubscription);
        };
    }, []);

    return (
        <div className="py-5 px-6 rounded-xl bg-white border border-gray-200 space-y-5">
            <h6 className="text-lg font-semibold">Buddy нарын сонирхлууд</h6>

            <hr />

            {loading ? (
                <p className="text-sm text-gray-500">Уншиж байна...</p>
            ) : buddyInterests.length > 0 ? (
                <div className="flex gap-3 flex-wrap">
                    {buddyInterests.map((interest, index) => (
                        <div
                            key={index}
                            className="rounded-full py-1 px-[10px] bg-gray-100 text-black h-fit text-sm font-medium"
                        >
                            {interest}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">Buddy нарын сонирхол бүртгэгдээгүй байна.</p>
            )}
        </div>
    );
}