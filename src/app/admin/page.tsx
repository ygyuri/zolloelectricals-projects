'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/admin/session', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(data.ok === true);
        setChecking(false);
        if (data.ok) router.replace('/admin/projects');
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-primary-1 flex items-center justify-center">
        <p className="text-white">Checking session…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-1 flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold text-white mb-6">Projects Admin</h1>
      <Link
        href="/admin/login"
        className="rounded-xl bg-accent-blue text-white px-6 py-3 font-medium hover:opacity-90"
      >
        Log in
      </Link>
    </div>
  );
}
