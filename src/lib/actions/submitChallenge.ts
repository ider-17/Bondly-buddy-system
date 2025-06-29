import { supabase } from "../supabase";

interface SubmitChallengeParams {
  challengeId: string;
  note: string;
}

// Newbie → "Request approval" - Creates submission record
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

// Buddy → "Approve" - Updates submission status to approved
export async function approveChallenge(challengeId: string) {
  // Get current user session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User session not found");
  }

  const { error } = await supabase
    .from("submissions")
    .update({ status: "approved" })
    .eq("challenge_id", challengeId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getChallengeWithStatus(
  challengeId: string,
  userId: string
) {
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
