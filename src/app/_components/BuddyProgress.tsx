"use client";

import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProgressData {
  completionPercentage: number;
  newbieName?: string;
  newbieId?: string;
}

export default function ProgressTracker() {
  const [progressData, setProgressData] = useState<ProgressData>({
    completionPercentage: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const calculateProgressFromSubmissions = async (newbieId: string) => {
    try {
      // Get approved submissions count for this newbie
      const { count: approvedSubmissions, error: approvedError } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", newbieId)
        .eq("status", "approved");

      if (approvedError) {
        console.error("Error fetching approved submissions:", approvedError);
        return 0;
      }

      // Get total challenges count for this newbie
      const { count: totalChallenges, error: totalError } = await supabase
        .from("challenges")
        .select("*", { count: "exact", head: true })
        .eq("user_id", newbieId);

      if (totalError) {
        console.error("Error fetching total challenges:", totalError);
        return 0;
      }

      if (!totalChallenges || totalChallenges === 0) {
        return 0;
      }

      // Calculate percentage
      const percentage = ((approvedSubmissions || 0) / totalChallenges) * 100;
      return Math.round(percentage * 10) / 10; // Round to 1 decimal place
    } catch (error) {
      console.error("Error calculating progress:", error);
      return 0;
    }
  };

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        throw new Error("User session not found");
      }

      // First, verify the current user is a buddy
      const { data: currentUser, error: userError } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (userError || currentUser?.role !== "buddy") {
        throw new Error("Access denied: Only buddies can view newbie progress");
      }

      // For now, get the first newbie user (you should modify this to get the assigned newbie)
      // TODO: Add a buddy_newbie relationship table to properly assign buddies to newbies
      const { data: newbieUser, error: newbieError } = await supabase
        .from("users")
        .select("id, name")
        .eq("role", "newbie")
        .limit(1)
        .single();

      if (newbieError || !newbieUser) {
        console.log("No newbie found, setting progress to 0");
        setProgressData({ completionPercentage: 0 });
        return;
      }

      // Calculate progress using the same logic as YourProgress.tsx
      const [
        { count: approvedCount, error: approvedError },
        { count: totalCount, error: totalError },
      ] = await Promise.all([
        supabase
          .from("submissions")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved")
          .eq("user_id", newbieUser.id),
        supabase
          .from("challenges")
          .select("*", { count: "exact", head: true })
          .eq("user_id", newbieUser.id),
      ]);

      let calculatedProgress = 0;

      if (approvedError || totalError) {
        console.error("Error fetching challenges data:", approvedError || totalError);
      } else {
        if (approvedCount !== null && totalCount !== null && totalCount > 0) {
          const percentage = (approvedCount / totalCount) * 100;
          calculatedProgress = parseFloat(percentage.toFixed(1));
        } else {
          calculatedProgress = 0;
        }
      }

      // Try to get existing progress record first
      const { data: progressRecord, error: progressError } = await supabase
        .from("user_progress")
        .select("progress_value")
        .eq("user_id", newbieUser.id)
        .single();

      if (progressError) {
        // If no progress record exists, create one with calculated progress
        console.log("No progress record found, creating one with calculated progress");
        
        const { error: insertError } = await supabase
          .from("user_progress")
          .insert({
            user_id: newbieUser.id,
            progress_value: calculatedProgress,
          });

        if (insertError) {
          console.error("Error creating progress record:", insertError);
        }
      } else {
        // Update the progress record if the calculated progress is different
        if (progressRecord && Math.abs(progressRecord.progress_value - calculatedProgress) > 0.1) {
          const { error: updateError } = await supabase
            .from("user_progress")
            .update({ progress_value: calculatedProgress })
            .eq("user_id", newbieUser.id);

          if (updateError) {
            console.error("Error updating progress record:", updateError);
          }
        }
      }

      setProgressData({
        completionPercentage: calculatedProgress,
        newbieName: newbieUser.name || "Newbie User",
        newbieId: newbieUser.id,
      });
    } catch (err) {
      console.error("Error fetching progress data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();

    // Set up real-time subscription for progress updates
    const progressSubscription = supabase
      .channel("user_progress_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_progress",
        },
        () => fetchProgressData()
      )
      .subscribe();

    // Also listen for submission changes to recalculate progress
    const submissionSubscription = supabase
      .channel("submission_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "submissions",
        },
        () => fetchProgressData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(progressSubscription);
      supabase.removeChannel(submissionSubscription);
    };
  }, []);

  if (loading) {
    return (
      <div className="w-full space-y-4 bg-white rounded-xl border border-gray-200 py-5 px-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[1].map((i) => (
              <div key={i} className="space-y-2">
                {/* <div className="h-4 bg-gray-200 rounded w-48"></div> */}
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-xl border border-red-200 py-5 px-6">
        <div className="text-red-600 text-sm">
          Failed to load progress data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 bg-white rounded-xl border border-gray-200 py-5 px-6">
      {/* Main Progress Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center">
          <TrendingUp size={18} className="text-green-600" />
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-900">
            {5}%
          </p>
          {/* <p className="text-sm text-gray-500">
            {progressData.newbieName ? `${progressData.newbieName}'s Progress` : 'Newbie Progress'}
          </p> */}
        </div>
      </div>    

      {/* Progress Bar */}
      <Progress value={5} className="h-2" />
      
      {/* Additional Info */}
      <div className="flex gap-3 items-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#525252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm font-medium text-neutral-600">
          Таны Newbie-ийн onboarding прогресс</p>
      </div>
    </div>
  );
}