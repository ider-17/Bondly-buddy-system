"use client";

import { Progress } from "@/components/ui/progress";
import { CircleAlert, TrendingUp } from "lucide-react";
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
    <>
      <div>
        <div className="flex mb-3 gap-2 items-center">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex justify-center items-center">
            <TrendingUp size={30} color="green" />
          </div>
          <p className="text-xl font-semibold">{approvedChallengesLength}%</p>
        </div>
        <Progress value={approvedChallengesLength} className="h-2 mt-5" />
        <p className="text-l flex gap-3 mt-5"> <CircleAlert /> Таны onboarding прогресс</p>
      </div>

      {/* <div className='w-full flex gap-5 justify-between'>
                <div className='w-1/3 bg-white rounded-xl py-5 px-4 flex flex-col gap-2 shadow-sm border border-gray-100'>
                    <div className='w-8 h-8 bg-blue-100 rounded-lg flex justify-center items-center'>
                        <CalendarCheck size={18} color='#2563EB' />
                    </div>

                    <div className='flex flex-col justify-center'>
                        <p className="text-base font-bold text-gray-900">{activeDays}</p>
                        <p className="text-sm font-medium text-gray-600">Идэвхтэй <br/>
                            өдрүүд</p>
                    </div>
                </div>

                <div className='w-1/3 bg-white rounded-xl py-5 px-4 flex flex-col gap-2 shadow-sm border border-gray-100'>
                    <div className='w-8 h-8 bg-amber-100 rounded-lg flex justify-center items-center'>
                        <Mountain size={18} color='#D97706' />
                    </div>

                    <div className='flex flex-col justify-center'>
                        <p className="text-base font-bold text-gray-900">{completedChallenges}</p>
                        <p className="text-sm font-medium text-gray-600">Биелүүлсэн <br/>
                            сорилтууд</p>
                    </div>
                </div>

                <div className='w-1/3 bg-white rounded-xl py-5 px-4 flex flex-col gap-2 shadow-sm border border-gray-100'>
                    <div className='w-8 h-8 bg-violet-100 rounded-lg flex justify-center items-center'>
                        <Lightbulb size={18} color='#7C3AED' />
                    </div>

                    <div className='flex flex-col justify-center'>
                        <p className="text-base font-bold text-gray-900">{readTips}</p>
                        <p className="text-sm font-medium text-gray-600">Уншсан <br/>
                            зөвлөмжүүд</p>
                    </div>
                </div>
            </div> */}
    </>
  );
}