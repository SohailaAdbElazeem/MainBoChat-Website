// src/app/profile/[id]/actions.ts
"use server";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2ODc3ZDU0OTdiMDRhM2M4Mzc1OWYxMjIiLCJyb2xlIjpbImRlbGV0ZSIsInJlcG9ydCIsInB1Ymxpc2giLCJhZGQiLCJibG9ja2VkQ29udGVudCIsImJsb2NrIiwidmVyaWZ5IiwiYWNjZXB0Iiwid2F0Y2giXSwiaWF0IjoxNzYzNTkxNTU3LCJleHAiOjE3NjQxOTYzNTd9.vIgAat1Kq4Y4fLKhGeGaYKj0l4KD0bChVkmyouWFVcY"; // ← ضع التوكن المؤقت هنا

export async function verifyUser(formData: FormData) {
  const id = formData.get("id") as string | null;
  if (!id) return;

  try {
    const res = await fetch(`https://bo-chat.space/users/${id}/verify`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ verified: true }),
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("verify failed:", res.status, txt);
    }
  } catch (err) {
    console.error("verify error:", err);
  }
}
