'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AddProjectForm } from '@/components/AddProjectForm';

export default function AdminProjectsPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch('/api/admin/session', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        setAuthenticated(data.ok === true);
        setChecking(false);
        if (!data.ok) router.replace('/admin/login');
      })
      .catch(() => {
        setChecking(false);
        router.replace('/admin/login');
      });
  }, [router]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    router.replace('/admin/login');
    router.refresh();
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-primary-1 flex items-center justify-center">
        <p className="text-white">Loading…</p>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-primary-1 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white">Add project</h1>
          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-xl bg-white/10 text-white px-4 py-2 text-sm font-medium hover:bg-accent-blue"
            >
              View site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-white/10 text-white px-4 py-2 text-sm font-medium hover:bg-red-600/80"
            >
              Log out
            </button>
          </div>
        </div>
        <AddProjectForm />
      </div>
    </div>
  );
}
