"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  // 🔥 REDIRECT AFTER LOGIN
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">Scheduler App</h1>

      <button
        onClick={() => signIn("github")}
        className="bg-black text-white px-6 py-2 rounded"
      >
        Login with GitHub
      </button>
    </main>
  );
}