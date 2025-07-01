"use client";

import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function YourProgress() {
  const [approvedChallengesLength, setApprovedChallengesLength] =
    useState<number>(0);
  const [activeDays, setActiveDays] = useState<number>(0);
  const [completedChallenges, setCompletedChallenges] = useState<number>(0);
  const [readTips, setReadTips] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProgressData = async () => {
    try {
      setLoading(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("User session not found");
        return;
      }

      const userId = session.user.id;

      const [
        { count: approvedCount, error: approvedError },
        { count: totalCount, error: totalError },
      ] = await Promise.all([
        supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved")
          .eq("user_id", userId),
        supabase
          .from("challenges")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId),
      ]);

      if (approvedError || totalError) {
        console.error(
          "Error fetching challenges data:",
          approvedError || totalError
        );
      } else {
        if (approvedCount !== null && totalCount !== null && totalCount > 0) {
          const percentage = (approvedCount / totalCount) * 100;
          setApprovedChallengesLength(parseFloat(percentage.toFixed(1)));
          setCompletedChallenges(approvedCount);
        } else {
          setApprovedChallengesLength(0);
          setCompletedChallenges(approvedCount || 0);
        }
      }

      const { count: activeDaysCount, error: activeDaysError } = await supabase
        .from("user_activity")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (activeDaysError) {
        console.error("Error fetching active days:", activeDaysError);
      } else {
        setActiveDays(activeDaysCount || 0);
      }

      const { count: readTipsCount, error: readTipsError } = await supabase
        .from("read_tips")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      if (readTipsError) {
        console.error("Error fetching read tips:", readTipsError);
      } else {
        setReadTips(readTipsCount || 0);
      }
    } catch (error) {
      console.error("Error in fetchProgressData:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();

    const readTipsSubscription = supabase
      .channel("read_tips_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "read_tips",
        },
        (payload) => {
          fetchProgressData();
        }
      )
      .subscribe();

    const activitySubscription = supabase
      .channel("activity_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_activity",
        },
        (payload) => {
          fetchProgressData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(readTipsSubscription);
      supabase.removeChannel(activitySubscription);
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-5 animate-pulse">
        <div className="flex mb-3 gap-3 items-center">
          <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="h-2 bg-gray-200 rounded mt-5"></div>
        <div className="h-5 bg-gray-200 rounded w-20 mt-5"></div>
      </div>
    );
  }

  return (
    <div className="py-5 px-6">
      <div>
        <div className="flex mb-3 gap-3 items-center">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center">
            <TrendingUp size={18} color="green" />
          </div>
          <p className="text-sm font-medium">{approvedChallengesLength}%</p>
        </div>
        <Progress value={approvedChallengesLength} className="h-2 mt-5" />
        <p className="text-l font-medium py-5">Сорилтууд</p>
      </div>

      <div className="w-full border border-gray-200 p-3 rounded-lg bg-white space-y-3">
        <h5 className="text-sm font-semibold">Сорилт 1</h5>

        <div className="overflow-scroll h-[60px]">
          <div>
            <h6 className="text-sm font-medium mb-2">Өөрийгөө багтаа танилцуулаарай😊</h6>
            <div className="flex gap-3 [&>*]:rounded-full [&>*]:py-1 [&>*]:px-[10px] [&>*]:h-fit">
              <div className="border border-gray-200 text-xs">1-р долоо хоног</div>
              <div className="text-green-800 bg-green-100 text-xs font-medium">Хялбар</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}