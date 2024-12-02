'use client'
import { Chatbot } from "@/components/chatbot";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/'); // Redirect to landing page if not logged in
    }
  }, [user, router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {user && <Chatbot />} {/* Render Chatbot only if user is authenticated */}
    </main>
  );
}