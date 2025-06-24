import { supabase } from '../supabase'

interface SubmitChallengeParams {
    challengeId: string
    note: string
}

export async function submitChallenge({ challengeId, note }: SubmitChallengeParams) {
    // Challenge-д note нэмээд статусыг pending болгоно
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
