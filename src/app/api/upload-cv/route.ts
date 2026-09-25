import { NextRequest, NextResponse } from 'next/server';
import { parsePdfCV } from '@/lib/ai-parser';
import { dataStore } from '@/lib/store';
import { CVProfile } from '@/types';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const requestedSlug = formData.get('slug') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No PDF file was uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Persist PDF file locally in public/uploads for instant downloading (if filesystem is writable)
    let originalPdfUrl = '';
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const cleanFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadsDir, cleanFileName);
      fs.writeFileSync(filePath, buffer);
      originalPdfUrl = `/uploads/${cleanFileName}`;
    } catch (fsErr) {
      console.warn('Filesystem write skipped (edge/serverless environment):', fsErr);
    }

    // Run AI Extraction Engine
    const { profile: extracted, source } = await parsePdfCV(buffer, file.name);

    // Determine final unique slug
    let finalSlug = (requestedSlug || extracted.slug || file.name.replace('.pdf', '') + 'cv')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/^-+|-+$/g, '');

    if (!finalSlug || finalSlug.length < 3) {
      finalSlug = `cv-${Math.random().toString(36).substring(2, 7)}`;
    }

    // Check if slug is already taken
    const existing = await dataStore.getProfileBySlug(finalSlug);
    if (existing) {
      finalSlug = `${finalSlug}-${Math.floor(Math.random() * 100)}`;
    }

    const fullProfile: CVProfile = {
      id: `profile-${Date.now()}`,
      slug: finalSlug,
      fullName: extracted.fullName || 'Candidate Professional',
      title: extracted.title || 'Senior Executive / Specialist',
      tagline: extracted.tagline || 'Driving strategic growth, technical excellence, and measurable impact.',
      email: extracted.email || 'candidate@example.com',
      phone: extracted.phone,
      location: extracted.location || 'Cairo, Egypt / Remote',
      linkedinUrl: extracted.linkedinUrl,
      githubUrl: extracted.githubUrl,
      portfolioUrl: extracted.portfolioUrl,
      summary: extracted.summary || 'A seasoned professional with deep industry experience and dedication to technical and leadership excellence.',
      originalPdfUrl,
      theme: 'executive',
      metrics: extracted.metrics || [
        { label: 'Experience', value: '5+ Years', description: 'Industry leadership' },
        { label: 'Projects', value: '20+', description: 'Delivered successfully' },
        { label: 'Satisfaction', value: '100%', description: 'Client & team feedback' }
      ],
      experiences: extracted.experiences || [],
      education: extracted.education || [],
      skillGroups: extracted.skillGroups || [],
      projects: extracted.projects || [],
      certifications: extracted.certifications || [],
      isPublished: true,
      viewCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dataStore.saveProfile(fullProfile);

    return NextResponse.json({
      success: true,
      slug: fullProfile.slug,
      url: `/cv/${fullProfile.slug}`,
      profile: fullProfile,
      aiSource: source,
      message: 'CV successfully converted to executive website!'
    });
  } catch (err: unknown) {
    console.error('Error in /api/upload-cv:', err);
    const message = err instanceof Error ? err.message : 'Internal server error while processing CV';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
