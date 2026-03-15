'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'duelwg6z9';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export function AddProjectForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || 'Upload failed');
    }
    const data = await res.json();
    return data.secure_url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!files?.length) {
      setError('Select at least one image.');
      return;
    }
    setUploading(true);
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i]);
        urls.push(url);
      }
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title || 'Untitled project',
          description: description || '',
          category: category ? category.split(',').map((c) => c.trim()).filter(Boolean) : [],
          imageUrl: urls[0],
          imageUrls: urls,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to save project');
      }
      setSuccess(true);
      setTitle('');
      setDescription('');
      setCategory('');
      setFiles(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-card-bg p-6 text-card-text shadow-xl">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
          placeholder="e.g. School Campus Lighting"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
          placeholder="Short description of the project"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium mb-1">
          Categories (comma-separated)
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
          placeholder="e.g. Schools, Interior lighting"
        />
      </div>
      <div>
        <label htmlFor="images" className="block text-sm font-medium mb-1">
          Images (first used as cover)
        </label>
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Project added. It will appear on the site shortly.</p>}
      <button
        type="submit"
        disabled={uploading || !UPLOAD_PRESET}
        className="w-full rounded-xl bg-accent-blue text-white py-2.5 font-medium hover:opacity-90 disabled:opacity-50"
      >
        {uploading ? 'Uploading and saving…' : 'Add project'}
      </button>
      {!UPLOAD_PRESET && (
        <p className="text-sm text-amber-600">
          Set NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in Vercel to enable image uploads.
        </p>
      )}
    </form>
  );
}
