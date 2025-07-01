import { Calendar, Mail, MailIcon, PhoneCall, Shapes, ShapesIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"



interface UserProfile {
  email: string
  phone_number?: string
  joined_at?: string
  name?: string
  role?: string
  avatar_url?: string
}

export default function InternYouGuiding() {

  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    async function fetchUserProfile() {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) return

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!error && data) {
        setProfile({
          email: data.email,
          phone_number: data.phone_number,
          joined_at: data.created_at?.split("T")[0] || "2025-06-12",
          name: data.name || "Unknown",
          role: data.role || "Newbie",
          avatar_url: data.avatar_url || "https://github.com/shadcn.png"
        })
      }
    }

    fetchUserProfile()
  }, [])

  return (
    <div className="bg-white rounded-xl border border-slate-200 ">

      <h6 className="font-semibold py-5 px-6 space-y-5 text-xl">Таны Newbie</h6>

      <hr></hr>


      <div className="py-5 px-6">
        <div className="mb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-15 h-15">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <h6 className="text-base font-medium">Тогтуун</h6>
                <p className="text-[#525252] text-sm font-medium">UX/UI Designer</p>
              </div>
            </div>

            <div className="flex gap-5 w-fit">
              <div className="border border-neutral-300 rounded-lg py-2 px-6 flex gap-2 font-medium items-center justify-center cursor-pointer hover:bg-sky-100 active:bg-black active:text-white select-none">
                <Dialog>
                  <DialogTrigger>Дэлгэрэнгүй</DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        <div className="flex items-center gap-3 text-black" >
                          <Avatar className="w-15 h-15">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-base font-medium">Тогтуун</div>
                            <div className="text-[#525252] text-sm font-medium">UX/UI Designer</div>
                          </div>
                        </div>
                      </DialogTitle>
                      <DialogDescription>

                        <hr className="mt-4" />

                        <div className="flex justify-between mt-5 gap-4 text-black">
                          <div className="flex-1 border p-4 rounded-xl bg-white">
                            <MailIcon />
                            <div className="mt-2">Mail</div>
                            <div>Togtuun@apple.com</div>
                          </div>
                          <div className="flex-1 border p-4 rounded-xl bg-white">
                            <PhoneCall />
                            <div className="mt-2">Phone number</div>
                            <div>+976 99101234</div>
                          </div>
                          <div className="flex-1 border p-4 rounded-xl bg-white">
                            <Calendar />
                            <div className="mt-2">Started</div>
                            <div>2025 06 12</div>
                          </div>
                        </div>



                        <div className="w-full py-5 h-fit px-6 mt-5 border text-black border-neutral-300 rounded-xl bg-white">
                          <div className="flex items-center">
                            <div className="text-lg font-semibold">Сонирхлууд</div>
                          </div>

                          <div className="flex flex-wrap gap-4 mt-4">
                            <div className="text-sm font-semibold py-1 px-[10px] bg-slate-100 rounded-full">🎬 Movies & Tv Shows</div>
                            <div className="text-sm font-semibold py-1 px-[10px] bg-slate-100 rounded-full">📚 Books & Reading</div>
                            <div className="text-sm font-semibold py-1 px-[10px] bg-slate-100 rounded-full">🎨 Art & Design</div>
                            <div className="text-sm font-semibold py-1 px-[10px] bg-slate-100 rounded-full">🏋️‍♂️ Fitness & Gym</div>
                            <div className="text-sm font-semibold py-1 px-[10px] bg-slate-100 rounded-full">🤖 Ai & Robotics</div>
                          </div>
                        </div>

                        <div className="w-full py-5 h-fit px-6 mt-5 border border-neutral-300 text-black rounded-xl bg-white">
                          <div className="flex gap-3 items-center">
                            <div className="text-lg font-semibold">Карьерийн зорилго</div>
                          </div>

                          <div className="flex flex-wrap space-y-3 mt-4">
                            UX/UI дизайнерийн ажил надад яг миний хайж байсан зүйлийг олж өгсөн. Хэрэглэгчийн асуудлыг шийдэх, үнэ цэнтэй шийдэл бүтээхэд оролцож байгаадаа баяртай байдаг. Одоогоор хэрэглэгчийн судалгаа, дизайн систем, прототип хийх ур чадвараа сайжруулж, багтайгаа илүү үр дүнтэй хамтран ажиллахыг зорьж байна. Цаашдаа бодит нөлөө үзүүлдэг, хэрэглэгч төвтэй шийдэл гаргадаг дизайнер болохыг хүсэж байна. Хэрэглэгчдэд үнэхээр хэрэгтэй зүйлийг бүтээж чадсан тэр мэдрэмж л надад урам өгдөг.
                          </div>
                        </div>

                        <div className="w-full py-5 h-fit px-6 mt-5 border border-neutral-300 text-black rounded-xl bg-white">
                          <div className="flex gap-3 items-center">
                            <div className="text-lg font-semibold">Танилцуулга</div>
                          </div>

                          <div className="flex flex-wrap space-y-3 mt-4">
                            Сайн уу👋 Намайг Тогтуун гэдэг. Би UX/UI дизайны чиглэлээр дадлага хийж байгаа intern. Шинэ орчин, шинэ баг хамт олон дунд ажиллаж байгаа болохоор өдөр бүр л шинэ зүйл сурч, өөрийгөө хөгжүүлэхийг хүсэж байна. 😊 Өмнө нь хэрэглэгчтэй ярилцлага хийж үзсэн, wireframe зураад, Figma дээр дизайн гаргаж байсан туршлагатай. Бас багтайгаа хамтран ажиллах, санаагаа илэрхийлэх тал дээр ч суралцаж байгаа. Та надтай хамгийн ойрхон байж, зөвлөгөө өгч, чиглүүлж байх Primary buddy болж байгаад үнэхээр баярлаж байгаа байна. ✨ Ямар нэг зүйлд эргэлзвэл хандах хүн байгаа гэдэг мэдрэмж өөртөө итгэх итгэлийг нэмдэг юм байна. Хэрвээ цаг гарвал миний ажлын талаар санал, зөвлөгөө өгч байгаарай 🙌
                          </div>
                        </div>

                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="rounded-lg py-2 px-6 flex gap-2 items-center justify-center font-medium bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-700 select-none">
                <Mail color="white" />
                <p className="text-white">Холбогдох</p>
              </div>
            </div>
          </div>
        </div>


        <div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-sm font-medium text-neutral-600">
              Энэ долоо хоногийн зорилго:
            </p>
          </div>
          <p>Шинэ ажилтантайгаа 1:1 уулзалт товлоорой 🙌</p>
        </div>
      </div>
    </div>
  );
}
