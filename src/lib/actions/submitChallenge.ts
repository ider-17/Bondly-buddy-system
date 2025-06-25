import { supabase } from '../supabase'

interface SubmitChallengeParams {
    challengeId: string
    note: string
}

// Newbie → "Request approval"
export async function submitChallenge({ challengeId, note }: SubmitChallengeParams) {
    const { data, error } = await supabase
        .from('challenges')
        .update({ note, status: 'pending' })
        .eq('id', challengeId)
        .select()
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return data
}

// Buddy → "Approve"
export async function approveChallenge(challengeId: string) {
    const { error } = await supabase
        .from('challenges')
        .update({ status: 'approved' })
        .eq('id', challengeId)

    if (error) {
        throw new Error(error.message)
    }
}
