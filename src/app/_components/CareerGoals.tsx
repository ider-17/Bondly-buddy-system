"use client"

import { useState } from "react";

export default function CareerGoals() {
    const tabs = ["Career Goals", "Background"]

    const [activeTab, setActiveTab] = useState("Career Goals");
    return (
        <div className="w-full">
            <div className="flex-1 mb-5">
                <div className="bg-gray-100 rounded-xl p-1 flex justify-between w-full">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full py-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${activeTab === tab ? "bg-white shadow text-black" : "text-gray-600"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="border border-neutral-300 py-5 px-6 rounded-lg bg-slate-50">
                <h6 className="text-lg font-semibold mb-3">Career Goals</h6>
                <p className="text-neutral-600 font-medium">Би хэрэглэгч төвтэй сэтгэлгээтэй, бүтээлч шийдлээр жинхэнэ үнэ цэнэ бүтээдэг UX/UI дизайнер болохыг зорьдог. Ойрын хугацаанд олон төрлийн төслүүд дээр ажиллаж, хэрэглэгчийн судалгаа, дизайн систем, прототип бүтээх ур чадвараа хөгжүүлэхийг хүсэж байна.</p>
            </div>
        </div>
    )
}