"use client"

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CareerGoals() {
    const tabs = ["Карьерийн зорилго", "Туршлага"]
    const [activeTab, setActiveTab] = useState("Карьерийн зорилго");
    const [loading, setLoading] = useState(false); // Add your loading state logic here

    if (loading) {
        return (
            <div className="w-full">
                {/* Tab buttons */}
                <div className="flex-1 mb-5">
                    <div className="bg-neutral-100 rounded-xl p-1 flex justify-between w-full">
                        <Skeleton className="w-full h-8 rounded-lg mr-1" />
                        <Skeleton className="w-full h-8 rounded-lg ml-1" />
                    </div>
                </div>

                {/* Content area */}
                <div className="border border-gray-200 py-5 px-6 rounded-xl bg-white space-y-3">
                    {activeTab === "Карьерийн зорилго" ? (
                        // Career goals skeleton (text blocks)
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : (
                        // Experience skeleton
                        <div className="space-y-3">
                            {/* Company header */}
                            <div className="flex gap-3">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            </div>

                            {/* Bullet points */}
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-2">
                                        <div className="pt-2">
                                            <Skeleton className="w-1.5 h-1.5 rounded-full" />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <Skeleton className="h-4 w-full" />
                                            {i === 3 && <Skeleton className="h-4 w-4/5" />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex-1 mb-5">
                <div className="bg-neutral-100 rounded-xl p-1 flex justify-between w-full">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full py-[6px] rounded-lg text-sm font-medium transition-all duration-200
                            ${activeTab === tab ? "bg-white shadow text-black" : "text-neutral-500"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === "Карьерийн зорилго" && (
                <div className="border border-gray-200 py-5 px-6 rounded-xl bg-white text-neutral-600 font-medium">
                    UX/UI дизайнерийн ажил надад яг миний хайж байсан зүйлийг олж өгсөн. Хэрэглэгчийн асуудлыг шийдэх, үнэ цэнтэй шийдэл бүтээхэд оролцож байгаадаа баяртай байдаг. Одоогоор хэрэглэгчийн судалгаа, дизайн систем, прототип хийх ур чадвараа сайжруулж, багтайгаа илүү үр дүнтэй хамтран ажиллахыг зорьж байна. Цаашдаа бодит нөлөө үзүүлдэг, хэрэглэгч төвтэй шийдэл гаргадаг дизайнер болохыг хүсэж байна. Хэрэглэгчдэд үнэхээр хэрэгтэй зүйлийг бүтээж чадсан тэр мэдрэмж л надад урам өгдөг.
                </div>
            )}

            {activeTab === "Туршлага" && (
                <div className="border border-gray-200 py-5 px-6 rounded-xl bg-white space-y-3">
                    <div className="flex gap-3">
                        <img src="https://media.licdn.com/dms/image/v2/C560BAQHdAaarsO-eyA/company-logo_200_200/company-logo_200_200/0/1630637844948/apple_logo?e=2147483647&v=beta&t=pOXzU29XHyAnHt2zp2JryxZvMBdKpqxkkbDWtZ_pnEk" className="w-8 h-8 rounded-full object-center object-cover" />
                        <div>
                            <h6 className="text-sm font-medium">Pinecone Academy</h6>
                            <p className="text-sm text-neutral-600">2024 • 05 • 12 - 2025 • 05 • 12</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex gap-2">
                            <div className="pt-2">
                                <svg width="6" height="6" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="1" cy="1" r="1" fill="#000000" />
                                </svg>
                            </div>

                            <p>UX/UI дизайны чиглэлээр нэг жилийн турш онол, практикийг хослуулан тууштай суралцаж, бодит төслүүд дээр ажилласан туршлагатай.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="pt-2">
                                <svg width="6" height="6" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="1" cy="1" r="1" fill="#000000" />
                                </svg>
                            </div>

                            <p>Хэрэглэгчийн ярилцлага, судалгаа хийж, хэрэглэгчийн урсгал, wireframe болон интерактив прототипийг Figma ашиглан боловсруулсан.</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="pt-2">
                                <svg width="6" height="6" viewBox="0 0 2 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="1" cy="1" r="1" fill="#000000" />
                                </svg>
                            </div>

                            <p>Багийн орчинд хамтран ажиллаж, дизайнаа хөгжүүлэгчидтэй уялдуулан хэрэгжүүлэх туршлага хуримтлуулсан. Одоогоор хэрэглэгч төвтэй шийдэл боловсруулах ур чадвараа гүнзгийрүүлэн хөгжүүлж байна.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}