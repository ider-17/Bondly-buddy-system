import { Hand } from "lucide-react";

export default function Introduction() {
    return (
        <div className="w-full border border-neutral-300 py-5 px-6 bg-slate-50 rounded-xl">
            <div className="flex gap-3 items-center mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Hand size={18} color="#3B82F6" />
                </div>

                <h6 className="text-lg font-semibold">Introduction</h6>
            </div>

            <p>Сайн уу👋. Намайг Тайванбат гэдэг. Би энэ компанид 4 дэх жилдээ ажиллаж байна. Чиний Primary Buddy-гийн хувьд onboarding-ийн бүх хугацаанд тогтмол дэмжлэг үзүүлэх хүн чинь байх болно✨. 4 жилийн хугацаанд олон төрлийн төсөл дээр ажиллаж, шинэ гишүүдийг амжилттай адапт хийхэд нь тусалж байсан туршлагатай. Би UX/UI дизайны чиглэлээр мэргэшсэн бөгөөд олон салбарын хамтарсан төслүүдийг удирдан ажиллаж байсан туршлагатай. Хамгийн анхны өдрөөс эхлээд бүх үе шатанд чамайг дэмжинэ🤗. Асуух, санал солилцох зүйл байвал хэзээд нээлттэй шүү🙌</p>
            
        </div>
    )
}