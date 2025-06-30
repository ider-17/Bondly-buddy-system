import { supabase } from "@/lib/supabase";

export async function markTipAsRead(tipId: string, category: string) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User session not found");
  }

  const userId = session.user.id;

  const { error } = await supabase
    .from('read_tips')
    .insert({
      user_id: userId,
      tip_id: tipId,
      category: category,
    });

  if (error && error.code !== '23505') { // Ignore duplicate key errors
    throw new Error(`Failed to mark tip as read: ${error.message}`);
  }
}

export async function unmarkTipAsRead(tipId: string) {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User session not found");
  }

  const userId = session.user.id;

  const { error } = await supabase
    .from('read_tips')
    .delete()
    .eq('user_id', userId)
    .eq('tip_id', tipId);

  if (error) {
    throw new Error(`Failed to unmark tip as read: ${error.message}`);
  }
}

export async function recordDailyActivity() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User session not found");
  }

  const userId = session.user.id;

  // Insert today's activity (will be ignored if already exists due to unique constraint)
  const { error } = await supabase
    .from('user_activity')
    .insert({
      user_id: userId,
      activity_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    });

  // We don't throw an error here because duplicate entries are expected and handled by the unique constraint
  if (error && error.code !== '23505') {
    console.error('Error recording daily activity:', error);
  }
}

export async function fetchReadTips() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User session not found");
  }

  const userId = session.user.id;

  const { data: readTips, error } = await supabase
    .from('read_tips')
    .select('tip_id')
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to fetch read tips: ${error.message}`);
  }

  return readTips || [];
}

export async function fetchUserProgressStats() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    throw new Error("User session not found");
  }

  const userId = session.user.id;

  // Fetch approved challenges count and percentage
  const { count: approvedCount, error: approvedError } = await supabase
    .from('submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')
    .eq('user_id', userId);

  const { count: totalCount, error: totalError } = await supabase
    .from('challenges')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (approvedError || totalError) {
    throw new Error('Error fetching challenges data');
  }

  // Calculate progress percentage
  let progressPercentage = 0;
  let completedChallenges = 0;
  
  if (approvedCount !== null && totalCount !== null && totalCount > 0) {
    progressPercentage = parseFloat(((approvedCount / totalCount) * 100).toFixed(1));
    completedChallenges = approvedCount;
  }

  // Fetch active days count
  const { count: activeDaysCount, error: activeDaysError } = await supabase
    .from('user_activity')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (activeDaysError) {
    throw new Error('Error fetching active days');
  }

  // Fetch read tips count
  const { count: readTipsCount, error: readTipsError } = await supabase
    .from('read_tips')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (readTipsError) {
    throw new Error('Error fetching read tips');
  }

  return {
    progressPercentage,
    completedChallenges,
    activeDays: activeDaysCount || 0,
    readTips: readTipsCount || 0,
  };
}