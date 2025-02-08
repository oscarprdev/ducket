export default async function OverviewPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Overview</h1>
      </div>
    </>
  );
}
