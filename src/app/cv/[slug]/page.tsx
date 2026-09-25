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
    };
  }

  return {
    title: `${profile.fullName} | ${profile.title}`,
    description: profile.tagline || profile.summary.substring(0, 160),
    openGraph: {
      title: `${profile.fullName} — Executive Portfolio`,
      description: profile.tagline,
      type: 'profile',
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

