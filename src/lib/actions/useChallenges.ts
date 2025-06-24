// lib/hooks/useChallenges.ts
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export interface Challenge {
    id: string
    title: string
    week: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    note: string | null
    status: string
    created_at: string
    user_id: string | null
}

export function useChallenges() {
    const [challenges, setChallenges] = useState<Challenge[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchChallenges = async () => {
            const { data, error } = await supabase
                .from('challenges')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Fetch error:', error.message)
            } else {
                setChallenges(data)
            }

            setLoading(false)
        }

        fetchChallenges()
    }, [])

    return { challenges, loading }
}
