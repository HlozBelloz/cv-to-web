import { Metadata } from 'next';
import { dataStore } from '@/lib/store';
import { ProfileViewer } from '@/components/cv/ProfileViewer';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return [{ slug: 'mazen' }, { slug: 'mohamedcv' }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await dataStore.getProfileBySlug(slug);

  if (!profile) {
    return {
      title: 'Candidate Portfolio | CVtoWeb',
      description: 'Convert PDF CV into an executive portfolio website.'
    };
  }

  const desc = profile.tagline || (profile.summary ? profile.summary.substring(0, 160) : '') || `${profile.fullName}'s verified professional portfolio and credentials.`;
  const images = profile.avatarUrl ? [{ url: profile.avatarUrl, width: 800, height: 800, alt: profile.fullName }] : [];

  return {
    title: `${profile.fullName} | ${profile.title}`,
    description: desc,
    keywords: [profile.fullName, profile.title, ...(profile.skills || []).slice(0, 8), 'Executive Portfolio', 'CV Website'],
    authors: [{ name: profile.fullName }],
    openGraph: {
      title: `${profile.fullName} — ${profile.title}`,
      description: desc,
      type: 'profile',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${profile.fullName} — ${profile.title}`,
      description: desc,
      images: profile.avatarUrl ? [profile.avatarUrl] : [],
    },
  };
}

export default async function CandidateCvPage({ params }: Props) {
  const { slug } = await params;
  const profile = await dataStore.getProfileBySlug(slug);

  if (profile) {
    // Increment profile views
    await dataStore.incrementViewCount(slug).catch(() => {});
  }

  return <ProfileViewer slug={slug} initialProfile={profile} />;
}

