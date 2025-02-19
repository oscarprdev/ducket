export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-[400px] p-6">{children}</div>
      </div>
    </main>
  );
}
