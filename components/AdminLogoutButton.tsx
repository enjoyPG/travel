"use client";

import { useState } from "react";

export function AdminLogoutButton() {
  const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null);
    window.location.assign("/admin/login");
  }
  return <button type="button" className="admin-logout" onClick={logout} disabled={busy}>로그아웃</button>;
}
