import { supabase } from "../supabase";


export interface UserProgress {
  user_id: string;
  progress_value: number;
  updated_at: string;
}

export const updateUserProgress = async (userId: string, increment: number = 5) => {
  try {
    // Get current progress or create new record
    const { data: currentProgress, error: fetchError } = await supabase
      .from('user_progress')
      .select('progress_value')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    const currentValue = currentProgress?.progress_value || 0;
    const newValue = Math.min(currentValue + increment, 100); // Cap at 100%

    // Upsert progress record
    const { data, error } = await supabase
      .from('user_progress')
      .upsert({
        user_id: userId,
        progress_value: newValue,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};