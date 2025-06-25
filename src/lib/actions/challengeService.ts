import { supabase } from '../supabase';
import { updateUserProgress } from './progressService';

interface SubmitChallengeParams {
  challengeId: string;
  note: string;
}

// Newbie → "Request approval"
export const submitChallenge = async ({ challengeId, note }: SubmitChallengeParams) => {
  const { data, error } = await supabase
    .from('challenges')
    .update({ note, status: 'pending' })
    .eq('id', challengeId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Buddy → "Approve" with progress update
export const approveChallenge = async (challengeId: string) => {
  try {
    // Get challenge details to find user_id
    const { data: challenge, error: challengeError } = await supabase
      .from('challenges')
      .select('user_id')
      .eq('id', challengeId)
      .single();

    if (challengeError) throw challengeError;

    // Update challenge status
    const { error: updateError } = await supabase
      .from('challenges')
      .update({ status: 'approved' })
      .eq('id', challengeId);

    if (updateError) throw updateError;

    // Update user progress
    await updateUserProgress(challenge.user_id, 5);

    return { success: true };
  } catch (error) {
    console.error('Error approving challenge:', error);
    throw error;
  }
};