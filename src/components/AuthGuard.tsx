"use client";

import { useAuth } from "@/hooks/useAuth";

export default function AuthGuard() {
  useAuth();
  return null;
}