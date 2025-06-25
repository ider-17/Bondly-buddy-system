'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
    DialogDescription,
} from '@/components/ui/dialog'
import { FilePlus2, Mountain } from 'lucide-react'
import { submitChallenge } from '@/lib/actions/submitChallenge'
import { toast } from "sonner"

interface Challenge {
    id: string
    title: string
    week: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    note: string | null
    status: string | null
}

interface ActiveChallengesProps {
    activeTab?: string
    filteredChallenges?: Challenge[]
    loading?: boolean
}

export default function ActiveChallenges({
    activeTab = 'Active',
    filteredChallenges,
    loading: externalLoading
}: ActiveChallengesProps) {
    const [challenges, setChallenges] = useState<Challenge[]>([])
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
    const [note, setNote] = useState('')
    const [internalLoading, setInternalLoading] = useState(true)

    // Use external loading state if provided, otherwise use internal
    const loading = externalLoading !== undefined ? externalLoading : internalLoading

    // Use filtered challenges if provided, otherwise use internal challenges
    const displayChallenges = filteredChallenges || challenges

    // Supabase-аас идэвхтэй challenge-үүдийг авна
    async function fetchChallenges() {
        setInternalLoading(true)
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('status', 'Active')
            .order('created_at', { ascending: true })

        if (error) {
            alert('Failed to fetch challenges: ' + error.message)
            setInternalLoading(false)
            return
        }
        setChallenges(data ?? [])
        setInternalLoading(false)
    }

    useEffect(() => {
        // Only fetch if no external filtered challenges are provided
        if (!filteredChallenges) {
            fetchChallenges()
        } else {
            setInternalLoading(false)
        }
    }, [filteredChallenges])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedChallenge) return

        try {
            await submitChallenge({ challengeId: selectedChallenge.id, note })
            toast.success("Approval request sent!")
            setNote('')
            setSelectedChallenge(null)
            // Refetch challenges if using internal state
            if (!filteredChallenges) {
                fetchChallenges()
            }
        } catch (error) {
            toast.error("Failed to submit: " + (error as Error).message)
        }
    }

    return (
        <div className="Events rounded-xl border bg-slate-50 py-5 px-6 space-y-7">
            <div className="p-5 mr-10 space-y-3">
                {loading ? (
                    <p className="text-sm text-gray-400">Loading challenges...</p>
                ) : displayChallenges.length > 0 ? (
                    displayChallenges.map((challenge) => (
                        <div key={challenge.id} className="py-[10px] ">
                            <div>
                                <div className="flex gap-2 items-center mb-2">
                                    <div className="w-8 h-8 flex items-center justify-center">
                                        <Mountain size={18} color="#22C55E" />
                                    </div>
                                    <h3 className="text-base font-semibold">{challenge.title}</h3>
                                </div>

                                <div className="flex gap-3 mb-4">
                                    <div className="rounded-full py-1 px-[10px] bg-gray-100 text-xs font-semibold">
                                        {challenge.week}
                                    </div>
                                    <div className="rounded-full py-1 px-[10px] bg-green-200 text-green-700 text-xs font-semibold">
                                        {challenge.difficulty}
                                    </div>
                                </div>


                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button
                                            className="flex gap-2 border border-neutral-300 py-2 px-3 bg-white rounded-lg items-center w-fit cursor-pointer select-none hover:bg-sky-100 active:bg-black active:text-white"
                                            onClick={() => {
                                                setSelectedChallenge(challenge)
                                                setNote(challenge.note ?? '')
                                            }}
                                        >
                                            Write note
                                            <FilePlus2 size={20} />
                                        </button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[445px]">
                                        <DialogHeader>
                                            <DialogTitle>Write Note for "{selectedChallenge?.title}"</DialogTitle>
                                            <DialogDescription>
                                                Describe your progress, challenges faced, and what you've learned.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <form onSubmit={handleSubmit}>
                                            <textarea
                                                name="note"
                                                placeholder="Describe your progress..."
                                                className="w-full border border-neutral-300 bg-white py-2 px-3 rounded-md mb-4"
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                            />

                                            <div className="flex gap-[10px] justify-between">
                                                <DialogClose asChild>
                                                    <button
                                                        type="button"
                                                        className="w-1/2 py-1 px-4 flex justify-center items-center border border-neutral-300 rounded-md cursor-pointer text-black hover:bg-sky-100 active:bg-black active:text-white"
                                                    >
                                                        Cancel
                                                    </button>
                                                </DialogClose>
                                                <button
                                                    type="submit"
                                                    className="w-1/2 border py-2 px-4 bg-black text-white flex justify-center items-center rounded-md cursor-pointer hover:bg-gray-800 active:bg-sky-100 active:text-black"
                                                >
                                                    Request Approval
                                                </button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <hr className='mt-5'></hr>

                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">
                        No {activeTab.toLowerCase()} challenges found.
                    </p>
                )}
            </div>
        </div>
    )
}