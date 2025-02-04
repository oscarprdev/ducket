import Link from 'next/link';

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main>
      {id}
      <Link href="/dashboard">Go back</Link>
      <Link href={`/dashboard/${id}/api-keys`}>Go to api keys</Link>
    </main>
  );
}
