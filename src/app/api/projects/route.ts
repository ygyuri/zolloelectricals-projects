import { NextRequest, NextResponse } from 'next/server';
import { getProjects, addProject } from '@/lib/projects-store';
import type { Project } from '@/types/project';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects);
  } catch (e) {
    console.error('GET /api/projects', e);
    return NextResponse.json(
      { error: 'Failed to load projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { title, description, category, imageUrl, imageUrls } = body;
    const imgUrl = imageUrl || (Array.isArray(imageUrls) && imageUrls[0]) || '';
    const categories = Array.isArray(category)
      ? category
      : typeof category === 'string'
        ? [category]
        : [];
    const project = await addProject({
      title: String(title || 'Untitled'),
      description: String(description || ''),
      category: categories,
      imageUrl: String(imgUrl),
    });
    return NextResponse.json(project);
  } catch (e) {
    console.error('POST /api/projects', e);
    return NextResponse.json(
      { error: 'Failed to add project' },
      { status: 500 }
    );
  }
}
