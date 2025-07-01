"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function MyInterests() {
    const [interests, setInterests] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInterests() {
            setLoading(true);

            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error("User fetch error", userError);
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("users")
                .select("interests")
                .eq("id", user.id)
                .single();

            if (error) {
                console.error("Failed to fetch interests:", error);
            } else if (data?.interests) {
                setInterests(data.interests);
            }

            setLoading(false);
        }

        fetchInterests();
    }, []);

    return (
        <div className="py-5 px-6 rounded-xl bg-white border border-gray-200 space-y-5">
            <h6 className="text-lg font-semibold">Миний сонирхлууд</h6>

            <hr />

            {loading ? (
                <p className="text-sm text-gray-500">Уншиж байна...</p>
            ) : interests.length > 0 ? (
                <div className="flex gap-3 flex-wrap">
                    {interests.map((interest, index) => (
                        <div
                            key={index}
                            className="rounded-full py-1 px-[10px] bg-gray-100 h-fit text-sm"
                        >
                            {interest}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500">Сонирхол бүртгэгдээгүй байна.</p>
            )}
        </div>
    );
}
