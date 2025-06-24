// lib/actions/addChallenge.ts
'use server'

import { supabase } from '@/lib/supabase'

export async function addChallenge({
    title,
    week,
    difficulty,
    note,
    user_id,
}: {
    title: string
    week: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    note?: string
    user_id: string
}) {
    const { error } = await supabase.from('challenges').insert([
        {
            title,
            week,
            difficulty,
            note,
            user_id,
        },
    ])

    if (error) {
        console.error('Challenge insert error:', error.message)
        throw new Error(error.message)
    }
}
