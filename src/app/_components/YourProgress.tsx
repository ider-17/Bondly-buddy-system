"use client";

import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

interface ApprovedSubmission {
  id: string;
  challenge_title?: string;
  challenge_description?: string;
  submitted_at?: string;
  status: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  week?: string;
}

export default function YourProgress() {
  const [approvedChallengesLength, setApprovedChallengesLength] =
    useState<number>(0);
  const [activeDays, setActiveDays] = useState<number>(0);
  const [completedChallenges, setCompletedChallenges] = useState<number>(0);
  const [readTips, setReadTips] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>("");
  const [approvedSubmissions, setApprovedSubmissions] = useState<
    ApprovedSubmission[]
  >([]);

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

      // Fetch user role
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single();

      if (userError) {
        console.error("Error fetching user role:", userError);
      } else if (userData) {
        setUserRole(userData.role || "");
      }

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

      // Fetch approved submissions details only for newbies
      if (userData?.role !== "buddy") {
        const { data: submissionsData, error: submissionsError } =
          await supabase
            .from("submissions")
            .select(
              `
            id,
            challenge_id,
            submitted_at,
            status,
            note
          `
            )
            .eq("status", "approved")
            .eq("user_id", userId)
            .order("submitted_at", { ascending: false });

        if (submissionsError) {
          console.error(
            "Error fetching approved submissions:",
            submissionsError
          );
        } else if (submissionsData) {
          // Fetch challenge details for each submission
          const challengeIds = submissionsData.map((sub) => sub.challenge_id);
          const { data: challengesData, error: challengesError } =
            await supabase
              .from("challenges")
              .select("id, title, note, difficulty, week")
              .in("id", challengeIds);

          if (challengesError) {
            console.error("Error fetching challenges data:", challengesError);
          }

          const mappedSubmissions: ApprovedSubmission[] = submissionsData.map(
            (submission: any) => {
              const challenge = challengesData?.find(
                (ch) => ch.id === submission.challenge_id
              );
              return {
                id: submission.id,
                challenge_title: challenge?.title || "Unknown Challenge",
                challenge_description: challenge?.note || submission.note || "",
                submitted_at: submission.submitted_at,
                status: submission.status,
                difficulty: challenge?.difficulty || "Easy",
                week: challenge?.week || "1-р долоо хоног",
              };
            }
          );
          setApprovedSubmissions(mappedSubmissions);
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

  // Format date helper function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}/${month}/${day}`;
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

    // Add subscription for submissions changes (only for newbies)
    const submissionsSubscription = supabase
      .channel("submissions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submissions",
        },
        (payload) => {
          fetchProgressData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(readTipsSubscription);
      supabase.removeChannel(activitySubscription);
      supabase.removeChannel(submissionsSubscription);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-3 bg-white rounded-xl border border-gray-200 py-5 px-6">
        {/* Header with icon and percentage */}
        <div className="flex gap-2 items-center">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <Skeleton className="h-5 w-12" />
        </div>

        {/* Progress bar */}
        <Skeleton className="h-2 w-full" />

        {/* Info section */}
        <div className="flex gap-3 items-center">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-4 w-40" />
        </div>

        {/* Challenges section */}
        <div className="h-[120px] space-y-3">
          <Skeleton className="h-4 w-20" />

          {/* Mock challenge cards */}
          <div className="space-y-3">
            {[1].map((i) => (
              <div key={i} className="w-full border border-gray-200 p-3 rounded-lg bg-white space-y-3">
                {/* Challenge title */}
                <Skeleton className="h-4 w-3/4" />

                {/* Tags */}
                <div className="flex gap-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3 bg-white rounded-xl border border-gray-200 py-5 px-6">
      <div className="flex gap-2 items-center">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center">
          <TrendingUp size={18} color="green" />
        </div>

        <p className="text-lg font-semibold">{approvedChallengesLength}%</p>
      </div>

      <Progress value={approvedChallengesLength} />

      <div className="flex gap-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
            stroke="#525252"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <p className="text-sm font-medium text-neutral-600">
          Таны onboarding прогресс
        </p>
      </div>

      {/* <p className="text-sm font-semibold">Сорилтууд</p>

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
      </div> */}

      {/* Show approved submissions only for newbies */}
      <div className="h-fit">
        {userRole !== "buddy" && approvedSubmissions.length === 0 && (
          <p className="text-sm text-gray-500 text-center">Биелүүлсэн сорилт байхгүй байна.</p>
        )}
        {userRole !== "buddy" && approvedSubmissions.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold">Сорилтууд</p>

            <div className="h-22 overflow-scroll space-y-3">
              {approvedSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="w-full border border-gray-200 p-3 rounded-lg bg-white space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h5 className="text-sm font-semibold">
                      {submission.challenge_title}
                    </h5>
                  </div>

                  <div className="flex gap-3 items-center">
                    <div className="border border-gray-200 text-xs rounded-full py-1 px-2">
                      {submission.week || "1-р долоо хоног"}
                    </div>
                    <div
                      className={`text-xs font-medium rounded-full py-1 px-2 ${submission.difficulty === "Easy"
                        ? "text-green-800 bg-green-100"
                        : submission.difficulty === "Medium"
                          ? "text-amber-800 bg-amber-100"
                          : submission.difficulty === "Hard"
                            ? "text-pink-800 bg-pink-100"
                            : "text-green-800 bg-green-100"
                        }`}
                    >
                      {submission.difficulty === "Easy"
                        ? "Хялбар"
                        : submission.difficulty === "Medium"
                          ? "Дундаж"
                          : submission.difficulty === "Hard"
                            ? "Хэцүү"
                            : "Хялбар"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
