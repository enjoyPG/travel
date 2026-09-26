"use client";

import { useState, type FormEvent } from "react";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const result = await response.json();
      setMessage(result.error ?? result.message ?? "메일 전송 결과를 확인하지 못했습니다.");
    } catch {
      setMessage("연결에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  return <form className="admin-login-form" onSubmit={submit}>
    <label htmlFor="admin-email">관리자 이메일</label>
    <input id="admin-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" />
    <button type="submit" disabled={busy}>{busy ? "보내는 중…" : "로그인 링크 받기"}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
