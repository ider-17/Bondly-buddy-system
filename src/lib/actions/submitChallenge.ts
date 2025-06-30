import { supabase } from "../supabase";
import React from "react";
import { RealtimeChannel } from "@supabase/supabase-js";

interface SubmitChallengeParams {
  challengeId: string;
  note: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
}

interface Submission {
  id: string;
  challenge_id: string;
  user_id: string;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  created_at: string;
}

interface ChallengeWithStatus extends Challenge {
  submission?: Submission;
  derivedStatus: 'active' | 'pending' | 'completed';
}

// Real-time subscription management
class ChallengeRealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private callbacks: Map<string, Function[]> = new Map();

  // Subscribe to real-time updates for a specific challenge
  subscribeToChallenge(
    challengeId: string, 
    userId: string, 
    callback: (challenge: ChallengeWithStatus) => void
  ) {
    const channelName = `challenge_${challengeId}_${userId}`;
    
    // Remove existing subscription if any
    this.unsubscribeFromChallenge(challengeId, userId);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `challenge_id=eq.${challengeId}`,
        },
        async (payload) => {
          console.log('Submission change detected:', payload);
          try {
            const updatedChallenge = await getChallengeWithStatus(challengeId, userId);
            callback(updatedChallenge);
          } catch (error) {
            console.error('Error fetching updated challenge:', error);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenges',
          filter: `id=eq.${challengeId}`,
        },
        async (payload) => {
          console.log('Challenge change detected:', payload);
          try {
            const updatedChallenge = await getChallengeWithStatus(challengeId, userId);
            callback(updatedChallenge);
          } catch (error) {
            console.error('Error fetching updated challenge:', error);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    
    // Store callback for cleanup
    if (!this.callbacks.has(channelName)) {
      this.callbacks.set(channelName, []);
    }
    this.callbacks.get(channelName)!.push(callback);

    return channelName;
  }

  // Subscribe to all user's challenges
  subscribeToUserChallenges(
    userId: string,
    callback: (challenges: ChallengeWithStatus[]) => void
  ) {
    const channelName = `user_challenges_${userId}`;
    
    this.unsubscribeFromUserChallenges(userId);

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'submissions',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          console.log('User submissions change detected:', payload);
          try {
            const challenges = await getUserChallengesWithStatus(userId);
            callback(challenges);
          } catch (error) {
            console.error('Error fetching user challenges:', error);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'challenges',
          filter: `user_id=eq.${userId}`,
        },
        async (payload) => {
          console.log('User challenges change detected:', payload);
          try {
            const challenges = await getUserChallengesWithStatus(userId);
            callback(challenges);
          } catch (error) {
            console.error('Error fetching user challenges:', error);
          }
        }
      )
      .subscribe();

    this.channels.set(channelName, channel);
    this.callbacks.set(channelName, [callback]);

    return channelName;
  }

  // Unsubscribe from a specific challenge
  unsubscribeFromChallenge(challengeId: string, userId: string) {
    const channelName = `challenge_${challengeId}_${userId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      this.callbacks.delete(channelName);
    }
  }

  // Unsubscribe from user challenges
  unsubscribeFromUserChallenges(userId: string) {
    const channelName = `user_challenges_${userId}`;
    const channel = this.channels.get(channelName);
    
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      this.callbacks.delete(channelName);
    }
  }

  // Clean up all subscriptions
  cleanup() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.callbacks.clear();
  }
}

// Global instance
export const challengeRealtimeManager = new ChallengeRealtimeManager();

// Enhanced submission function with real-time optimization
export async function submitChallenge({
  challengeId,
  note,
}: SubmitChallengeParams) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User session not found");
  }

  const userId = session.user.id;

  const { data: existingSubmission } = await supabase
    .from("submissions")
    .select("id")
    .eq("challenge_id", challengeId)
    .eq("user_id", userId)
    .single();

  if (existingSubmission) {
    const { data, error } = await supabase
      .from("submissions")
      .update({
        note,
        status: "pending",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", existingSubmission.id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } else {
    // Create new submission
    const { data, error } = await supabase
      .from("submissions")
      .insert([
        {
          challenge_id: challengeId,
          user_id: userId,
          note,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

// Enhanced approval function
export async function approveChallenge(challengeId: string, userId?: string) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User session not found");
  }

  // Build the update query
  let query = supabase
    .from("submissions")
    .update({ status: "approved" })
    .eq("challenge_id", challengeId);

  // If userId is provided, filter by it (for buddy approval)
  if (userId) {
    query = query.eq("user_id", userId);
  }

  const { error } = await query;

  if (error) {
    throw new Error(error.message);
  }
}

// Enhanced function to get challenge with status
export async function getChallengeWithStatus(
  challengeId: string,
  userId: string
): Promise<ChallengeWithStatus> {
  const { data: challenge, error: challengeError } = await supabase
    .from("challenges")
    .select("*")
    .eq("id", challengeId)
    .single();

  if (challengeError) {
    throw new Error(challengeError.message);
  }

  const { data: submission } = await supabase
    .from("submissions")
    .select("*")
    .eq("challenge_id", challengeId)
    .eq("user_id", userId)
    .single();

  return {
    ...challenge,
    submission,
    derivedStatus: !submission
      ? "active"
      : submission.status === "approved"
      ? "completed"
      : "pending",
  };
}

// New function to get all user challenges with status
export async function getUserChallengesWithStatus(
  userId: string
): Promise<ChallengeWithStatus[]> {
  const { data: challenges, error: challengesError } = await supabase
    .from("challenges")
    .select("*, submissions!inner(*)")
    .eq("submissions.user_id", userId)
    .order("created_at", { ascending: false });

  if (challengesError) {
    throw new Error(challengesError.message);
  }

  return challenges.map((challenge: any) => ({
    ...challenge,
    submission: challenge.submissions?.[0],
    derivedStatus: !challenge.submissions?.[0]
      ? "active"
      : challenge.submissions[0].status === "approved"
      ? "completed"
      : "pending",
  }));
}

// Real-time hook for React components
export function useRealtimeChallenge(challengeId: string, userId: string) {
  const [challenge, setChallenge] = React.useState<ChallengeWithStatus | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Initial fetch
    const fetchChallenge = async () => {
      try {
        setLoading(true);
        const challengeData = await getChallengeWithStatus(challengeId, userId);
        setChallenge(challengeData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenge();

    // Subscribe to real-time updates
    const subscription = challengeRealtimeManager.subscribeToChallenge(
      challengeId,
      userId,
      (updatedChallenge) => {
        setChallenge(updatedChallenge);
      }
    );

    // Cleanup on unmount
    return () => {
      challengeRealtimeManager.unsubscribeFromChallenge(challengeId, userId);
    };
  }, [challengeId, userId]);

  return { challenge, loading, error };
}

// Real-time hook for user challenges list
export function useRealtimeUserChallenges(userId: string) {
  const [challenges, setChallenges] = React.useState<ChallengeWithStatus[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Initial fetch
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const challengesData = await getUserChallengesWithStatus(userId);
        setChallenges(challengesData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();

    // Subscribe to real-time updates
    const subscription = challengeRealtimeManager.subscribeToUserChallenges(
      userId,
      (updatedChallenges) => {
        setChallenges(updatedChallenges);
      }
    );

    // Cleanup on unmount
    return () => {
      challengeRealtimeManager.unsubscribeFromUserChallenges(userId);
    };
  }, [userId]);

  return { challenges, loading, error };
}