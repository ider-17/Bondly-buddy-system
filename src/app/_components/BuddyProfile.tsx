"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CalendarDays, Mail, Phone } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export interface BuddyProfile {
  id: string;
  email: string;
  phone_number?: bigint | number;
  created_at?: string;
  name?: string;
  rank?: string;
  profile_pic?: string;
  interests?: string[];
}

export default function BuddyProfile() {
  const [buddies, setBuddies] = useState<BuddyProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBuddyProfiles() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("users")
          .select("id, email, phone_number, created_at, name, rank, profile_pic, interests")
          .eq("role", "buddy");

        if (error) {
          console.error("Error fetching buddy profiles:", error);
        } else if (data) {
          const buddyProfiles: BuddyProfile[] = data.map((buddy) => ({
            id: buddy.id,
            email: buddy.email,
            phone_number: buddy.phone_number,
            created_at: buddy.created_at,
            name: buddy.name || "Unknown",
            rank: buddy.rank || "Buddy",
            profile_pic: buddy.profile_pic || null,
            interests: buddy.interests || [],
          }));
          setBuddies(buddyProfiles);
        }
      } catch (error) {
        console.error("Error in fetchBuddyProfiles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBuddyProfiles();

    // Set up real-time subscription for buddy profile changes
    const buddiesSubscription = supabase
      .channel("buddy_profiles_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "users",
          filter: "role=eq.buddy",
        },
        (payload) => {
          fetchBuddyProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(buddiesSubscription);
    };
  }, []);

  // Format date helper function
  const formatDate = (dateString?: string) => {
    if (!dateString) return "2025 • 06 • 12";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year} • ${month} • ${day}`;
  };

  // Generate avatar fallback from name or email
  const getAvatarFallback = (buddy: BuddyProfile) => {
    if (buddy.name) {
      return buddy.name.charAt(0).toUpperCase();
    }
    if (buddy.email) {
      return buddy.email.charAt(0).toUpperCase();
    }
    return "B";
  };

  if (loading) {
    return (
      <div className="space-y-5">
        {[1, 2].map((index) => (
          <div key={index} className="w-full py-5 px-6 rounded-xl border border-gray-200 bg-white space-y-5">
            {/* Profile Header Skeleton */}
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <Skeleton className="h-10 w-40 rounded-lg" />
            </div>

            <Separator />

            {/* Contact Info Cards Skeleton */}
            <div className="flex gap-5">
              {[1, 2, 3].map((cardIndex) => (
                <div key={cardIndex} className="w-1/3 rounded-lg border border-gray-200 bg-white py-2 px-6 space-y-3">
                  <Skeleton className="w-6 h-6" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>
    );
  }

  if (buddies.length === 0) {
    return (
      <div className="w-full py-10 px-6 rounded-xl border border-gray-200 bg-white text-center">
        <p className="text-gray-500">Одоогоор buddy байхгүй байна.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {buddies.map((buddy) => (
        <div key={buddy.id} className="w-full rounded-xl border border-gray-200 bg-white space-y-5">
          <div className="flex justify-between items-center py-5 px-6 mb-0">
            <div className="flex gap-3">
              <Avatar className="w-16 h-16">
                {buddy.profile_pic ? (
                  <AvatarImage
                    src={buddy.profile_pic}
                    alt={`${buddy.name}'s avatar`}
                    onError={(e) => {
                      console.error("Failed to load avatar image:", buddy.profile_pic);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                  {getAvatarFallback(buddy)}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-lg font-medium">{buddy.name}</h2>
                <p className="text-neutral-500 text-sm font-medium">{buddy.rank}</p>
              </div>
            </div>

            <a
              href="https://mail.google.com/mail/?view=cm&to=tugsbilegenkh@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-2 rounded-lg py-2 px-5 text-white bg-blue-500 cursor-pointer hover:bg-blue-600 transition-colors"
            >
              <Mail size={20} color="white" />
              <p className="text-sm">Холбогдох</p>
            </a>

          </div>

          <Separator className="mb-0" />

          <div className="flex gap-5 py-5 px-6">
            <div className="w-1/3 rounded-lg border border-gray-200 bg-white py-2 px-6 space-y-3">
              <Mail size={24} color="black" />
              <div>
                <p className="text-neutral-500 text-xs font-medium">И-мэйл</p>
                <p className="text-sm font-medium">{buddy.email}</p>
              </div>
            </div>

            <div className="w-1/3 rounded-lg border border-gray-200 bg-white py-2 px-6 space-y-3">
              <Phone size={24} color="black" />
              <div>
                <p className="text-neutral-500 text-xs font-medium">Утасны дугаар</p>
                <p className="text-sm font-medium">
                  {buddy.phone_number ? `+976 ${buddy.phone_number}` : "Бүртгэгдээгүй"}
                </p>
              </div>
            </div>

            <div className="w-1/3 rounded-lg border border-gray-200 bg-white py-2 px-6 space-y-3">
              <CalendarDays size={24} color="black" />
              <div>
                <p className="text-neutral-500 text-xs font-medium">Эхэлсэн хугацаа</p>
                <p className="text-sm font-medium">{formatDate(buddy.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}