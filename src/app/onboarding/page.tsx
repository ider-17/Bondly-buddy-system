'use client'

import { ChevronRight, Target } from "lucide-react";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

const INTERESTS = [
    "🎬 Movies & TV Shows",
    "📚 Books & Reading",
    "🎨 Art & Design",
    "🏋️‍♂️ Fitness & Gym",
    "🤖 AI & Robotics",
    "🌍 Travel",
    "🍽️ Cooking & Foodie Adventures",
    "🗣️ Language Learning",
    "👫 Volunteering / Social Impact",
    "🧘‍♀️ Yoga & Meditation",
    "🏔️ Hiking & Outdoor Activities",
    "🥗 Healthy Living",
    "🧠 Self-improvement",
    "💡 Entrepreneurship & Startups",
    "🎯 Career Goals",
    "💻 Technology & Gadgets",
    "📱 Mobile Apps / UX & UI",
    "🚀 Science & Innovation",
    "🎲 Board Games",
    "📸 Photography",
    "🌿 Plants & Gardening",
    "🐶 Pet Lover"
];

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [previousExperience, setPreviousExperience] = useState(`UX/UI дизайны чиглэлээр нэг жилийн турш онол, практикийг хослуулан тууштай суралцаж, бодит төслүүд дээр ажилласан туршлагатай.
Хэрэглэгчийн ярилцлага, судалгаа хийж, хэрэглэгчийн урсгал, wireframe болон интерактив прототипийг Figma ашиглан боловсруулсан.
Багийн орчинд хамтран ажиллаж, дизайнаа хөгжүүлэгчидтэй уялдуулан хэрэгжүүлэх туршлага хуримтлуулсан. Одоогоор хэрэглэгч төвтэй шийдэл боловсруулах ур чадвараа гүнзгийрүүлэн хөгжүүлж байна.`);

    const [careerGoals, setCareerGoals] = useState(`UX/UI дизайнерийн ажил надад яг миний хайж байсан зүйлийг олж өгсөн. Хэрэглэгчийн асуудлыг шийдэх, үнэ цэнтэй шийдэл бүтээхэд оролцож байгаадаа баяртай байдаг. 
Одоогоор хэрэглэгчийн судалгаа, дизайн систем, прототип хийх ур чадвараа сайжруулж, багтайгаа илүү үр дүнтэй хамтран ажиллахыг зорьж байна. 
Цаашдаа бодит нөлөө үзүүлдэг, хэрэглэгч төвтэй шийдэл гаргадаг дизайнер болохыг хүсэж байна. 
Хэрэглэгчдэд үнэхээр хэрэгтэй зүйлийг бүтээж чадсан тэр мэдрэмж л надад урам өгдөг.`);

    const router = useRouter();

    const toggleInterest = (interest: string) => {
        setSelectedInterests(prev =>
            prev.includes(interest)
                ? prev.filter(i => i !== interest)
                : prev.length < 6
                    ? [...prev, interest]
                    : prev
        );
    };

    const handleNext = async () => {
        if (currentStep === 1) {
            if (selectedInterests.length < 3) {
                alert("Please select at least 3 interests");
                return;
            }
            setCurrentStep(2);
        } else {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError || !session) {
                alert("User session not found");
                return;
            }

            const userId = session.user.id;

            const { error } = await supabase
                .from("users")
                .update({
                    interests: selectedInterests,
                    previous_experience: previousExperience,
                    career_goals: careerGoals,
                    first_login: false,
                })
                .eq("id", userId);

            if (error) {
                alert("Failed to save data: " + error.message);
                return;
            }

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("role")
                .eq("id", userId)
                .single();

            if (userError || !userData) {
                alert("Failed to get user role");
                return;
            }

            if (userData.role === "newbie") {
                router.push("/newbie/home");
            } else if (userData.role === "buddy") {
                router.push("/buddy/home");
            } else {
                router.push("/");
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="w-full h-screen flex flex-col gap-10 justify-center items-center bg-slate-50 text-black">
            {currentStep === 1 && (
                <div className="border border-neutral-300 py-5 px-6 space-y-6 rounded-xl bg-white min-w-[426px]">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex justify-center items-center mb-4">
                            <svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="..." fill="#15803D" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-medium mb-2">Your Interests</h2>
                            <p className="text-neutral-600 text-sm font-medium">
                                Select your favorite topics to make your journey more fun <br /> and personal.
                            </p>
                        </div>
                    </div>

                    <div className="text-center flex flex-col items-center">
                        <p className="text-neutral-600 text-sm font-medium mb-3">Select 3–6 interests</p>
                        <div className="w-[80%] h-[264px] overflow-scroll flex flex-col gap-2 items-center">
                            {INTERESTS.map((interest) => (
                                <div
                                    key={interest}
                                    onClick={() => toggleInterest(interest)}
                                    className={`border rounded-full py-2 px-[10px] text-xs font-semibold w-full cursor-pointer select-none
                                        ${selectedInterests.includes(interest)
                                            ? "bg-black text-white border-white"
                                            : "border-neutral-300"
                                        }`}
                                >
                                    {interest}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h6 className="text-sm font-semibold mb-3">Previous Experience</h6>
                        <textarea
                            placeholder="Tell us about your background and previous experience..."
                            className="w-full py-3 px-6 rounded-xl border border-neutral-300 resize-none"
                            rows={4}
                            value={previousExperience}
                            onChange={e => setPreviousExperience(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className="border border-neutral-300 py-5 px-6 space-y-6 rounded-xl bg-white min-w-[426px]">
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex justify-center items-center mb-4">
                            <Target size={32} color="#C2410C" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-medium">Your Goals</h2>
                            <p className="text-sm font-medium text-neutral-600">What do you hope to achieve in your first year?</p>
                        </div>
                    </div>
                    <div>
                        <h6 className="text-sm font-semibold mb-3">Career Goals</h6>
                        <textarea
                            placeholder="Describe your short-term and long-term career goals..."
                            className="border border-neutral-300 rounded-xl py-6 px-3 w-full resize-none"
                            rows={6}
                            value={careerGoals}
                            onChange={e => setCareerGoals(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <div>
                <div className="flex gap-2 justify-center mb-5 mt-2">
                    <div className={`w-2 h-2 rounded-full ${currentStep === 1 ? "bg-blue-500" : "bg-gray-300"}`}></div>
                    <div className={`w-2 h-2 rounded-full ${currentStep === 2 ? "bg-blue-500" : "bg-gray-300"}`}></div>
                </div>

                <div className="w-[425px] flex justify-between">
                    <button onClick={handleBack} className="bg-white py-3 px-4 rounded-xl cursor-pointer">Back</button>
                    <div
                        onClick={handleNext}
                        className="flex gap-2 py-[10px] px-4 rounded-xl bg-black text-white items-center cursor-pointer"
                    >
                        <p>{currentStep === 1 ? "Next" : "Finish"}</p>
                        <ChevronRight size={24} color="white" />
                    </div>
                </div>
            </div>
        </div>
    );
}
