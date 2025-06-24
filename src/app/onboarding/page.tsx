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
]

export default function Onboarding() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [previousExperience, setPreviousExperience] = useState("");
    const [careerGoals, setCareerGoals] = useState("");
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
            // Save data to Supabase
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

            // Get user role for redirect
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
                            {/* You can replace this svg with your own icon */}
                            <svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.25454 16.6314L0.664956 13.0414C0.404956 12.7803 0.277595 12.4756 0.282872 12.1273C0.288428 11.7789 0.421067 11.4748 0.680789 11.2148L4.25454 7.6581C4.51593 7.3981 4.82079 7.2681 5.16912 7.2681C5.51746 7.2681 5.82162 7.3981 6.08162 7.6581L9.62746 11.2148C9.89468 11.4759 10.0283 11.7806 10.0283 12.1289C10.0283 12.4773 9.89468 12.7814 9.62746 13.0414L6.08162 16.6152C5.82023 16.8752 5.51537 17.0078 5.16704 17.0131C4.81871 17.0184 4.51454 16.8912 4.25454 16.6314ZM13.3008 33.346C12.9313 33.346 12.6218 33.2212 12.372 32.9714C12.122 32.7214 11.997 32.4118 11.997 32.0427V25.0727C10.492 24.9563 8.99593 24.8025 7.50871 24.6114C6.02176 24.42 4.53996 24.1638 3.06329 23.8427C2.75079 23.7716 2.50162 23.6112 2.31579 23.3614C2.12968 23.1117 2.07509 22.8355 2.15204 22.5327C2.22871 22.2296 2.40996 22.0082 2.69579 21.8685C2.98134 21.7288 3.28621 21.6946 3.61037 21.766C5.65871 22.216 7.72246 22.5325 9.80162 22.7156C11.8805 22.8987 13.9663 22.9902 16.0591 22.9902C18.1519 22.9902 20.2377 22.8987 22.3166 22.7156C24.3958 22.5325 26.4595 22.216 28.5079 21.766C28.8354 21.6946 29.144 21.728 29.4337 21.866C29.7237 22.0038 29.9069 22.223 29.9833 22.5235C30.0602 22.8324 29.9948 23.1149 29.787 23.371C29.5793 23.6268 29.3145 23.7898 28.9929 23.8598C27.5279 24.1695 26.0563 24.42 24.5783 24.6114C23.1005 24.8025 21.6148 24.9563 20.1212 25.0727V32.0427C20.1212 32.4118 19.9962 32.7214 19.7462 32.9714C19.4965 33.2212 19.1869 33.346 18.8175 33.346H13.3008ZM5.16829 14.6293L7.63621 12.1281L5.16829 9.66018L2.65621 12.1281L5.16829 14.6293ZM16.0554 9.09393C14.882 9.09393 13.8859 8.68324 13.067 7.86185C12.2484 7.04046 11.8391 6.0431 11.8391 4.86976C11.8391 3.69671 12.2498 2.70074 13.0712 1.88185C13.8923 1.06324 14.8895 0.653931 16.0629 0.653931C17.2362 0.653931 18.2323 1.06449 19.0512 1.8856C19.8698 2.70699 20.2791 3.70435 20.2791 4.87768C20.2791 6.05101 19.8684 7.04712 19.047 7.86601C18.2259 8.68462 17.2287 9.09393 16.0554 9.09393ZM16.0612 20.3877C15.2479 20.3877 14.5548 20.1005 13.982 19.526C13.4095 18.9516 13.1233 18.2609 13.1233 17.4539C13.1233 16.6406 13.4088 15.9475 13.98 15.3748C14.5511 14.8023 15.2434 14.516 16.057 14.516C16.8704 14.516 17.5634 14.8016 18.1362 15.3727C18.7087 15.9438 18.995 16.6343 18.995 17.4443C18.995 18.2541 18.7094 18.9471 18.1383 19.5235C17.5672 20.0996 16.8748 20.3877 16.0612 20.3877ZM16.0541 6.99976C16.6536 6.99976 17.1586 6.79615 17.5691 6.38893C17.98 5.98143 18.1854 5.4781 18.1854 4.87893C18.1854 4.27949 17.9816 3.77435 17.5741 3.36351C17.1669 2.95296 16.6636 2.74768 16.0641 2.74768C15.4647 2.74768 14.9597 2.95143 14.5491 3.35893C14.1383 3.76615 13.9329 4.26949 13.9329 4.86893C13.9329 5.46837 14.1366 5.97337 14.5441 6.38393C14.9513 6.79449 15.4547 6.99976 16.0541 6.99976ZM24.3625 16.5243L22.7141 13.6077C22.5972 13.4152 22.5387 13.2013 22.5387 12.966C22.5387 12.7307 22.5972 12.5102 22.7141 12.3043L24.3625 9.38768C24.4794 9.19046 24.6418 9.03338 24.8495 8.91643C25.0573 8.79976 25.2775 8.74143 25.51 8.74143H28.7462C28.989 8.74143 29.2134 8.79976 29.4195 8.91643C29.6259 9.03338 29.7838 9.19046 29.8933 9.38768L31.5525 12.3043C31.6622 12.4991 31.717 12.7153 31.717 12.9531C31.717 13.1909 31.6622 13.4091 31.5525 13.6077L29.8933 16.5243C29.7805 16.7288 29.6219 16.8895 29.4175 17.0064C29.2127 17.1231 28.989 17.1814 28.7462 17.1814H25.51C25.2769 17.1814 25.0561 17.1231 24.8475 17.0064C24.6391 16.8895 24.4775 16.7288 24.3625 16.5243ZM25.9504 15.0877H28.3125L29.497 12.9614L28.3162 10.8352H25.9545L24.7695 12.9614L25.9504 15.0877Z" fill="#15803D" />
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
                        <p className="text-neutral-600 text-sm font-medium mb-3">Select 3-6 interests</p>

                        <div className="w-[80%] h-[264px] overflow-scroll flex flex-col gap-2 items-center">
                            {INTERESTS.map((interest) => (
                                <div
                                    key={interest}
                                    onClick={() => toggleInterest(interest)}
                                    className={`border rounded-full py-2 px-[10px] text-xs font-semibolds w-full cursor-pointer select-none
                                        ${selectedInterests.includes(interest)
                                            ? "bg-blue-100 border-blue-400"
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
                    <button onClick={handleBack} className="bg-white py-3 px-4 rounded-xl cursor-pointer">
                        Back
                    </button>
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