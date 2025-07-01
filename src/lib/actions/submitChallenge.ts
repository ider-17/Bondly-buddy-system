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
  description?: string;
  week: string;
  difficulty: "Easy" | "Medium" | "Hard";
  note: string | null;
  status: string | null;
  created_at: string;
  user_id: string;
}

interface Submission {
  id: string;
  challenge_id: string;
  user_id: string;
  note: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string; // Fixed: removed created_at, only submitted_at exists
}

interface ChallengeWithStatus extends Challenge {
  submission?: Submission;
  derivedStatus: 'active' | 'pending' | 'completed';
}

// Enhanced Real-time subscription management
class ChallengeRealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private callbacks: Map<string, Function[]> = new Map();
  private reconnectTimeouts: Map<string, NodeJS.Timeout> = new Map();

  // Subscribe to real-time updates for a specific challenge
  subscribeToChallenge(
    challengeId: string, 
    userId: string, 
    callback: (challenge: ChallengeWithStatus) => void,
    onError?: (error: Error) => void
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
            onError?.(error instanceof Error ? error : new Error('Unknown error'));
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
            onError?.(error instanceof Error ? error : new Error('Unknown error'));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to ${channelName}`);
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Channel error for ${channelName}`);
          // Attempt to reconnect after a delay
          this.scheduleReconnect(channelName, () => {
            this.subscribeToChallenge(challengeId, userId, callback, onError);
          });
        }
      });

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
    callback: (challenges: ChallengeWithStatus[]) => void,
    onError?: (error: Error) => void
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
            onError?.(error instanceof Error ? error : new Error('Unknown error'));
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
            onError?.(error instanceof Error ? error : new Error('Unknown error'));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Successfully subscribed to ${channelName}`);
        } else if (status === 'CHANNEL_ERROR') {
          // console.error(`Channel error for ${channelName}`);
          // Attempt to reconnect after a delay
          this.scheduleReconnect(channelName, () => {
            this.subscribeToUserChallenges(userId, callback, onError);
          });
        }
      });

    this.channels.set(channelName, channel);
    this.callbacks.set(channelName, [callback]);

    return channelName;
  }

  // Schedule reconnection with exponential backoff
  private scheduleReconnect(channelName: string, reconnectFn: () => void) {
    // Clear existing timeout
    const existingTimeout = this.reconnectTimeouts.get(channelName);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Schedule reconnection with 5 second delay
    const timeout = setTimeout(() => {
      console.log(`Attempting to reconnect ${channelName}`);
      reconnectFn();
      this.reconnectTimeouts.delete(channelName);
    }, 5000);

    this.reconnectTimeouts.set(channelName, timeout);
  }

  // Unsubscribe from a specific challenge
  unsubscribeFromChallenge(challengeId: string, userId: string) {
    const channelName = `challenge_${challengeId}_${userId}`;
    this.unsubscribeChannel(channelName);
  }

  // Unsubscribe from user challenges
  unsubscribeFromUserChallenges(userId: string) {
    const channelName = `user_challenges_${userId}`;
    this.unsubscribeChannel(channelName);
  }

  // Generic unsubscribe method
  private unsubscribeChannel(channelName: string) {
    const channel = this.channels.get(channelName);
    
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      this.callbacks.delete(channelName);
    }

    // Clear any pending reconnection timeouts
    const timeout = this.reconnectTimeouts.get(channelName);
    if (timeout) {
      clearTimeout(timeout);
      this.reconnectTimeouts.delete(channelName);
    }
  }

  // Clean up all subscriptions
  cleanup() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.callbacks.clear();
    
    // Clear all reconnection timeouts
    this.reconnectTimeouts.forEach((timeout) => {
      clearTimeout(timeout);
    });
    this.reconnectTimeouts.clear();
  }
}

// Global instance
export const challengeRealtimeManager = new ChallengeRealtimeManager();

// Enhanced submission function with better error handling
export async function submitChallenge({
  challengeId,
  note,
}: SubmitChallengeParams) {
  try {
    // Validate inputs
    if (!challengeId || !note?.trim()) {
      throw new Error("Challenge ID and note are required");
    }

    // Check if supabase is properly initialized
    if (!supabase || !supabase.auth) {
      throw new Error("Supabase client not properly initialized");
    }

    console.log("Getting session...");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Session error:", sessionError);
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!session?.user?.id) {
      throw new Error("User session not found. Please log in again.");
    }

    const userId = session.user.id;
    console.log("User ID:", userId);

    // Check for existing submission
    console.log("Checking for existing submission...");
    const { data: existingSubmission, error: checkError } = await supabase
      .from("submissions")
      .select("id")
      .eq("challenge_id", challengeId)
      .eq("user_id", userId)
      .maybeSingle(); // Use maybeSingle instead of single to avoid error when no records found

    if (checkError) {
      console.error("Error checking existing submission:", checkError);
      throw new Error(`Database error: ${checkError.message}`);
    }

    if (existingSubmission) {
      console.log("Updating existing submission...");
      // Update existing submission
      const { data, error } = await supabase
        .from("submissions")
        .update({
          note: note.trim(),
          status: "pending",
          submitted_at: new Date().toISOString(),
        })
        .eq("id", existingSubmission.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating submission:", error);
        throw new Error(`Failed to update submission: ${error.message}`);
      }

      console.log("Submission updated successfully:", data);
      return data;
    } else {
      console.log("Creating new submission...");
      // Create new submission - Fixed: only specify fields that exist in the table
      const { data, error } = await supabase
        .from("submissions")
        .insert([
          {
            challenge_id: challengeId,
            user_id: userId,
            note: note.trim(),
            status: "pending",
            // submitted_at will be set automatically by the database default
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating submission:", error);
        throw new Error(`Failed to create submission: ${error.message}`);
      }

      console.log("Submission created successfully:", data);
      return data;
    }
  } catch (error) {
    console.error("submitChallenge error:", error);
    
    // Re-throw with more context
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred while submitting the challenge");
    }
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
    throw new Error(`Failed to approve challenge: ${error.message}`);
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
    throw new Error(`Failed to fetch challenge: ${challengeError.message}`);
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

// Improved function to get all user challenges with status
export async function getUserChallengesWithStatus(
  userId: string
): Promise<ChallengeWithStatus[]> {
  // First get all challenges for the user
  const { data: challenges, error: challengesError } = await supabase
    .from("challenges")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (challengesError) {
    throw new Error(`Failed to fetch challenges: ${challengesError.message}`);
  }

  if (!challenges || challenges.length === 0) {
    return [];
  }

  // Get all submissions for these challenges
  const challengeIds = challenges.map(c => c.id);
  const { data: submissions } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", userId)
    .in("challenge_id", challengeIds);

  // Map challenges with their submissions
  return challenges.map((challenge: Challenge) => {
    const submission = submissions?.find(s => s.challenge_id === challenge.id);
    return {
      ...challenge,
      submission,
      derivedStatus: !submission
        ? "active"
        : submission.status === "approved"
        ? "completed"
        : "pending",
    };
  });
}

// Enhanced real-time hook for React components
export function useRealtimeChallenge(challengeId: string, userId: string) {
  const [challenge, setChallenge] = React.useState<ChallengeWithStatus | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!challengeId || !userId) {
      setLoading(false);
      return;
    }

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
    challengeRealtimeManager.subscribeToChallenge(
      challengeId,
      userId,
      (updatedChallenge) => {
        setChallenge(updatedChallenge);
      },
      (err) => {
        setError(err.message);
      }
    );

    // Cleanup on unmount
    return () => {
      challengeRealtimeManager.unsubscribeFromChallenge(challengeId, userId);
    };
  }, [challengeId, userId]);

  return { challenge, loading, error };
}

// Enhanced real-time hook for user challenges list
export function useRealtimeUserChallenges(userId: string) {
  const [challenges, setChallenges] = React.useState<ChallengeWithStatus[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

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
    challengeRealtimeManager.subscribeToUserChallenges(
      userId,
      (updatedChallenges) => {
        setChallenges(updatedChallenges);
      },
      (err) => {
        setError(err.message);
      }
    );

    // Cleanup on unmount
    return () => {
      challengeRealtimeManager.unsubscribeFromUserChallenges(userId);
    };
  }, [userId]);

  return { challenges, loading, error };
}