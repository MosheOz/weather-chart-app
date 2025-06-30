// app/not-found.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/"); // redirect to home
  }, [router]);

  return <p>Redirecting to home...</p>;
}
