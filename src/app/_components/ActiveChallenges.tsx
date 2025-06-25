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

export default function ActiveChallenges() {
    const [challenges, setChallenges] = useState<Challenge[]>([])
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
    const [note, setNote] = useState('')

    // Supabase-аас идэвхтэй challenge-үүдийг авна
    async function fetchChallenges() {
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('status', 'Active')
            .order('created_at', { ascending: true })

        if (error) {
            alert('Failed to fetch challenges: ' + error.message)
            return
        }
        setChallenges(data ?? [])
    }

    useEffect(() => {
        fetchChallenges()
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!selectedChallenge) return

        try {
            await submitChallenge({ challengeId: selectedChallenge.id, note })
            toast.success("Approval request sent!") 
            setNote('')
            setSelectedChallenge(null)
            fetchChallenges()
        } catch (error) {
            toast.error("Failed to submit: " + (error as Error).message)
        }
    }


    return (
        <div className="Events rounded-xl border border-neutral-300 py-5 px-6 space-y-7">
            <div className="flex justify-between items-center">
                <div className="flex gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center">
                        <Mountain size={18} color="#22C55E" />
                    </div>
                    <h6 className="text-lg font-semibold">Active Challenges</h6>
                </div>
            </div>

            {challenges.length === 0 && <p>No active challenges found.</p>}

            {challenges.map((challenge) => (
                <div key={challenge.id} className="py-[10px] space-y-4 border-t border-neutral-300">
                    <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Mountain size={18} color="#22C55E" />
                        </div>
                        <p className="text-sm font-medium">{challenge.title}</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="rounded-full py-1 px-[10px] bg-gray-100 text-xs font-semibold">{challenge.week}</div>
                        <div className="rounded-full py-1 px-[10px] bg-green-200 text-green-700 text-xs font-semibold">{challenge.difficulty}</div>
                        {/* {challenge.status && (
                            <div
                                className={`rounded-full py-1 px-[10px] text-xs font-semibold ${challenge.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-600'
                                    }`}
                            >
                                {challenge.status.toUpperCase()}
                            </div>
                        )} */}
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
                                <DialogDescription>Describe your progress, challenges faced, and what you’ve learned.</DialogDescription>
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
            ))}
        </div>
    )
}
