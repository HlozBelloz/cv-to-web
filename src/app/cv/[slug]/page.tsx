import { Metadata } from 'next';
import { dataStore } from '@/lib/store';
import { ExecutiveTheme } from '@/components/theme/ExecutiveTheme';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await dataStore.getProfileBySlug(slug);

  if (!profile) {
    return {
      title: 'Profile Not Found | CVtoWeb',
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 text-2xl font-bold">
            ?
          </div>
          <h1 className="text-2xl font-bold">Candidate Portfolio Not Found</h1>
          <p className="text-slate-400 text-sm">
            The link <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300">/cv/{slug}</code> does not exist or has not been published yet.
          </p>
          <a
            href="/upload"
            className="inline-block mt-4 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all"
          >
            Create Your CV Website Now
          </a>
        </div>
      </div>
    );
  }

  // Increment profile views
  await dataStore.incrementViewCount(slug);

  return <ExecutiveTheme profile={profile} />;
}
